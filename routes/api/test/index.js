const router = require('express').Router()
const hello = require('./hello');

router.use('/hello', hello);

// 마찬가지로 localhost:3000/api/test/hello 인 경우만 라우트하고 아닌 경우 404에러를 준다.
router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});

module.exports = router;