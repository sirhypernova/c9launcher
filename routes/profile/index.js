module.exports = function (app, config, db, proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use('/profile',(req,res,next) => {
        res.locals.error = false;
        res.locals.success = false;
        bodyParser.urlencoded({extended: true})(req,res,next);
    });
    
    function get (req,res) {
        res.render('profile',{page: 'Profile'});
    }
    
    function post (req,res) {
        if (req.body.currentpass && req.body.newpass && req.body.confpass) {
            db.User.get('SELECT * FROM users WHERE id = ?',req.session.user.id).then(u => {
                u.checkPassword(req.body.currentpass).then(correct => {
                   if (!correct) return res.render('profile',{page: 'Profile', error: 'Incorrect password.'});
                   if (req.body.newpass != req.body.confpass) return res.render('profile',{page: 'Profile', error: 'Passwords do not match.'});
                   u.setPassword(req.body.newpass);
                   u.save();
                   return res.render('profile',{page: 'Profile', success: 'Changed password successfully!'});
                });
            });
        } else {
            res.render('profile',{page: 'Profile', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}