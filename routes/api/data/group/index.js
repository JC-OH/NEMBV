const router = require('express').Router();
const ctrl = require('./ctrls');
// CRUD(post, get, put, delete)를 할 수 있도록 각 라우터 정의를 한다.
router.get('/', ctrl.list);
router.post('/', ctrl.add);
router.put('/', ctrl.mod);
router.delete('/', ctrl.del);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;