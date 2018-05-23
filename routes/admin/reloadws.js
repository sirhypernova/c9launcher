module.exports = function (app, config, db, proxy, c9) {
    const fs = require('fs');
    const path = require('path');
    return {
        all: (req,res) => {
            c9._workspaces = fs.readdirSync(this._wsd).filter(name => {
                return !name.startsWith('.')
            }).filter(name => {
                return fs.statSync(path.resolve(this._wsd,name)).isDirectory()
            });
            res.redirect('back');
        }
    }
}