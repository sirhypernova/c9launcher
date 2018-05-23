module.exports = function (app, config, db, proxy, c9) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    // Body Parser
    app.use((req,res,next) => {
        res.locals.name = config.name;
        if (req.session.auth) {
            res.locals.user = req.session.user;
            res.locals.db = db;
            res.locals.config = config;
            res.locals.ip = require("ip").address();
            next();
        } else {
            if (req.path != '/') return res.redirect('/');
            bodyParser.urlencoded({extended: true})(req,res,next);
        }
    });
    
    function get (req, res) {
        if (req.session.auth) {
            db.Workspace.all('SELECT * FROM workspaces').then(ws => {
               res.render('home',{page: 'Home', error: false, workspaces: ws, c9: c9}); 
            });
        } else {
            res.render('login',{page: 'Login', error: false}); 
        }
    }
    
    function post (req, res) {
        if (req.session.auth) {
            db.Workspace.all('SELECT * FROM workspaces').then(ws => {
               res.render('home',{page: 'Home', error: false, workspaces: ws, c9: c9}); 
            });
            return;
        }
        if (req.body.username && req.body.password){
            db.User.get('SELECT * FROM users WHERE username = ?',req.body.username).then(d => {
               if (d != undefined) {
                   db.Config.get('SELECT* FROM config WHERE key = ?','Admins Only').then(c => {
                      if (c._value == 'true' && d._admin == 0) res.render('login',{page: 'Login', error: 'Only admins may log in.'});
                      bcrypt.compare(req.body.password,d._password).then(is => {
                          if (is) {
                              req.session.auth = true;
                              req.session.user = d.asObject;
                              res.redirect('back');
                          } else {
                              res.render('login',{page: 'Login', error: 'Incorrect username or password'});
                          }
                       }); 
                   });
               } else {
                   res.render('login',{page: 'Login', error: 'Incorrect username or password'});
               }
            });
        } else {
            res.render('login',{page: 'Login', error: 'Missing one or more parameters.'});
        }
    }
    
    return {
        get: get,
        post: post,
        else: (req,res) => {
            res.send('Invalid Method.');
        }
    };
}