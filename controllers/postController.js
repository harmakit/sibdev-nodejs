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
      allowedTags: sanitizeHtml.defaults.allowedTags,
    });

    newPost = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      text: sanitizedText,
      userId: req.user.id
    }

    if (sanitizedTitle != req.body.title){
      await done(null, false, req.flash('message', 'Title allowed tags are: [b, i, em, strong]' ));
      await res.redirect('/create');
    }

    if (sanitizedDescription != req.body.description){
      await done(null, false, req.flash('message', 'Description allowed tags are:[b, i, em, strong]' ));
      await res.redirect('/create');
    }

    if (sanitizedText != req.body.text){
      await done(null, false, req.flash('message', 'Text allowed tags are: [ h3, h4, h5, h6, blockquote, p, a, ul, ol, nl, li, b, i, strong, em, strike, code, hr, br, div,  table, thead, caption, tbody, tr, th, td, pre ]' ));
      await res.redirect('/create');
    }

    console.log(newPost);
    var result = await db.post.create(newPost);
    await res.redirect('/post/');

  } catch (err){

    console.error(err);
    await done(null, false, req.flash('message', err.details[0].message));
    await res.redirect('/create');

  }
}
