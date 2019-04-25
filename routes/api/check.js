const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
    // console.log(req.headers.authorization);
    // console.log(req.path);
    // 로그인 페이지나 회원가입 페이지에서는 토큰이 없으므로 다음 라우터로 간다.
    if (req.path === '/auth/sign/in') return next();
    if (req.path === '/auth/register') return next();
    // 토큰이 비었으면 401에러를 보내준다.
    if (!req.headers.authorization) return res.status(401).send({ success: false, msg: 'authorization empty' });

    const token = req.headers.authorization;
    // 시크릿키로 토큰을 디코드한다.
    jwt.verify(token, req.app.get('jwt-secret'), (err, d) => {
        // 만료되었거나 잘못된 문자열이면 에러에 걸린다.
        if (err) return res.status(401).send({ success: false, msg: 'your token expired' });
        console.log(new Date(d.exp*1000).toLocaleString());
        //req.token에 변환된 값을 저장해둔다. 다음 라우트에서 req.token의 값으로 커스텀한 응답을 줄수 있다. eg) req.token.lang === ‘ko’ 면 한글로
        req.token = d;
        console.log(req.token);
        // iat, exp는 unixtimestamp로 4바이트 정수이므로 시간을 찍어 볼 수 있었다.
        // { _id: '5abb2c234bed101776c74eb6',
        //     id: 'aaaa',
        //     email: 'a@a.aaa',
        //     iat: 1522238762, // 발급한 시간
        //     exp: 1522238882, // 만료 시간
        //     iss: 'localhost:3000', // 발급한 서버
        //     sub: 'user-token' }
        // exp 변환값 : 2018-3-28 21:08:02
        next();
    });
};