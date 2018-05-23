const fs       = require('fs');
const path     = require('path');
const klaw     = require('klaw');
const through2 = require('through2');

module.exports = function (app,config,db,proxy,c9,cryptr) {
    return function loadRoutes(dir) {
        return new Promise((resolve,reject) => {
           klaw(dir,{depthLimit: -1})
            .pipe(through2.obj(function (item, enc, next) {
                if (!item.stats.isDirectory()) this.push(item);
                next();
            }))
            .on('data',function (file) {
                var route = file.path.replace(path.resolve(config.routes),'').replace('.js','').replace('index','').replace('+','/');
                var run = require(file.path)(app, config, db, proxy, c9, cryptr);
                app.all(route,(req,res) => {
                    if ('all' in run) {
                        run['all'](req,res);
                    } else {
                        if (req.method.toLowerCase() in run) {
                            run[req.method.toLowerCase()](req,res);
                        } else if ('else' in run) {
                            run['else'](req,res);
                        } else {
                            res.send('Invalid Method.');
                        }
                    }
                });
            })
            .on('end',resolve);
        });
    }
}