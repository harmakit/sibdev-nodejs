var sanitizeHtml = require('sanitize-html');
var db = require('../models');
var joi = require('joi');

module.exports.create = async function (req, res, done) {
  try{

    var schema = joi.object().keys({
      title: joi.string().min(10).max(150).required(),
      description: joi.string().min(10).max(300).required(),
      text: joi.string().min(10).max(1000).required()
    });

    var valid = await joi.validate({
      title: req.body.title,
      description: req.body.description,
      text: req.body.text,
    }, schema);

    var sanitizedTitle = await sanitizeHtml(req.body.title, {
      allowedTags: [ 'b', 'i', 'em', 'strong' ]
    });

    var sanitizedDescription = await sanitizeHtml(req.body.description, {
      allowedTags: [ 'b', 'i', 'em', 'strong' ]
    });

    var sanitizedText = await sanitizeHtml(req.body.text, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
      allowedAttributes: sanitizeHtml.defaults.allowedAttributes
    });

    newPost = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      text: sanitizedText,
      userId: req.user.id
    }

    if (sanitizedTitle != req.body.title){
      await done(null, false, req.flash('message', 'Title allowed tags are: [b, i, em, strong]' ));
      await res.redirect('/post/new');
    }

    if (sanitizedDescription != req.body.description){
      await done(null, false, req.flash('message', 'Description allowed tags are:[b, i, em, strong]' ));
      await res.redirect('/post/new');
    }

    if (sanitizedText != req.body.text){
      await done(null, false, req.flash('message', 'Text allowed tags are: [ h3, h4, h5, h6, blockquote, p, a, ul, ol, nl, li, b, i, strong, em, strike, code, hr, br, div,  table, thead, caption, tbody, tr, th, td, pre ] and allowed attributes are: a: [href, name, target], img: [src]' ));
      await res.redirect('/post/new');
    }

    console.log(newPost);
    var result = await db.post.create(newPost);
    await res.redirect('/post/' + result.id);

  } catch (err){

    console.error(err);
    await done(null, false, req.flash('message', err.details[0].message));
    await res.redirect('/post/new');

  }
}

module.exports.getPost = async function (req, res) {
  try{

    var post = await db.post.findOne({
      include: [{
        model: db.user
      }],
      where: {
        id: req.params.id
      }
    });

    if (!post){
      await res.redirect('/');
    }
    var owner = 0;
    var admin = 0;

    if (req.isAuthenticated()){

      if (req.user.id == post.userId){
        owner = 1;
      };
      if (req.user.admin == 1){
        admin = 1;
      };

      await res.render('postAuth', {
        post: post,
        owner: owner,
        admin: admin
      });
    }
    else{
      await res.render('post', {
        post: post,
        owner: owner,
        admin: admin
      });
    }

  } catch (err){

    console.error(err);
    await res.redirect('/');

  }
}

module.exports.getPosts = async function (req, res) {
  try{

    var limit = 10;
    var page = req.params.page || 1;
    var offset = (page - 1) * limit;
    var count = await db.post.count();
    var ifMoreThanOneThanForward = count/(limit*page);

    var posts = await db.post.findAll({
      include: [{
        model: db.user
      }],
      limit: limit,
      offset: offset
    });

    if (posts.length == 0){
      await res.redirect('/');
    }

    if (req.isAuthenticated()){

      await res.render('indexAuth', {
        posts: posts,
        page: page,
        ifMoreThanOneThanForward: ifMoreThanOneThanForward
      });
    }
    else{
      await res.render('index', {
        posts: posts,
        page: page,
        ifMoreThanOneThanForward: ifMoreThanOneThanForward
      });
    }

  } catch (err){
    console.error(err);
    await res.redirect('/');

  }
}
