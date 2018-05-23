module.exports = function (app, config, db, proxy, c9) {
    const fs = require('fs');
    const path = require('path');
    return {
        all: (req,res) => {
            c9._workspaces = fs.readdirSync(c9._wsd).filter(name => {
                return !name.startsWith('.')
            }).filter(name => {
                return fs.statSync(path.resolve(c9._wsd,name)).isDirectory()
            });
            res.redirect('back');
        }
    }
}