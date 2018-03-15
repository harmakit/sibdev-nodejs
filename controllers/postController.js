var sanitizeHtml = require('sanitize-html');
var db = require('../models');
var joi = require('joi');

module.exports.createPost = async function (req, res, done) {
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
      allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'b', 'i', 'blockquote', 'pre', 'a'],
      allowedAttributes: {
        a: [ 'href'],
        img: [ 'src', 'alt' ],
        selfClosing: [ 'img']
      }
    });

    newPost = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      text: sanitizedText,
      userId: req.user.id
    }

    if (sanitizedTitle != req.body.title){
      await done(null, false, req.flash('message', 'Title allowed tags are: [b, i, em, strong]' ));
      await res.render('postForm', {
        messages: req.flash('message'),
        post: newPost,
        buttonEdit: false
      });
    }
    else{
      if (sanitizedDescription != req.body.description){
        await done(null, false, req.flash('message', 'Description allowed tags are:[b, i, em, strong]' ));
        await res.render('postForm', {
          messages: req.flash('message'),
          post: newPost,
          buttonEdit: false
        });
      }
      else{
        if (sanitizedText != req.body.text){
          await done(null, false, req.flash('message', 'Text allowed tags are: [ p,b, i, em, strong, h1-h6, img, b, i, blockquote, pre, a] and allowed attributes are: a: [href], img: [src, alt]' ));
          await res.render('postForm', {
            messages: req.flash('message'),
            post: newPost,
            buttonEdit: false
          });
        }
        else{
          console.log(newPost);
          var result = await db.post.create(newPost);
          await res.redirect('/post/' + result.id);
        }
      }
    }


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

module.exports.getPostForEditing = async function (req, res) {
  try{

    if (req.isAuthenticated()){

      var post = await db.post.findOne({
        where: {
          id: req.params.id
        }
      });

      var owner = 0;
      var admin = 0;

      if (req.user.id == post.userId){
        owner = 1;
      };
      if (req.user.admin == 1){
        admin = 1;
      };

      if (owner || admin){
        if (post){
          await res.render('postForm', {
            messages: req.flash('message'),
            post: post,
            buttonEdit: true
          });
        }
        else{
          await res.redirect('/');
        }
      }
      else{
        await res.redirect('/');
      }
    }
    else{
      await res.redirect('/');
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
      offset: offset,
      order: [
        ['createdAt']
      ]
    });

    if (posts.length == 0 && page > 1){
      await res.redirect('/');
    }

    if (req.isAuthenticated()){
      if (posts.length == 0){
        await res.render('indexAuth',{
          posts: false
        });
      }
      await res.render('indexAuth', {
        posts: posts,
        page: page,
        ifMoreThanOneThanForward: ifMoreThanOneThanForward
      });
    }
    else{
      if (posts.length == 0){
        await res.render('index',{
          posts: false
        });
      }
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

module.exports.getPostsByUser = async function (req, res) {
  try{

    var posts = await db.post.findAll({
      include: [{
        model: db.user
      }],
      where: {
        userId: req.params.id
      },
      order: [
        ['createdAt']
      ]
    });

    var user = await db.user.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!user){
      await res.redirect('/');
    }

    if (posts.length == 0){
      req.flash('message', "User has no posts")
    }

    if (req.isAuthenticated()){
      if (req.params.id == req.user.id){
        await res.render('authorAuth', {
          my: true,
          user: user,
          posts: posts,
          messages: req.flash('message')
        });
      }
      else{
        await res.render('authorAuth', {
          my: false,
          user: user,
          posts: posts,
          messages: req.flash('message')
        });
      }

    }
    else{
      await res.render('author', {
        my: false,
        user: user,
        posts: posts,
        messages: req.flash('message')
      });
    }


  } catch (err){
    console.error(err);
    await res.redirect('/');

  }
}

module.exports.getMyPosts = async function (req, res) {
  try{

    var my = true;
    if (!req.isAuthenticated()){
      await res.redirect('/');
    }
    else{

      var posts = await db.post.findAll({
        include: [{
          model: db.user
        }],
        order: [
          ['createdAt']
        ],
        where: {
          userId: req.user.id
        }
      });

      if (posts.length == 0){
        req.flash('message', "User has no posts")
      }


      await res.render('authorAuth', {
        my: my,
        user: req.user,
        posts: posts,
        messages: req.flash('message')
      });
    }
  } catch (err){
    console.error(err);
    await res.redirect('/');

  }
}

module.exports.deletePost = async function (req, res) {
  try{

    if (req.isAuthenticated()){

      var post = await db.post.findOne({
        where: {
          id: req.params.id
        }
      });

      var owner = 0;
      var admin = 0;

      if (req.user.id == post.userId){
        owner = 1;
      };
      if (req.user.admin == 1){
        admin = 1;
      };

      if (owner || admin){
        await post.destroy();
      }
    }
    await res.redirect('/');

  } catch (err){
    console.error(err);
    await res.redirect('/');
  }
}

module.exports.editPost = async function (req, res, done) {

  try{

    var post = await db.post.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!post){
      await res.redirect('/');
    }

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
      allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'b', 'i', 'blockquote', 'pre', 'a'],
      allowedAttributes: {
        a: [ 'href'],
        img: [ 'src', 'alt' ]
      },
      selfClosing: [ 'img']
    });

    if (sanitizedTitle != req.body.title){
      await done(null, false, req.flash('message', 'Title allowed tags are: [b, i, em, strong]' ));
      await res.render('postForm', {
        messages: req.flash('message'),
        post: post,
        buttonEdit: true
      });
    }
    else{
      if (sanitizedDescription != req.body.description){
        await done(null, false, req.flash('message', 'Description allowed tags are:[b, i, em, strong]' ));
        await res.render('postForm', {
          messages: req.flash('message'),
          post: post,
          buttonEdit: true
        });
      }
      else{
        if (sanitizedText != req.body.text){
          await done(null, false, req.flash('message', 'Text allowed tags are: [ p,b, i, em, strong, h1-h6, img, b, i, blockquote, pre, a] and allowed attributes are: a: [href], img: [src, alt]' ));
          await res.render('postForm', {
            messages: req.flash('message'),
            post: post,
            buttonEdit: true
          });
        }
        else{
          await post.update({
            title: sanitizedTitle,
            description: sanitizedDescription,
            text: sanitizedText
          });
          await res.redirect('/post/' + post.id);
        }
      }
    }

  } catch (err){

    console.error(err);
    await done(null, false, req.flash('message', err.details[0].message));
    await res.render('/postForm', req.flash('message') );

  }
}
