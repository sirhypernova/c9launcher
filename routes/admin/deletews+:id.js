module.exports = function (app, config, db, proxy, c9) {
    return {
        all: (req,res) => {
            db.Workspace.get('SELECT * FROM workspaces WHERE id = ?',req.params.id).then(ws => {
                if (ws != undefined) {
                    var child = c9.getChild(ws._key);
                    if (child) c9.kill(ws._key);
                    ws.delete();
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            });
        }
    }
}