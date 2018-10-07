# CHeightAPI

This is a heightmap of Switzerland.
The app is written completely in [TypeScript](https://www.typescriptlang.org/).
[webpack](https://webpack.js.org/) is used to compile it to JavaScript and allowes
me to use the newest features.
The backend is powered by [node.js](https://nodejs.org/en/).
[three.js](https://threejs.org/) is used to render the heightmap with WebGL.


## Setup node process
```
sudo npm install -g pm2
pm2 start /var/www/CHeightAPI/dist/backend.js
pm2 startup systemd
```