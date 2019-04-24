const Company = require('../../../../models/companies');

exports.list = (req, res) => {
    //res.send({ success: false, msg: 'list 준비중입니다' });

    // data가 array type 일때는 ds, object type 일 때는 d 로 전송했다.
    Company.find()
        .then(rs => res.send({ success: true, ds: rs }))
        .catch(err => res.send({ success: false, msg: err.message }));
};

exports.add = (req, res) => {
    //res.send({ success: false, msg: 'add 준비중입니다' });
    const { name, rmk } = req.body;
    // add의 경우 추가 기능이기 때문에 post body가 제대로 안채워 있으면 못내려가게 했다.
    if (!name) return res.send({ success: false, msg: '이름 없음' });
    if (!rmk) return res.send({ success: false, msg: '비고 없음' });
    const cp = new Company({ name: name, rmk: rmk });
    cp.save()
        .then(r => res.send({ success: true, d: r }))
        .catch(err => res.send({ success: false, msg: err.message }));
};

exports.mod = (req, res) => {
    res.send({ success: false, msg: 'mod 준비중입니다' });
};

exports.del = (req, res) => {
    res.send({ success: false, msg: 'del 준비중입니다' });
};