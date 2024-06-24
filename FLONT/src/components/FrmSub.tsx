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
import nsx from "./NSX.jpg";
import legend from "./LEGEND.jpg";
import{motion} from "framer-motion";
const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { code, name } = location.state || {}; //frmMainからcode,nameのステートを受け取る

  let   [textCode, setTextCode] = useState<string>(code || ""); //後にtextCodeの値に変化があるためletで定義
  const [textName, setTextName] = useState<string>(name || "");
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false); //パスワード入力画面表示の有無
  const [password, setPassword] = useState(""); //入力されたパスワードの値を記憶
  const [isOK, setisOK] = useState(false); //パスワードが合致してるかどうか
  const [picture, setPicture] = useState(nsx); //画面の状態管理
  const h1 = picture === nsx ? "#ff9830" : "#ffffff"; //ヘッダーの色に基づいて設定
  
  useEffect(() => { //textCodeに値が存在していた場合に更新処理をfalse
    if (textCode === code) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [textCode]);
  const addDatas = async () => { //textCodeまたはtextNameの入力フィールドが空だった場合に処理を中止する
    if (!textCode) {
      alert("コードを入力してください");
      return;
    }
    if(!textName){
      alert("名前を入力してください");
      return;
    }
    while (textCode.length < 4) {
      textCode = "0" + textCode;  //textCodeが4文字未満の場合、先頭に0を追加
    }
    // 行があるかチェックする
    let responce = await axios.get("http://localhost:3000/api/get/page", {
      params: {
        code: textCode,
      }
    })
    // 行があったら終了
    if (responce.data.data.length === 1) {
      alert("コードが存在します")
      return;
    }
    responce = await axios.post("http://localhost:3000/api/post/page", {
      data: { code: textCode, name: textName },
    });
    if (responce.status === 200) { 
    const response = await axios.post("http://localhost:3000/api/post/page", {
      data: { code: textCode, name: textName },
    });
    console.log(response.data.data.affectedRows); 
    if (response.data.data.affectedRows === 0) { //返ってきた追加した行のデータが0だった場合アラートを表示
      alert("既に同じコードが存在しています");
    } else {
      alert("登録が成功しました");
      navigate("/");
    }
  };

  const editDatas = async () => {
    if (!textCode) {
      alert("コードを入力してください");
      return;
    }
    if(!textName){
      alert("名前を入力してください");
      return;
    }
    try {
      await axios.put("http://localhost:3000/api/put/page", {
        data: { code: textCode, name: textName },
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
        data: { code: textCode },
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
        
      } else {
        setisOK(false);
        alert("認証失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
    setShow(false);
  };
  const checkSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //半角数字4ケタに制限
    if (/^\d{0,4}$/.test(value)) {
      setTextCode(value);
    }
  };
  const checkSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //全角、半角関係なく文字数を30文字に制限
    if (/^.{0,30}$/.test(value)) {
      setTextName(value);
    }
  };
  const back = () => {
    navigate("/");
  };

  //ステートに画像ファイルを保管、スイッチを切り替えたときに更新値に他の画像を代入し切り替える
  const changePicture = () => {
    if (picture === nsx) {
      setPicture(legend);
    } else {
      setPicture(nsx);
    }
  };
  return (
    <div
      style={{
        backgroundImage: `url(${picture})`, //pictureに保管されている現状値を背景画像に設定
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
              value={textCode}
              variant="outlined"
              onChange={checkSetCode}
              disabled={isEdit}
              style={{
                backgroundColor: "#ffffff",
                width: "70px", // 幅を設定
                height: "50px",
              }}
            />
            <Box sx={{ marginBottom: 5 }} />
            <TextField
              value={textName}
              variant="outlined"
              onChange={checkSetName}
           
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
              onClick={handleSubmit(isEdit ? editDatas : addDatas )}
            >
              {isEdit ? "更新" : "登録"}
            </Button>

            {isEdit && (
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
            
            <Switch onChange={changePicture} color="warning" />
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
