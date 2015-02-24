# Microsoft Azure Table Storage Explorer

[![Dependency Status](https://david-dm.org/jpoon/StorageExplorer.svg)](https://david-dm.org/jpoon/StorageExplorer)
[![devDependency Status](https://david-dm.org/jpoon/StorageExplorer/dev-status.svg)](https://david-dm.org/jpoon/StorageExplorer#info=devDependencies)

##Context
While developing my Azure app on my Arch Linux box, I realized that there is no multi-platform Azure Storage Explorer solution. This project was created to satisfy that need. 

As its name suggests, Azure Table Storage Explorer is a web-based Azure table storage explorer. 

##Getting Started

The app is broken into two components: server and client. To start the app, run the server:

* `cd /server`
* `npm install`
* `npm install -g grunt-cli`
* `grunt`

Run the client:

* `cd /client`
* `npm install`
* `ember serve`