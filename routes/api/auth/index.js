const router = require('express').Router();
const sign = require('./sign');
const register = require('./register');

// auth하위 sign, register 라우터 추가
router.use('/sign', sign);
router.use('/register', register);

// localhost:3000/api/abcd 등 test가 아닌 경우 성공 실패와 이유가 담긴 json을 리턴한다.
router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;