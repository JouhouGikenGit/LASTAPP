import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import { hashSync } from "bcrypt";
import { Console } from "console";

const app = express();

const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',//アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

// パスワードが一致するか確かめる
const chkPas = (planePas: string): boolean => {
    const hash = "$2b$10$LhAeGCKomrZhdhi1AfFVFeFTmTO.BB8FHW9PyvNA4qnari.aLOD2u";
    const solt = "$2b$10$LhAeGCKomrZhdhi1AfFVFe";
    if (hashSync(planePas, solt) === hash) {
        return true;
    } else {
        return false;
    }
}

// select
app.get('/api/get/page', (req, res) => {
    let strSql = 'SELECT CODE, NAME FROM PAGE ';
    if (req.query.code !== undefined) {
        strSql += `WHERE CODE = ${req.query.code} `
        console.log("パラメーターにコードがあります")
    }
    strSql += 'ORDER BY CODE ASC'
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
    const {code, name} = req.body.data;
    console.log(`code=${code}:name=${name}`);
    const strSql = "INSERT INTO PAGE(CODE, NAME) VALUES(?, ?)";
    console.log(strSql)
    connection.query(strSql, [code, name], (error, result) => {
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
    console.log(req.body.data);
    const {password} = req.body.data;
    const success = chkPas(password)
    return res.status(200).json({success: success});
});
// Delete
app.delete('/api/delete/page', (req, res) => {
    console.log(req.body);
    const {code} = req.body;
    console.log(`code=${code}`);
    const strSql = `DELETE FROM PAGE WHERE CODE = ?`;
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
    const {code, name} = req.body.data;
    console.log(`code=${code}:name=${name}`);
    const strSql = `UPDATE PAGE SET NAME = ? WHERE CODE = ?`;
    connection.query(strSql, [code, name], (error, results) => {
        if (error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(200).json({data: results});
        }
    });
});
// サーバー起動
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
});
