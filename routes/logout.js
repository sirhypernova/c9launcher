module.exports = function (app, config, db, proxy) {
    return {
        all: (req,res) => {
            if (req.session.auth) delete req.session.auth;
            if (req.session.user) delete req.session.user;
            res.redirect('/');
        }
    }
}