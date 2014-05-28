// Modules
var express = require( 'express' ),
    mongoose = require( 'mongoose' ),
    cookieParser = require( 'cookie-parser' ),
    session = require( 'express-session' ),
    bodyParser = require( 'body-parser' ),
    app = express(),
    Schema,
    User;

mongoose.connect( 'mongodb://127.0.0.1/mongodb_mongoose' );

var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:') );

db.once( 'open', function callback() {

    // Define model
    Schema = mongoose.Schema;
    User = mongoose.model( 'User', new Schema({
        first: String,
        last: String,
        email: { type: String, unique: true },
        password: { type: String, index: true }
    }));

    app.listen( 3000, function() {
        console.log( 'express listening on *:3000' );
    });

});

app.use( bodyParser() );
app.use( cookieParser() );
app.use( session({ secret: "something super secret" }) );

app.set( 'view engine', 'jade' );

// Set up some local variables for the template views
app.use( function( req, res, next ) {
    if( req.session.loggedIn ) {
        res.locals.authenticated = true;

        User.findById( req.session.loggedIn, function( err, doc ) {
            if( err ) return next( err );
            res.locals.me = doc;
            next();
        });
    }
    else {
        res.locals.authenticated = false;
        next();
    }
});

// Routes
// =============================
app.get( '/', function( req, res ) {
    res.render( 'index' );
});

app.get( '/login/:signupEmail?', function( req, res ) {
    res.render( 'login', {
        signupEmail: req.params.signupEmail
    });
});

app.post( '/login', function( req, res ) {
    User.findOne({
        email: req.body.user.email,
        password: req.body.user.password
    }, function( err, doc ) {
        if( err ) return next( err );
        if( ! doc ) return res.send( '<p>Invalid username/password</p><p><a href="/login">Try Again</a></p>' );

        req.session.loggedIn = doc._id.toString();
        res.redirect( '/' );
    });
});

app.get( '/logout', function( req, res ) {
    req.session.loggedIn = null;
    // or to clear the session entirely; req.session.regenerate()
    res.redirect( '/' );
});

app.get( '/signup', function( req, res ) {
    res.render( 'signup' );
});

app.post( '/signup', function( req, res, next ) {
    var user = new User( req.body.user );
    user.save( function( err ) {
        if( err ) return next( err );
        res.redirect( '/login/' + encodeURIComponent( user.email ) );
    });
});



