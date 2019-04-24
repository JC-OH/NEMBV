const router = require('express').Router();
const ctrl = require('./ctrls');

// get / : 게시물들 리스트
router.get('/', ctrl.list);
// get /:_id : 특정 게시물 전체 가져오기
router.get('/:_id', ctrl.read);
// post: 게시물 등록
router.post('/', ctrl.add);
// put: 게시물 수정
router.put('/', ctrl.mod);
// delete: 게시물 삭제
router.delete('/', ctrl.del);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;