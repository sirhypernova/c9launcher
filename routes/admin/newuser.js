module.exports = function (app, config, db, proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    function get (req,res) {
        res.render('admin/newuser',{page: 'New User'}); 
    }
    
    function post (req,res) {
        if (req.body.username && req.body.password && req.body.confpass) {
               db.User.get('SELECT id FROM users WHERE username = ?',req.body.username).then(ou => {
                  if (ou == undefined) {
                    if (req.body.password != req.body.confpass) return res.render('admin/newuser',{page: 'New User', error: 'Passwords do not match.'});
                    var u = new db.User(req.body.username,req.body.password,0);
                    if (req.body.admin && req.body.admin == 'on') u._admin = 1;
                    u.save();
                    res.redirect('/admin');    
                  } else {
                    res.render('admin/newuser',{page: 'New User', error: 'A user with that username already exists!'});
                  }
               });
        } else {
            res.render('admin/newuser',{page: 'New User', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}