var static = require('node-static');
var http = require('http');
var httpProxy = require('http-proxy');
var config = require('./config');
var fileServer = new static.Server('./public');
var httpproxy = new httpProxy();

require('http').createServer(function (request, response) {

    var url = request.url;
    if (/^\/api\//.test(url)) {
        request.url = request.url.replace(/^\/api\//, config.path);
        httpproxy.web(request, response, { target: config.serverUrl }, function (e) {
            console.log(e);
        });
    }

    request.addListener('end', function () {
        if (!/^\/api\//.test(url)) {
            fileServer.serve(request, response, function (err, result) {
                if (err) { // There was an error serving the file
                    console.error("Error serving " + request.url + " - " + err.message);

                    // Respond to the client
                    response.writeHead(err.status, err.headers);
                    response.end();
                }
            });
        }
    }).resume();
}).listen(config.port);