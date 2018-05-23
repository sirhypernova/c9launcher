module.exports = function (config, db) {
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');
    const kill = require('tree-kill');
    const isPortAvailable = require('is-port-available');
    const { getPortPromise } = require('portfinder');
    
    class Cloud9 {
        constructor(executable,wsd) {
            this._executable = path.resolve(executable);
            this._wsd = path.resolve(wsd);
            this._workspaces = fs.readdirSync(this._wsd);
            this._children = {};
        }
        
        execute(args = []) {
            const child = exec(`node "${this._executable}" ${args.join(' ')}`);
            return child;
        }
        
        start(id, workspace, port, auth, collab = false, localOnly = false) {
            return new Promise(async (resolve,reject) => {
                if (port == false || port == 0) {
                    port = await getPortPromise();
                }
                if (!await isPortAvailable(port)) return reject('Port is not available');
                if (!this._workspaces.includes(workspace)) return reject('Workspace not found');
                var args = [
                   `-p ${port}`,
                   `-w "${path.resolve(this._wsd,workspace)}"`,
                  (collab ? '--collab' : ''),
                  (localOnly ? '--listen localhost' : ''),
                  (auth && auth.username && auth.password ? `-a ${auth.username}:${auth.password}` : '')
                ];
                var child = this.execute(args);
                this._children[id] = {child: child, port: port};
                resolve(child);
            });
        }
        
        kill(id) {
            var child = this.getChild(id).child;
            if (!child) return false;
            if (child.killed) return false;
            kill(child.pid);
            delete this._children[id];
            return true;
        }
        
        getChild(id) {
            return id in this._children ? this._children[id] : false;
        }
    }
    
    return function (executable,wsd) {
        return new Cloud9(executable,wsd);
    }
}