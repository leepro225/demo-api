//express 모듈 불러오기
const express = require("express");
const cors = require('cors');
//express 사용
const app = express();

let corsOptions = {
    origin: 'http://localhost:5500',
}

// mariaDB connect
const maria = require('./maria.js');
maria.connect();

app.use(express.json());
app.use(express.urlencoded({ extend: true}));

/**
 * @path http://localhost:3000/ 경로
 */
app.get("/", (req, res) => {
    res.send("Hello World");
});

/**
 * @path {GET} http://localhost:3000/api/users
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */
app.get("/api/users", cors(corsOptions), (req, res) => {
    maria.query('SELECT * FROM USERS', function (err, rows, fields) {
        if(!err) {
            res.send(rows);
        } else {
            res.send(err);
        }
    });

});

/**
 * @path {GET} http://localhost:3000/api/users/user?user_id=1
 * @description Query Params 요청 데이터 값이 있고 반환 값이 있는 GET Method
 * 
 * Query Params 방식
 * 
 */
app.get("/api/users/user", (req, res) => {
    const user_id = req.query.user_id;
    const user = users.filter(data => data.id == user_id);
    res.json({ok: false, user: user});
});

/**
 * @path {GET} http://localhost:3000/api/users/userBody
 * @description get도 body에 데이터를 담아서 보낼 수 있다.
 */
app.get("/api/users/userBody", (req, res) => {
    const user_id = req.body.user_id;
    const user = users.fillter(data => data.id == user_id);
    res.json({ok: false, user: user});
});

/**
 * @path {GET} http://localhost:3000/api/users/:user_id
 * @description path variables 방식
 * ex) 아래 GET 주소 에서 :user_id 는 서버에서 설정한 주소 키 값이다.
 *      값을 찾을 때는 req.params.user_id 로 값을 찾는다.
 * 
 *  *주의 사항*
 *  :user_id 이 부분은 변수이기 때문에 
 *  경로가 /users/1 이거나 /users/2 이거 일때 둘다 라우터를 거치게 된다.
 *  그렇기 때문에 다른 라우터 보다 아래 있어야 한다.
 * 
 */
// app.get("/api/users/:user_id", (req, res) => {
//     const user_id = req.params.user_id;
//     const user = users.filter(data => data.id == user_id);
//     res.json({ok: true, user: user});
// });

/**
 * @path {POST} http://localhost:3000/api/users/add
 * @description POST Method
 */
app.get("/api/users/add", (req, res) => {
     maria.query('INSERT INTO USERS (name) VALUES ("유저4")', function (err, rows, fields) {
        if(!err) {
            res.json(rows);
        } else {
            res.json(err);
        }
    });
});

/**
 * @path {PUT} http://localhost:3000/api/users/update
 * @description 전체 데이터를 수정할 때 사용되는 Method
 */
app.put("/api/users/update", (req, res) => {
    const {id, name} = req.body;
    const user = users.map(data => {
        if(data.id == id) data.name = name;
        return {
            id: data.id,
            name: data.name
        }
    });
    res.json({ok: true, users: user})
});

/**
 * @path {PATCH} http://localhost:3000/api/user/update/:user_id
 * @description 단일 데이터를 수정할 때 사용되는 Method
 */
app.patch("/api/user/update/:user_id", (req, res) => {
    const {user_id} = req.params;
    const {name} = req.body;

    const user = users.map(data => {
        if(data.id == user_id) data.name = name;

        return {
            id: data.id,
            name: data.name
        }
    });
    res.json({ok: true, users: user});
});

app.delete("/api/user/delete", (req, res) => {
    const user_id = req.query.user_id;
    const user = users.filter(data => data.id != user_id);
    res.json({ok: true, users: user});
});

// http listen port 생성 서버 실행
app.listen(3000, () => console.log("하잇!"));