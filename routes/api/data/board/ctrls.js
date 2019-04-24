const Board = require('../../../../models/boards');
const Comment = require('../../../../models/comments');

exports.list = (req, res) => {
    let { draw, search, skip, limit, order, sort } = req.query;

    if(draw === undefined) return res.send({ success: false, msg: 'param err draw' });
    if(search === undefined) return res.send({ success: false, msg: 'param err search' });
    if(skip === undefined) return res.send({ success: false, msg: 'param err skip' });
    if(limit === undefined) return res.send({ success: false, msg: 'param err limit' });
    if(order === undefined) return res.send({ success: false, msg: 'param err order' });
    if(sort === undefined) return res.send({ success: false, msg: 'param err sort' });

    skip = parseInt(skip);
    limit = parseInt(limit);
    sort = parseInt(sort);

    const d = {
        draw: draw,
        cnt: 0,
        ds: [],
    };

    Board.count()
        .where('title').regex(search)
        .then((c) => {
            // d.cnt, d.ds 의 데이터를 만드는 용도
            d.cnt = c;
            const s = {}
            s[order] = sort;
            return Board.find()
                .where('title').regex(search)
                // select(‘ut id title cntView cmt_ids’) 리스트만 불러올 것이기 때문에 불러올 필드만 선택한다.
                // cmt_ids(댓글)의 경우 id들만 들어있다. 길이를 이용해 개수를 세는 정도로만 이용(데이터 절약)
                .select('ut id title cntView cmt_ids')
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
};


exports.read = (req, res) => {
    // content를 포함한 문서 전체를 읽어온다.
    const f = { _id: req.params._id };
    // 읽을 때마다 cntView를 증가시킨다($inc).
    const s = { $inc: { cntView: 1 }};
    const o = { new: true };
    // content를 포함한 문서 전체를 읽어온다.
    Board.findOneAndUpdate(f, s, o)
    // .where('_id').equals(_id)
    // .select('content')
        // cmt_ids 가 populate 되었기 때문에 안에 들어 있는 내용이 전부 나온다.
        .populate('cmt_ids')
        .then((d) => {
            res.send({success: true, d: d});
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.add = (req, res) => {
    // id, title, content를 받아서 추가한다
    const { id, title, content } = req.body;
    console.log(req.body);

    if (!id) res.send({success: false, msg : 'id not exists'});
    if (!content) res.send({success: false, msg : 'content not exists'});

    const bd = new Board({
        id: id,
        title: title,
        content: content,
    });
    bd.save()
        .then(() => {
            res.send({success: true});
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.mod = (req, res) => {
    // 글 수정, 수정한 시간을 갱신
    const set = req.body;

    if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
    if (!set._id) return res.send({ success: false, msg: 'id not exitst' });
    set.ut = new Date();

    const f = { _id: set._id };
    const s = { $set: set };

    Board.findOneAndUpdate(f, s)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({ success: false, msg: err.message });
        });
};

exports.del = (req, res) => {
    // 현재 보드를 찾아서 속해있는 댓글을 다 지우고 자신(보드)도 삭제
    const { _id } = req.query;

    if (!_id) return res.send({ success: false, msg: 'id not exists' });
    let cp;
    Board.findOne({ _id: _id })
        .then((r) => {
            cp = r;
            return Comment.remove({ _id: { $in: r.cmt_ids }});
        })
        .then(() => {
            return Board.remove({ _id: _id });
        })
        .then(() => { // { n: 1, ok: 1 }
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({ success: false, msg: err.message });
        });
};