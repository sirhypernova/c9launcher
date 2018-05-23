module.exports = function (app, config, db, proxy, c9) {
    const bcrypt = require('bcrypt');
    const bodyParser = require('body-parser');
    
    function get (req,res) {
        res.render('admin/newws',{page: 'New Workspace', ws: c9._workspaces}); 
    }
    
    function post (req,res) {
        if (req.body.key && req.body.workspace && req.body.username && req.body.password) {
            if (c9._workspaces.includes(req.body.workspace)) {
               db.Workspace.get('SELECT * FROM workspaces WHERE key = ?',req.body.key).then(ws => {
                  if (ws == undefined) {
                    var ws = new db.Workspace(null,req.body.key,req.body.workspace,0,req.body.username,req.body.password);
                    ws.save();
                    res.redirect('/');    
                  } else {
                    res.render('admin/newws',{page: 'New Workspace', error: 'A workspace with that name already exists!',ws: c9._workspaces});
                  }
               });
            } else {
                res.render('admin/newws',{page: 'New Workspace', error: 'Invalid Workspace',ws: c9._workspaces});
            }
        } else {
            res.render('admin/newws',{page: 'New Workspace', error: 'Missing one or more parameters.',ws: c9._workspaces});
        }
    }
    
    return {
        get: get,
        post: post
    }
}