module.exports = function (app, config, db, proxy) {
    return {
        all: (req,res) => {
            db.User.get('SELECT * FROM users WHERE id = ?',req.params.id).then(user => {
                if (user != undefined) {
                    if (user._admin) return res.redirect('/admin');
                    user.delete();
                    res.redirect('/admin')
                } else {
                    res.redirect('/admin');
                }
            });
        }
    }
}