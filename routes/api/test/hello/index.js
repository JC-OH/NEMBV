const router = require('express').Router();
const ctrl = require('./ctrls');

// 굳이 ctrls 모듈을 밖으로 뺀 것은 미리 추후 복잡해질 것을 대비해 계층적으로 나눈 것이다.
// eg) /api/data/list, /api/data/add, /api/data/del, /api/data/mod, 추후 늘어 갈 것이며 CRUD로 post, get, put등이 섞이면 관리가 힘들어진다.
router.get('/plz', ctrl.plz);

// 마찬가지로 localhost:3000/api/test/hello/plz 인 경우만 라우트하고 아닌 경우 404에러를 준다.
router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;