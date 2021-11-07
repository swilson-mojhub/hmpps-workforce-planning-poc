const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes/index');
const serviceAreaRouter = require('./routes/servicearea');
const teamRouter = require('./routes/team');
const stageRouter = require('./routes/stages');

const app = express();

nunjucks.configure(
  [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/pages'),
    'node_modules/govuk-frontend/govuk',
  ], {
    autoescape: true,
    express: app,
  },
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/govuk-frontend', express.static(path.join(__dirname, '../node_modules/govuk-frontend/govuk')));
app.use('/assets', express.static(path.join(__dirname, '../node_modules/govuk-frontend/govuk/assets')));

app.use('/', indexRouter);
app.use('/', serviceAreaRouter);
app.use('/', teamRouter);
app.use('/', stageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
