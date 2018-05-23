module.exports = function (app, config, db, proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    function get (req,res) {
        db.User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(user => {
            if (user != undefined) {
                res.render('admin/users',{page: 'User', u: user});
            } else {
                res.render('admin/users',{page: 'User', u: false});
            }
        });
    }
    
    function post (req,res) {
        db.User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(u => {
            if (u != undefined) {
                if (req.body.newpass || req.body.username) {
                   if (req.body.newpass) u.setPassword(req.body.newpass);
                   if (req.body.username && req.body.username != u._username) {
                       db.User.get('SELECT id FROM users WHERE username = ?',req.body.username).then(ou => {
                           if (ou != undefined) {
                               res.render('admin/users',{page: 'User', error: 'A user with that username already exists!', u: u});
                           } else {
                               if (req.body.username) u._username = req.body.username;
                               if (req.body.admin && req.body.admin == 'on') u._admin = 1; else u._admin = 0;
                               u.save();
                               if (u._id == req.session.user.id) {
                                   req.session.user = u.asObject;
                                   return res.render('admin/users',{page: 'User', success: 'Changed account information successfully!', u: u, user: u.asObject});
                               } else {
                                   return res.render('admin/users',{page: 'User', success: 'Changed account information successfully!', u: u});
                               }
                           }
                       });
                   } else {
                       if (req.body.admin && req.body.admin == 'on') u._admin = 1; else u._admin = 0;
                       u.save();
                       if (u._id == req.session.user.id) {
                           req.session.user = u.asObject;
                           return res.render('admin/users',{page: 'User', success: 'Changed account information successfully!', u: u, user: u.asObject});
                       } else {
                           return res.render('admin/users',{page: 'User', success: 'Changed account information successfully!', u: u});
                       }
                   }
                } else {
                    res.render('admin/users',{page: 'User', error: 'Missing one or more parameters.', u: u});
                }
            } else {
                res.render('admin/users',{page: 'User', error: 'That user could not be found.', u: false});
            }
        });
    }
    
    return {
        get: get,
        post: post
    }
}