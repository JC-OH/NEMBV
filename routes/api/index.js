const router = require('express').Router();
const test = require('./test');
const data = require('./data');
const auth = require('./auth');
const check = require('./check');

// 기존 작성해두었던 middleware 부분을 따로 check.js에 따로 정리했다.
// verify는 헤더의 토큰 검사용이며, 다른 미들웨어를 추가 할 수도 있다.
router.all('*', check.verify);

// localhost:3000/api 로 들어 올 경우 모든 요청에 서버 콘솔로 welcome to api를 적는다
router.all('*', (req, res, next) => {
    console.log(req.path + ' welcome to api');
    // 추후 api로 들어오는 요청을 판단하고 넘겨줄 미들웨어가 있을 자리가 된다.

    // [미들웨어가 들어갈 곳]

    // 여기서 중요한 것은 라우팅은 순차적으로 일어나며 next()가 없을 경우 서버는 갈곳을 잃기 때문에 에러가 난다.
    next();
})

// 그 중 localhost:3000/api/test 는 하위 api/test 에서 처리한다
router.use('/test', test);
router.use('/data', data);
// auth 라우터 추가
router.use('/auth', auth);

// localhost:3000/api/abcd 등 test가 아닌 경우 성공 실패와 이유가 담긴 json을 리턴한다.
router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});
module.exports = router;