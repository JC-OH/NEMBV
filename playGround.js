// 일단 모델이 만들어 졌으면 당장 쓰고 읽고 싶은데 api router까지 적용하기엔 너무 멀고 복잡하기 때문에 나 같은 경우 놀이터를 하나 만들어 놓고 모듈테스트를 진행한다.

// 여기서 중요한 것 하나는 굳이 모델 이름을 왜 companies라고 했는지다
// mongoose는 자동으로 컬렉션을 만들때 복수 로 만드는데 단순히 뒤에 s가 붙는 경우가 아닌
// 사전적인 의미가 있는 단어는 mongoose가 굳이! 컬렉션이름을 사전적 복수명으로 변경한다..
// 그러므로 groups, tables, rows 등은 s만 붙지만…
// person -> people, company -> companies, 가 되니 mongoose로만 읽고 쓸때는 상관 없느나
// native-mongo driver로 처리할 때 기겁할 수 있으니 주의…
const Company = require('./models/companies');
const Group = require('./models/groups');

exports.test = {
    model: () => {
        console.log('모델 테스트');
        //-----------------------------------------------------
        //- company test
        //-----------------------------------------------------
        // [쓰기]
        // 정상적으로 ‘모델 테스트’라고 떳다면 컴패니에 데이터를 넣어보자
        if (false) {
            const cp = new Company({
                // name만 적었지만 기본값이 들어가 있는 것을 확인할 수 있다.
                name: '테스트',
            });

            // save method는 추가한 객체를 반환한다. insert method는 성공유무를 반환
            // mongoose 5부터는 모든 반환을 promise로 받을 수 있다. 추후 promise 편 보강
            cp.save()
                .then((r) => {
                    console.log(r);
                })
                .catch(err => console.error(err));
            // { pos: { lat: 37.1, lng: 127.1 },
            //     type: 0,
            //         rmk: '신규',
            //     gr_ids: [],
            //     _id: 5cc0ace2048c8f107c6b51fb,
            //     name: '테스트',
            //     ut: 2019-04-24T18:37:22.559Z,
            //     __v: 0 }

            // __v는 mongoose에서 자동으로 부여하는 필드다. 무슨 용도인지는 잘 모르겠지만 냅두자
        }



        // [읽기]
        // 하나를 썼으니 이번엔 읽기만 해본다..
        if (false) {
            Company.findOne({ name: '테스트' })
                .then((r) => {
                    console.log(r);
                })
                .catch(err => console.error(err));

            // { pos: { lat: 37.1, lng: 127.1 },
            //     type: 0,
            //         rmk: '신규',
            //     gr_ids: [],
            //     _id: 5cc0ace2048c8f107c6b51fb,
            //     name: '테스트',
            //     ut: 2019-04-24T18:37:22.559Z,
            //     __v: 0 }

        }

        //-----------------------------------------------------
        //- group test
        //-----------------------------------------------------
        // 그룹은 조금 난이도가 있는데 company와 엮여 있기 때문이다.
        //
        // company가 없는 group은 존재할 수 없다고 칠 경우 그렇다.

        // [쓰기]
        if (false) {
            // 컴패니의 _id를 얻기위해 ‘테스트’ 인 컴패니를 검색한다.
            Company.findOne({ name: '테스트' })
                .then((cp) => {
                    console.log(cp);
                    // 그룹 추가가 어려운 이유는 company _id를 꼭 알아야 하기 때문이다.
                    // 그룹 이름과 컴패니 _id로 그룹을 생성한다.
                    const gr = new Group({
                        name: '소속2',
                        cp_id: cp._id,
                    });
                    return gr.save();
                })
                .then((gr) => {
                    console.log(gr);
                    // 리턴된 그룹 _id를 컴패니의 gr_ids(array)에 추가한다.
                    // update 결과는 nModified: 1 로 확인이 되었다.
                    return Company.updateOne,({ _id: gr.cp_id }, { $addToSet: { gr_ids : gr._id }});
                })
                .then((r) => {
                    console.log(r);
                })
                .catch(err => console.error(err));
            // Company
            // { pos: { lat: 37.1, lng: 127.1 },
            //     type: 0,
            //         rmk: '신규',
            //     gr_ids: [],
            //     _id: 5cc0ace2048c8f107c6b51fb,
            //     name: '테스트',
            //     ut: 2019-04-24T18:37:22.559Z,
            //     __v: 0 }

            // Group
            // { rmk: '',
            //     _id: 5cc0af0d6da1a215fcb004ea,
            //     name: '소속1',
            //     cp_id: 5cc0ace2048c8f107c6b51fb,
            //     ut: 2019-04-24T18:46:37.086Z,
            //     __v: 0 }

            // { n: 1, nModified: 1, ok: 1 }
        }

        // [개선된 쓰기]
        // nModified: 1 로 잘되었다는 소식은 들었지만 실제 데이터를 확인해 보고 싶을 것이다..
        // 그리고 앞으로 api에서 보내줘야할 정보 또한 추가된 데이터다.
        if (true) {
            Company.findOne({ name: '테스트' })
                .then((cp) => {
                    // company가 없을 수도 있기 때문에 예외처리함 promise chain에서 나갈 때는 꼭 throw로 보내야한다.
                    // return할 경우 다음 then으로 간다
                    if (!cp) throw new Error('회사가 존재하지 않음');
                    const gr = new Group({
                        name: '소속3',
                        cp_id: cp._id,
                    });
                    return gr.save();
                })
                .then((gr) => {
                    // 전에 update에서는 수행 유무만 나왔지만 findOneAndUpdate와 맨 마지막 { new: true } 옵션으로 수행 유무 대신 갱신된 도큐를 출력한다.
                    // populate(‘gr_ids’)로 해당 그룹 2개에 대한 내용이 각각 출력되었다. populate는 추후 다시 언급
                    return Company.findOneAndUpdate(
                        { _id: gr.cp_id },
                        { $addToSet: { gr_ids : gr._id }},
                        { new: true })
                        .populate('gr_ids');
                })
                .then((r) => {
                    console.log(r);
                })
                .catch(err => console.error(err));
            /* 출력
            populate(‘gr_ids’)로 해당 그룹 2개에 대한 내용이 각각 출력되었다. populate는 추후 다시 언급
            { pos: { lat: 37.1, lng: 127.1 },
              type: 0,
              rmk: '신규',
              gr_ids:
               [ { rmk: '',
                   ut: 2018-03-19T12:26:12.946Z,
                   _id: 5aafac643ab6dc27e71e07af,
                   name: '소속1',
                   cp_id: 5aafa3a8f8b7a8274f97560e,
                   __v: 0 },
                 { rmk: '',
                   ut: 2018-03-19T12:36:47.415Z,
                   _id: 5aafaedf408fdb27f5d6181c,
                   name: '소속2',
                   cp_id: 5aafa3a8f8b7a8274f97560e,
                   __v: 0 } ],
              ut: 2018-03-19T11:48:56.838Z,
              _id: 5aafa3a8f8b7a8274f97560e,
              name: '테스트',
              __v: 0 }
             */
        }

    },
};
