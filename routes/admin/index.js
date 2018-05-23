module.exports = function (app, config, db, proxy) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use('/admin',(req,res,next) => {
        if (!req.session.user.admin) return res.redirect('/');
        res.locals.error = false;
        res.locals.success = false;
        bodyParser.urlencoded({extended: true})(req,res,next);
    });
    
    function get (req,res) {
        db.User.all('SELECT * FROM users').then(us => {
            db.Config.all('SELECT * FROM config').then(conf => {
                res.render('admin',{page: 'Admin', users: us, config: conf}); 
            });
        });
    }
    
    function post (req,res) {
        if (req.body.id && req.body.value) {
            db.Config.get('SELECT * FROM config WHERE id = ?',req.body.id).then(conf => {
               if (conf != undefined) {
                   conf._value = req.body.value;
                   conf.save();
                   db.User.all('SELECT * FROM users LIMIT 5').then(us => {
                        db.Config.all('SELECT * FROM config').then(conf => {
                            res.render('admin',{page: 'Admin', users: us, config: conf, success: 'Saved config successfully!'}); 
                        });
                    });
               } else {
                   db.User.all('SELECT * FROM users LIMIT 5').then(us => {
                        db.Config.all('SELECT * FROM config').then(conf => {
                            res.render('admin',{page: 'Admin', users: us, config: conf, error: 'Invalid ID'}); 
                        });
                    });
               }
            });
        } else {
            res.render('admin',{page: 'Admin', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post
    }
}