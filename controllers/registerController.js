var db = require('../models');
const joi = require('joi');

module.exports.show = function(req, res) {
  res.render('register')
}

module.exports.register = async function(req, res) {
    try{
      const schema = joi.object().keys({
        name: joi.string().required().alphanum().min(3).max(30),
        password: joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
        repassword: joi.string().required().valid(joi.ref('password')),
        email: joi.string().required().email()
      });

      var valid = joi.validate({
        name: req.body.name,
        password: req.body.password,
        repassword: req.body.repassword,
        email: req.body.email
      }, schema);

      if (valid.error !== null){
        req.flash('error', valid.error.message);
        res.redirect('register');
        return;
      }

      var check_email = await db.user.findOne({
          where: {
            email: req.body.email
          }
        });

      if (check_email) {
        req.flash('error', "User with this email already exists!");
        res.redirect('register');
        return;
      }

      newUser = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
      };

      await db.user.create(newUser);
      res.redirect('/');
      return;

    } catch(err){
    console.error(err);
    req.flash('error', err);
    res.redirect('register');
    }

}
