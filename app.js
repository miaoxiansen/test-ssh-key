var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var superagent = require('superagent'); 

var targetUrl = 'https://www.oschina.net/';
app.get('/', function(req, res) {
	  request(targetUrl, function(error, response, body) {
	    if (!error && response.statusCode == 200) {
	      $ = cheerio.load(body);
	      $('span').each(function(){
	           console.log($(this).text());
	     });
	    }
	  });
	});

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('[master] ' + "start master...");

    for (var i = 0; i < numCPUs; i++) {
         cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });

} else if (cluster.isWorker) {
    console.log('[worker] ' + "start worker ..." + cluster.worker.id);
    http.createServer(function (req, res) {
        console.log('worker'+cluster.worker.id);
        res.end('worker'+cluster.worker.id+',PID:'+process.pid);
    }).listen(3000,"localhost");
}
