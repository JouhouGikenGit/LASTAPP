import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Dialog, //パスワード認証画面のダイアログボックスを構成する
  DialogActions, //送信ボタンを配置する
  DialogContent, //ダイアログの説明文などのメインコンテンツを設定
  DialogTitle, //ダイアログのタイトル部分を表す
  Grid, //テキストフィールドやボタンなどのアイテムの行と列のレイアウトを管理
  Box, //テキストフィールドの広さやボタンの色などのスタイルを設定、適用
  Switch, //トグルスイッチを提供
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import nsx from "./f80ee097b517eaa8266cd443a7e9087e.jpg";
import legend from "./911aa11ea7a993d341ebe66533d020c0.jpg";
import{motion} from "framer-motion";
const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { code, name } = location.state || {}; //frmMainからcode,nameのステートを受け取る

  let   [textC, setTextC] = useState<string>(code || ""); //後にtextCの値に変化があるためletで定義
  const [textN, setTextN] = useState<string>(name || "");
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false); //パスワード入力画面表示の有無
  const [password, setPassword] = useState(""); //入力されたパスワードの値を記憶
  const [isOK, setisOK] = useState(false); //パスワードが合致してるかどうか
  const [pic, setpic] = useState(nsx); //画面の状態管理
  const h1 = pic === nsx ? "#ff9830" : "#ffffff"; //ヘッダーの色に基づいて設定
  
  useEffect(() => { //textCに値が存在していた場合に更新処理をfalse
    if (textC === code) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [textC]);
  const addDatas = async () => { //textCまたはtextNの入力フィールドが空だった場合に処理を中止する
    if (!textC || !textN) {
      alert("コードまたは名前を入力してください");
      return;
    }
    while (textC.length < 4) {
      textC = "0" + textC;  //textCが4文字未満の場合、先頭に0を追加
    }
    // 行があるかチェックする
    let responce = await axios.get("http://localhost:3000/api/get/page", {
      params: {
        code: textC,
      }
    })
    // 行があったら終了
    if (responce.data.data.length === 1) {
      alert("コードが存在します")
      return;
    }
    responce = await axios.post("http://localhost:3000/api/post/page", {
      data: { code: textC, name: textN },
    });
    if (responce.status === 200) { 
      alert("登録が成功しました");
      navigate("/");
    } else {
      alert("登録が失敗しました");
    }
  };

  const editDatas = async () => {
    if (!textC || !textN) {
      alert("コードまたは名前を入力してください");
      return;
    }
    try {
      await axios.put("http://localhost:3000/api/put/page", {
        data: { code: textC, name: textN },
      });
      alert("更新が成功しました");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("更新が失敗しました");
    }
  };

  const deleteDatas = async () => {
    try {
      await axios.delete("http://localhost:3000/api/delete/page", {
        data: { code: textC },
      });
      alert("削除が成功しました");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("削除が失敗しました");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/page/pass", {
        data: { password },
      });
      if (response.data.success) {
        setisOK(true);
        // パスワードが合っていたら削除処理をここで実行
        deleteDatas();
        console.log("認証成功");
      } else {
        setisOK(false);
        console.log("認証失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
    setShow(false);
  };
  const checksetC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 半角文字のみの入力しか受け付けず、半角で文字数を4文字に設定
    if (/^\d{0,4}$/.test(value)) {
      setTextC(value);
    }
  };
  const checksetN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //全角、半角関係なく文字数を30文字に制限
    if (/^.{0,30}$/.test(value)) {
      setTextN(value);
    }
  };
  const back = () => {
    navigate("/");
  };

  //ステートに画像ファイルを保管、スイッチを切り替えたときに更新値に他の画像を代入し切り替える
  const changepic = () => {
    if (pic === nsx) {
      setpic(legend);
    } else {
      setpic(nsx);
    }
  };
  return (
    <div
      style={{
        backgroundImage: `url(${pic})`, //picに保管されている現状値を背景画像に設定
        backgroundSize: "cover", // 背景画像をコンテナに合わせてサイズ調整
        backgroundPosition: "center", // 背景画像を中央に配置
        height: "100vh", // コンテナの高さを画面全体に設定
        width: "100vw", //コンテナの横幅を画面全体に設定
      }}
    >
      <Grid
        item 
        xs={11} //画面幅の比率を設定
        container
        direction="column" //位置調整の際、縦方向に調整する
        alignItems="center" //子要素を中央ぞろえにする
        justifyContent="center" //子要素を画面中央に配置
      >
        <motion.h1 initial={{ x: "-100%" }} /*アニメーション設定*/
        animate={{ x: 100 }}
        transition={{ duration: 1 }}style={{ marginTop: "80px", color: h1 }}>
          コード:4ケタ以内半角数字
        </motion.h1>

        <motion.h1  animate={{ x: 100 }}
        transition={{ duration: 1 }} style={{  color: h1 }}>
          名前:30文字以内
        </motion.h1>

        <Box style={{ marginTop: "150px" }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
          >
            <TextField
              value={textC}
              variant="outlined"
              onChange={checksetC}
              disabled={!isEdit}
              style={{
                backgroundColor: "#ffffff",
                width: "70px", // 幅を設定
                height: "50px",
              }}
            />
            <Box sx={{ marginBottom: 5 }} />
            <TextField
              value={textN}
              variant="outlined"
              onChange={checksetN}
           
              style={{
                backgroundColor: "#ffffff",
                width: "520px", // 幅を設定
                height: "50px",
              }}
            />
          </Box>

          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            style={{ marginTop: "30px" }}
          >
  
            <Button
              variant="contained"
              size="large"
              onClick={back}
              style={{ marginRight: "250px" }}
            >
              戻る
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit(isEdit ? addDatas : editDatas)}
            >
              {isEdit ? "登録" : "更新"}
            </Button>

            {!isEdit && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setShow(true);
                }}
                style={{ marginLeft: "50px" }}
                size="large"
              >
                削除
              </Button>
            )}
            
            <Switch onChange={changepic} color="warning" />
          </Box>
        </Box>
      </Grid>
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>パスワードを入力してください</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            label="パスワード"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            onClick={() => setShow(false)}
            color="primary"
          >
            キャンセル
          </Button>

          <Button onClick={handlePasswordSubmit} color="primary">
            送信
          </Button>

        </DialogActions>
      </Dialog>
      
      {isOK && (
        <div>
          <p>削除が認証されました</p>
        </div>
      )}
    </div>
  );
};
export default Sub;
