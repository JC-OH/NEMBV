const User = require('../../../../models/users');

exports.in = (req, res) => {
    const { id, pwd } = req.body;

    if (id === undefined) return res.send({ success: false, msg: 'param err id' });
    if (pwd === undefined) return res.send({ success: false, msg: 'param err pwd' });

    User.findOne()
        .where('id').equals(id)
        .then((r) => {
            if (!r) throw new Error('id not exists');
            if (pwd !== r.pwd) throw new Error('password diff');
            res.send({ success: true, token: 'xxxx' });
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.out = (req, res) => {
    res.send({ success: true });
};