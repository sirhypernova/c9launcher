module.exports = async function (config,cryptr) {
    return new Promise((resolve,reject) => {
        const bcrypt = require('bcrypt');
        const deasync = require('deasync');
        const sqlite3 = require('sqlite3po');
        const db = new sqlite3.Database(config.database);
        
        class User {
            constructor(first,second,third = 0,fourth = 0) {
                if (first == undefined) return;
                if (first % 1 === 0) {
                    this._id = first;
                    this._username = second;
                    this._password = third;
                    this._admin = fourth;
                } else {
                    this._username = first;
                    this._password = second;
                    this._admin = third;
                }
            }
            
            deserialize(row) {
                return new this.constructor(row.id,row.username,row.password,row.admin);
            }
            
            get asObject() {
                var obj = {
                    username: this._username,
                    password: this._password,
                    admin: this._admin
                };
                if (this._id) obj.id = this._id;
                return obj;
            }
            
            setPassword(password) {
                var hash = deasync(bcrypt.hash);
                this._password = hash(password, 10);
            }
            
            checkPassword(password) {
                return new Promise((resolve,reject) => {
                    bcrypt.compare(password,this._password).then(correct => {
                       resolve(correct);
                    });  
                })
            }
            
            serialize() {
                if (this._id) {
                    return {
                        id: this._id,
                        username: this._username,
                        password: this._password,
                        admin: this._admin
                    }
                } else {
                    var hash = deasync(bcrypt.hash);
                    
                    this._password = hash(this._password, 10);
                    
                    return {
                        username: this._username,
                        password: this._password,
                        admin: this._admin
                    }
                }
            }
        }
        
        class Config {
            constructor(id,key,value) {
                this._id = id;
                this._key = key;
                this._value = value;
            }
            
            deserialize(row) {
                return new this.constructor(row.id,row.key,row.value);
            }
            
            serialize() {
                return {
                    id: this._id,
                    key: this._key,
                    value: this._value
                }
            }
        }
        
        class Workspace {
            constructor(id,key,workspace,port,username,password) {
                this._id = id;
                this._key = key;
                this._workspace = workspace;
                this._port = port;
                this._username = username;
                this._password = password;
            }
            deserialize(row) {
                return new this.constructor(row.id,row.key,row.workspace,row.port,row.username,cryptr.decrypt(row.password));
            }
            serialize() {
                return {
                    id: this._id,
                    key: this._key,
                    workspace: this._workspace,
                    port: this._port,
                    username: this._username,
                    password: cryptr.encrypt(this._password)
                }
            }
        }
        
        db.on('open', async () => {
            await db.bindSchema(User,'users',{id:'INTEGER PRIMARY KEY AUTOINCREMENT',username: 'TEXT',password: 'TEXT',admin: 'INTEGER'}).then(() => {
                  User.get('SELECT id FROM users WHERE id = ?',1).then(d => {
                      if (d == undefined) {
                          new User('admin','admin',1).save().then(() => {
                             console.log('Initialized Admin account with username and password as admin.');
                          });
                      }
                  });
            });
            await db.bindSchema(Config,'config',{id:'INTEGER PRIMARY KEY AUTOINCREMENT',key: 'TEXT', value: 'TEXT'}).then(async () => {
               Config.get('SELECT * FROM config WHERE key = ?','Workspace Directory').then(d => {
                   if (d == undefined) {
                       new Config(1,'Workspace Directory','./workspaces').save().then(() => {
                          console.log('Set config for Server Directory');
                          new Config(2,'Admins Only','false').save().then(() => {
                             console.log('Set config for Admins Only');
                          });
                       });
                   }
               });
            });
            await db.bindSchema(Workspace,'workspaces',{id:'INTEGER PRIMARY KEY AUTOINCREMENT',key: 'TEXT',workspace: 'TEXT',port: 'INTEGER',username: 'TEXT',password: 'TEXT'}).then();
            resolve({User: User, Config: Config, Workspace: Workspace});
        });
    });
};
