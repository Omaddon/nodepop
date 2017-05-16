var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./lib/connectMongoose');
require('./models/Anuncio');
const middlewareAuth = require('./routes/middlewareAuth');
const customError = require('./lib/customError');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// -------------------------- RUTAS -------------------------- 
app.post('/auth/signup', require('./routes/auth/authenticate').emailSignup);  
app.post('/auth/login', require('./routes/auth/authenticate').emailLogin);

app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));
app.use('/images/anuncios', middlewareAuth.ensureAuthenticated, require('./routes/images/anuncios'));
app.use('/apiv1/anuncios', middlewareAuth.ensureAuthenticated, require('./routes/apiv1/anuncios'));
// -----------------------------------------------------------


/* ---------------------------- err 404 API ---------------------------- */

app.use((req, res, next) => {

    let idioma = 'es';

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
        idioma = req.headers.language;
    }

    const err = new Error('Not_Found');
    err.code = 'Not_Found'; 
    
    return customError(err, idioma)
      .then((miError) => {
        res.json({success: false, error: miError})
      })
      .catch((e) => {
        next(e);
      });
});
/* ----------------------------------------------------------- */


//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler (error API)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  if (isAPI(req)) {

    let idioma = 'es';

    if ((req.headers.language) && ((req.headers.language === 'es') || (req.headers.language === 'en'))) {
      idioma = req.headers.language;
    }

    return customError(err, idioma)
      .then((miError) => {
        res.json({ success: false, error: miError })
      })
      .catch((err) => {
        next(err);
      });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return ((req.originalUrl.indexOf('/apiv') === 0) 
    || (req.originalUrl.indexOf('/images') === 0 
    || (req.originalUrl.indexOf('/auth') === 0))) ;
}

module.exports = app;
