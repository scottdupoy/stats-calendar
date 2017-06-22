var express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');

// config
var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8'));
console.log('config.http.host:               ' + config.http.host);
console.log('config.http.port:               ' + config.http.port);
console.log('config.ssl.key:                 ' + config.ssl.key);
console.log('config.ssl.cert:                ' + config.ssl.cert);
console.log('config.ssl.ca:                  ' + config.ssl.ca);
console.log('config.session.secret:          ' + config.session.secret);
console.log('config.session.expiryInSeconds: ' + config.session.expiryInSeconds);
console.log('config.facebook.clientID:       ' + config.facebook.clientID);
console.log('config.facebook.clientSecret:   ' + config.facebook.clientSecret);
console.log('config.facebook.callbackURL:    ' + config.facebook.callbackURL);

// local includes
var routes = require('./routes');

// passport setup
/*
passport.use(new facebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {

    }
));
*/

// express
var app = express();
app.get('/', function(req, res) { res.end('stats-calendar test'); });

// ssl
var credentials = {
    key: fs.readFileSync(config.ssl.key, 'utf8'),
    cert: fs.readFileSync(config.ssl.cert, 'utf8'),
};
if (config.ssl.ca) {
    credentials.ca = fs.readFileSync(config.ssl.ca, 'utf8');
}

// server. not listening via http. nginx will redirect for us.
var server = https.createServer(credentials, app);
server.listen(config.http.port, config.http.host, function() {
    console.log('started server listening on https://' + config.http.host + ':' + config.http.port);
});
