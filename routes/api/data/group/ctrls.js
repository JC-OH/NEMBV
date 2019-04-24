const Company = require('../../../../models/companies');
const Group = require('../../../../models/groups');

exports.list = (req, res) => {
    let { draw, search, skip, limit, order, sort, cp_id } = req.query;

    if(draw === undefined) return res.send({ success: false, msg: 'param err draw' });
    if(search === undefined) return res.send({ success: false, msg: 'param err search' });
    if(skip === undefined) return res.send({ success: false, msg: 'param err skip' });
    if(limit === undefined) return res.send({ success: false, msg: 'param err limit' });
    if(order === undefined) return res.send({ success: false, msg: 'param err order' });
    if(sort === undefined) return res.send({ success: false, msg: 'param err sort' });

    skip = parseInt(skip);
    limit = parseInt(limit);
    sort = parseInt(sort);
    let d = {
        draw: draw,
        cnt: 0,
        ds: [],
    };

    let f = {};
    if (cp_id) f.cp_id = cp_id;
    // 그룹입장에서 populate를 cp_id로 해서 컴패니 정보를 같이 보낸다.
    Group.count(f)
        .where('name').regex(search)
        .then((c) => {
            d.cnt = c;
            const s = {}
            s[order] = sort;
            return Group.find(f)
                .where('name').regex(search)
                .populate('cp_id')
                .sort(s)
                .skip(skip)
                .limit(limit);
        })
        .then((ds) => {
            d.ds = ds;
            res.send({success: true, d: d});
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
}

exports.add = (req, res) => {
    const { name, cp_id } = req.body;
    if (!cp_id) return res.send({success: false, msg : 'cp_id not exists'});
    if (!name) return res.send({success: false, msg : 'name not exists'});
    const gr = new Group({ name: name, cp_id: cp_id });
    gr.save()
        .then((r) => {
            const f = { _id: r.cp_id };
            // 그룹 추가는 회사에 의존적이기 때문에 회사 gr_ids에 $addToSet으로 추가된 아이디를 넣는다.
            // $addToSet은 중복된 것은 넣지 않기 때문에 $push 보다 유용하다.
            const s = { $addToSet: { gr_ids: r._id }};
            return Company.updateOne(f, s);
        })
        .then((r) => {
            if(!r.nModified) return res.send({ success: false, msg : 'already group' });
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
}

exports.mod = (req, res) => {
    const set = req.body;
    if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
    if (!set._id) return res.send({ success: false, msg: 'id not exitst' });
    const f = { _id: set._id };
    const s = { $set: set };
    Group.findOneAndUpdate(f, s)
        .then((r) => {
            res.send({ success: true });
        })
        .catch((err) => {
            if (err) console.error(err);
            res.send({ success: false, msg: err.message });
        });
}

exports.del = (req, res) => {
    const _id = req.query._id;
    if (!_id) return res.send({ success: false, msg : 'param id not exists' });
    Group.findOne({_id:_id})
        .then((r) => {
            if (!r) throw new Error('group not exists');
            const f = { _id: r.cp_id };

            // 그룹 제거는 회사에 의존적이기 때문에 회사 gr_ids에서 $pull로 아이디를 제거한다.
            const s = { $pull: { gr_ids: r._id }};
            return Company.updateOne(f, s);
        })
        .then(() => { // { n: 1, nModified: 1, ok: 1 }
            return Group.remove({ _id: _id });
        })
        .then(() => { // { n: 1, ok: 1 }
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
}