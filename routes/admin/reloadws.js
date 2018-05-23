module.exports = function (app, config, db, proxy, c9) {
    const fs = require('fs');
    return {
        all: (req,res) => {
            c9._workspaces = fs.readdirSync(c9._wsd).filter(name => !name.startsWith('.'));
            res.redirect('back');
        }
    }
}