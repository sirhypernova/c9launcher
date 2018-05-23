module.exports = function (app, config, db, proxy, c9) {
    return {
        all: (req,res) => {
            db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
                if (ws != undefined) {
                    var child = c9.getChild(ws._key);
                    if (child) {
                        c9.kill(ws._key);
                    } else {
                        c9.start(ws._key,ws._workspace,ws._port,{username: ws._username, password: ws._password},true);
                    }
                    res.redirect('/')
                } else {
                    res.redirect('/');
                }
            });
        }
    }
}