const Company = require('../../../../models/companies');
// [페이징을 위한 최소한의 규칙]
// 요청시
//  - search: 검색어
//  - sortName: 정렬할 필드
//  - sortDir: 정렬 방향
//  -  skip: 어디서부터
//  limit: 최대 몇개까지
// 수신시
// -  totalCount: 총 데이터 개수(검색어로 필터된)
// -  dataCount: 페이징된만큼의 데이터 개수
// -  datas: 실제 데이터들

exports.list = (req, res) => {
    //res.send({ success: false, msg: 'list 준비중입니다' });

    // data가 array type 일때는 ds, object type 일 때는 d 로 전송했다.
    // Company.find()
    //     .then(rs => res.send({ success: true, ds: rs }))
    //     .catch(err => res.send({ success: false, msg: err.message }));

    // draw: 추후 보안+IE에서 같은 요청 오작동 문제 때문에 추가하였다 1씩 증가여 요청

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
    let d = {
        draw: draw,
        cnt: 0,
        ds: [],
    };


    // Company.count(): 먼저 검색어로 필터된 결과만큼의 개수를 받는다.
    Company.count()
        .where('name').regex(search)
        .then((c) => {
            d.cnt = c;
            const s = {}
            // s[order] = sort: 어떤것으로 어떻게 정렬할 것인지의 객체를 정의한다.
            s[order] = sort;
            return Company.find()
                // .where: 등의 문법은 mongoose의 querybuilder 기능이다 대신 find안에 검색 내용을 넣어도 되지만 편리하고 이쁘다.
                .where('name').regex(search)
                // populate: 소속된 그룹데이터까지 보낸다.
                .populate('gr_ids')
                .sort(s)
                .skip(skip)
                .limit(limit);
        })
        .then((ds) => {
            // 정리된 데이터를 d에 담아서 보낸다.
            d.ds = ds;
            res.send({success: true, d: d});
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.add = (req, res) => {
    //res.send({ success: false, msg: 'add 준비중입니다' });
    // const { name, rmk } = req.body;
    // // add의 경우 추가 기능이기 때문에 post body가 제대로 안채워 있으면 못내려가게 했다.
    // if (!name) return res.send({ success: false, msg: '이름 없음' });
    // if (!rmk) return res.send({ success: false, msg: '비고 없음' });
    // const cp = new Company({ name: name, rmk: rmk });
    // cp.save()
    //     .then(r => res.send({ success: true, d: r }))
    //     .catch(err => res.send({ success: false, msg: err.message }));

    // 이름만 넣으면 추가하게 변경
    const { name } = req.body;
    if (!name) res.send({success: false, msg : 'name not exists'});
    const cp = new Company({ name: name });
    cp.save()
        .then(() => {
            res.send({success: true});
        })
        .catch((err) => {
            res.send({success: false, msg : err.message});
        });
};

exports.mod = (req, res) => {
    //res.send({ success: false, msg: 'mod 준비중입니다' });
    const set = req.body;
    // 가변적인 데이터에 대응할 수 있게 객체 자체를 저장한다. 비어있으면 예외처리
    if (!Object.keys(set).length) return res.send({ success: false, msg: 'body not set' });
    // 제일 중요한 것은 _id인데 없으면 리젝이다.
    if (!set._id) return res.send({ success: false, msg: 'id not exitst' });
    set.ut = new Date();

    const f = { _id: set._id };
    const s = { $set: set };
    // findOneAndUpdate 대신 update만 해도 된다 추후 대비 용: 수정후 결과를 봐야할때
    Company.findOneAndUpdate(f, s)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({ success: false, msg: err.message });
        });
};

exports.del = (req, res) => {
    // res.send({ success: false, msg: 'del 준비중입니다' });
    const { id } = req.query;
    // 역시 제일 중요한 것은 _id인데 없으면 리젝이다.
    if (!id) return res.send({ success: false, msg: 'id not exists' });
    let cp;
    // company를 찾아야하는 이유는 소속 그룹을 제거해야하기 때문
    Company.findOne({ _id: id })
        .then((r) => {
            cp = r;
            return Group.remove({ _id: { $in: r.gr_ids }});
        })
        .then(() => {
            return Company.remove({ _id: id });
        })
        .then(() => { // { n: 1, ok: 1 }
            res.send({ success: true });
        })
        .catch((err) => {
            res.send({ success: false, msg: err.message });
        });
};