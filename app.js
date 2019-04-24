var createError = require('http-errors');
var express = require('express');
// path라는 모듈을 쓰는 이유는 윈도우, unix등의 호환 문제 때문이다.
var path = require('path');
//파비콘이 없으면 없으면 약간의 버벅임 때문에 favicon을 등록해두는 것이 좋다. 브라우저는 웹을 뒤지기 전에 주로 파비콘부터 찾기 때문이다.
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

//파비콘이 없으면 없으면 약간의 버벅임 때문에 favicon을 등록해두는 것이 좋다. 브라우저는 웹을 뒤지기 전에 주로 파비콘부터 찾기 때문이다.
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

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

// [백엔드서버]
// - /(fe/dist): vue로 빌드된 정적인 html 요소가 있는 곳을 라우트
// - /(public): 정적인 이미지등이 있는 곳을 라우트
// - /api/* : 데이터베이스와 연동하여 각 요청에 필요한 json 데이터를 응답

// 백엔드에 있는 app.js에서 /fe/dist를 스태틱 라우트 포인트로 추가해본다.
// 이제 최우선 순위로 /fe/dist/index.html을 먼저 라우트 할 것이다
// vue-router가 경로를 http://localhost:3000/#/ 로 바꾸고 vue 시작페이지가 나온 것을 확인 할 수 있다.
app.use(express.static(path.join(__dirname, 'fe', 'dist'))); // added here
app.use(express.static(path.join(__dirname, 'public')));


// route의 [index, users]라는 파일을 각 [/,/users] 로 라우팅을 한것이다.
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 다른 라우트 포인트는 다 비우고 api만 남겼다.
// routes/api를 use 선언한다고하면 하부 디렉토리에서 index.js를 찾아서 실행하게된다.
app.use('/api', require('./routes/api'));


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
  // 그외 페이지 없음은 기존에는 error.pug를 렌더링 했지만 api 요청이기 때문에만 써야할 내용만 남겼다.
  //res.render('error');
  res.send({ success: false, msg: err.message , router: "root"});
});

module.exports = app;
