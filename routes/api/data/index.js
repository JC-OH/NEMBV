// api 설계를 하기전 어떻게 테스트를 하며 기능을 추가하는 지가 중요하다.
// 백엔드 개발자라면 장황하게 api를 작성하고 포스트맨 등으로 테스트를 할 수도 있지만..
// 이미 프론트엔드가 돌아가고 있기 때문에 실제 프론트엔드로 직접 버튼을 추가해서 api 동작 상황부터 체크 해보겠다.

// RESTful api를 사용하기 위한 최소한의 골격으로 진행해보겠다.

const router = require('express').Router();
const company = require('./company');
const group = require('./group');
const board = require('./board'); // add

// comapny와 group을 라우트하고 나머진 404로 보낸다
router.use('/company', company);
router.use('/group', group);
router.use('/board', board);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;