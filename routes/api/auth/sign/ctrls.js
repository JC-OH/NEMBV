const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const cfg = require('../../../../cfg/cfg');
const User = require('../../../../models/users');

exports.in = (req, res) => {
    const { id, pwd } = req.body;

    if (id === undefined) return res.send({ success: false, msg: 'param err id' });
    if (pwd === undefined) return res.send({ success: false, msg: 'param err pwd' });

    // User.findOne()
    //     .where('id').equals(id)
    //     .then((r) => {
    //         if (!r) throw new Error('id not exists');
    //         if (pwd !== r.pwd) throw new Error('password diff');
    //         res.send({ success: true, token: 'xxxx' });
    //     })
    //     .catch((err) => {
    //         res.send({success: false, msg : err.message});
    //     });
    User.findOne()
        .where('id').equals(id)
        .then((r) => {
            if (!r) throw new Error('id not exists');
            if (pwd !== r.pwd) throw new Error('password diff');
            // set 해두었던 jwt-secret을 이용해 토큰을 만든다.
            const secret = req.app.get('jwt-secret');
            const p = new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        _id: r._id,
                        id: r.id,
                        email: r.email
                    },
                    secret,
                    {
                        // 시험용으로 만기시간(expiresIn)을 2분으로 낮게 잡았다.
                        // 유효기간 2분짜리 토큰을 전송한다.
                        expiresIn: '2m',
                        issuer: cfg.web.host,
                        subject: 'user-token'
                    }, (err, token) => {
                        if (err) reject(err);
                        resolve(token);
                    })
            })
            return p;
        })
        .then((tk) => {
            res.send({ success: true, token: tk });
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.out = (req, res) => {
    res.send({ success: true });
};