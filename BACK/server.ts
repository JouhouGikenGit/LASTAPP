import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import { genSaltSync, hashSync } from "bcrypt";

const app = express();

const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',//アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// パスワードが一致するか確かめる
const chkPas = (planePas: string): boolean => {
    const hashPas = "$2b$10$8ZisiEndNJzRaF9T82an7uBZnvv9KpKKBdQcNKfLbmIJmQ5bx8AZy";
    const salt = genSaltSync(10);
    if (hashSync(planePas, salt) === hashPas) {
        return true;
    } else {
        return false;
    }
}
// 接続情報
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kitami0719',     // 自分のパスワード
    database: 'jg'      // データベース
});

// 接続エラー
connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    } else {
        console.log('success');
    }
});

// select
app.get('/api/get/page', (req, res) => {
    const strSql = 'SELECT CODE, NAME FROM PAGE ORDER BY CODE ASC';
    const code = req.query.code;
    if (code !== undefined) {
        console.log("コードが存在します");
    }
    connection.query(
        strSql,
        (error, results) => {
            if (error) {
                res.status(500).json({message: error.message});
            } else {
                res.status(200).json({data: results});
                console.log(results);
            }
        }
    );
});
// Post
app.post('/api/post/page', (req, res) => {
    console.log(req.body);
    const {code, name} = req.body;
    console.log(`code=${code}:name=${name}`);
    const strSql = 'INSERT INTO PAGE(CODE, NAME) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM PAGE WHERE CODE = ?)';
    connection.query(strSql, [code, name, code], (error, result) => {
        console.log(result);
        if (error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(200).send({data: result});
        }
    });
});
// パスワードチェック
app.post('/api/page/pass', (req, res) => {
    console.log(req.body);
    const {password} = req.body;
    const success = chkPas(password)
    return res.status(200).json({success: success});
});
// Delete
app.delete('/api/delete/page', (req, res) => {
    console.log(req.body);
    const {code} = req.body
    console.log(`code=${code}`);
    const strSql = 'DELETE FROM PAGE WHERE CODE = ?';
    connection.query(strSql, [code], (error, results) => {
        console.log(results);
        if (error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(200).json({data: results});
        }
    });
});
// Update
app.put('/api/put/page', (req, res) => {
    console.log(req.body);
    const {code, name} = req.body;
    console.log(`code=${code}:name=${name}`);
    const strSql = 'UPDATE PAGE SET NAME = ? WHERE CODE = ?';
    connection.query(strSql, [name, code], (error, results) => {
        if (error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(200).json({data: results});
        }
    });
});
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
});
