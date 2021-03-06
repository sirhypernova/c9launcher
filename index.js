const http       = require('http');
const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');
const session    = require('express-session');
const store      = require('connect-sqlite3')(session);
const deasync    = require('deasync');
const app        = express();
const server     = http.createServer(app);
const Cryptr     = require('cryptr');
const path       = require('path');
const port       = process.env.PORT || 8080;
const ip         = process.env.IP || '0.0.0.0';
const config     = require('./config.json');
const cryptr     = new Cryptr(config.crypto);
const database   = require('./db.js')(config,cryptr);
database.then(async db => {
    const cloud9     = require('./cloud9')(config,db);
    const c9         = cloud9(path.resolve(config.sdkpath,'server.js'),(await db.Config.get('SELECT * FROM config WHERE key = ?','Workspace Directory'))._value);
    const proxy      = require('http-proxy').createProxyServer({ws:true});
    const fs         = require('fs');
    
    app.set('view engine', 'ejs');
    
    // Helmet
    app.use(helmet());
    // Session
    app.use(session({
        store: new store({
            db: config.session
        }),
        name: 'rvsess',
        resave: true,
        saveUninitialized: false,
        secret: '3348227453261949266283369121938267059251'
    }));
    
    // Initialize Routes
    
    require('./routes')(app,config,db,proxy,c9,cryptr)('routes').then(() => {
        console.log('Loaded routes successfully.');
        
        // Register 404 Page
        app.use((req,res) => {
           res.render('404',{name: config.name, page: '404'});
        });
        
        // Configure static directory
        app.use(express.static('static'));
    });
    
    app.listen(port,ip, () => {
       console.log(`Server listening at ${ip}:${port}`);
    }); 
});