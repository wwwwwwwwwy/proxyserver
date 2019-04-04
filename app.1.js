var http = require('http');
var httpProxy = require('http-proxy');
var static = require('node-static');
var config = require('./config');
var httpproxy = new httpProxy();

var fileServer = new static.Server('./public');

http.createServer(function (req, res) {

    req.addListener("end", function () {

        console.log(123)

        fileServer.serve(req, res, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + req.url + " - " + err.message);
                // Respond to the client
                res.writeHead(err.status, err.headers);
                res.end();
            }
        });

        // if (!/^\/api\//.test(url)) {
        //     fileServer.serve(req, res, function (err, result) {
        //         if (err) { // There was an error serving the file
        //             console.error("Error serving " + req.url + " - " + err.message);
        //             // Respond to the client
        //             res.writeHead(err.status, err.headers);
        //             res.end();
        //         }
        //     });
        // }
    })

    var url = req.url;

    // if (/^\/api\//.test(url)) {
    //     req.url = req.url.replace(/^\/api\//, config.path);
    //     httpproxy.web(req, res, { target: config.serverUrl }, function (e) {
    //         console.log(e);
    //     });
    // }



}).listen(config.port);