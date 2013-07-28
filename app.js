
/**
 * Module dependencies.
 */

var config = require('./config.js');
var getXml= function(req){
	
	var parseString = require('xml2js').parseString;

    config.init('config.json', function(resp) {
        if (resp != 0) {
            console.log('Could not load config file.');
         return;
        }
    var options = config.url;

	http.get(options, function(res) {
	    console.log('STATUS: ' + res.statusCode);
	    console.log('HEADERS: ' + JSON.stringify(res.headers));
	    res.setEncoding('utf8');
		var pageData = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
		      pageData += chunk;
		 });
		 res.on('end', function(){
	  			parseString(pageData,{trim: true}, function (err, result) {
					// console.log(result.Projects);
					result.Projects.Project.forEach(function(item) {
						console.log(item);
					})
					
					req.io.emit('talk', {
				        message: result
				    });
				
	  		});
		  });
   

	    }).on('error', function(e) {
	        console.log('ERROR: ' + e.message);
	    });

    });    

	}

var express = require('express.io')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.http().io();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.io.route('tray', function(req) {
    
	
	setTimeout(function(){ 
		getXml(req);
		
	 }, 5000);
});
 

app.server.listen(app.get('port'), function(){
   console.log("Express server listening on port " + app.get('port'));
});

