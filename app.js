var createError = require('http-errors');
var express = require('express');
// path라는 모듈을 쓰는 이유는 윈도우, unix등의 호환 문제 때문이다.
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// [라우트 우선순위]
// 현재 라우트 순서는
// - public
// - /
// - /users
// - /알수 없는 페이지


// [정적인 파일]
// 이 항목은 public 디렉토리를 정적인 파일들을 담을 수 있는 그릇으로 만들어준다.
// public에 index.html을 만들어 버렸기 때문에(응답해버림) 2번 항목으로 내려가지 못한것이다.
app.use(express.static(path.join(__dirname, 'public')));

// route의 [index, users]라는 파일을 각 [/,/users] 로 라우팅을 한것이다.
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 만일 없는 패스를 지정하면 어떻게 될까?
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
