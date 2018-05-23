module.exports = function (app, config, db, proxy, c9) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    function get (req,res) {
        db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
            if (ws != undefined) {
                res.render('admin/workspace',{page: 'Workspace', w: ws, ws: c9._workspaces});
            } else {
                res.render('admin/workspace',{page: 'User', w: false});
            }
        });
    }
    
    function post (req,res) {
        if (req.body.key && req.body.workspace && req.body.username) {
            if (c9._workspaces.includes(req.body.workspace)) {
               db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
                  if (ws != undefined) {
                    var child = c9.getChild(ws._key);
                    if (child) c9.kill(ws._key);
                    ws._key = req.body.key;
                    ws._workspace = req.body.workspace;
                    ws._username = req.body.username;
                    if (req.body.password) ws._password = req.body.password;
                    ws.save();
                    res.redirect('/');    
                  }
               });
            } else {
                db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
                    res.render('admin/workspace',{page: 'New Workspace', error: 'Invalid Workspace',ws: c9._workspaces,w: ws});
                });
            }
        } else {
            db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
                res.render('admin/workspace',{page: 'New Workspace', error: 'Missing one or more parameters.',ws: c9._workspaces,w: ws});
            });
        }
    }
    
    return {
        get: get,
        post: post
    }
}