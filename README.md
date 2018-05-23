# c9launcher
### Launcher for instances of Cloud9 IDE

## Get started
On your server, run these commands:
```
git clone https://github.com/sirhypernova/c9launcher.git
cd c9launcher
cp config-example.json config.json
npm install
```
Now, open config.json.
It should look something like this:
```json
{
    "name": "c9 Launcher",
    "database": "c9launcher.db",
    "session": "session.db",
    "crypto": "a secret to encrypt workspace passwords",
    "sdkpath": "/home/c9/c9sdk/"
}
```
Now it is time to clone the Cloud9 SDK to your server.
You can follow the steps to [set it up here](https://github.com/c9/core/).

Once you have completed these steps, enter the path to the Cloud9 SDK directory in `config.json`
Now you are ready to launch c9launcher!

```
npm start
```

This will initialize your database, and your instance will be ready to use.

The default login credentials are as follow:
```
Username: admin
Password: admin
```

When you log in, you will see this:
![After login](https://dogs.are-la.me/8a0aa9.png)

## Change your workspace root directory
Log in to c9launcher, then click on your username in the navigation bar.
Click on Admin.
You will see something that looks like this:
![Admin Panel](https://dogs.are-la.me/e74e41.png)
Change the workspace directory to any directory the server can write to, and press enter to save.

## Create a workspace

On the navigation bar, click `New Workspace`
You should see a screen that looks like this:
![New Workspace](https://dogs.are-la.me/0414dc.png)

Set a name for your workspace, and choose a folder from the dropdown.
Set your username and password you use to authenticate to the workspace.
Once you are done, click submit.

When you are done, you should see something like this:
![Workspace List](https://dogs.are-la.me/ec6196.png)

## Launch Options

You can launch c9launcher with two different options.
These options are stored in environment variables.

`IP`: The IP for the web server to listen on. Defaults to `0.0.0.0`.

`PORT`: The port for the web server to listen on. Defaults to `8080`.