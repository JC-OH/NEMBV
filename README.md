# NEMBV
Node Express Mongo Bootstrap Vue Stack

## config file definition

**cfg/cfg.js**

```javascript
module.exports = {
  db: {
    url: 'mongodb://nembv:비밀번호@cluster0-xxx.mongodb.net:27017,cluster0-xxx.mongodb.net:27017,cluster0-xxx.mongodb.net:27017/nembv?ssl=true&replicaSet=Cluster0-xxx&authSource=admin',
    // url : "mongodb://xxx.com:27170/xxx"
    // url : 'mongodb+srv://id:pwd@cluster0-xxx.net/yyy' // 3.6이상
  },
  web: {
    // 추후 http, https, port등 
  },
};
```

```
module.exports = {
    db: {
        url: ''
    },
    web: {
        // 추후 http, https, port등
        // 개발용과 배포용이 필요하기 때문에 설정값으로 만들어 둔다.
        cors: true, //개발용,
        // 발급자로 사용될 host를 넣어준다.
        host: '',
        // 패스워드를 평문으로 저장하지 않고 시크릿키로 만든 해쉬값으로 저장하기 위함
        secret_key: '',
    }
};
```