import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Switch,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import nsx from "./NSX.jpg";
import legend from "./LEGEND.jpg";
import { motion } from "framer-motion";

const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { code, name } = location.state || {};

  let [textCode, setTextCode] = useState<string>(code || "");
  const [textName, setTextName] = useState<string>(name || "");
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [isOK, setIsOK] = useState(false);
  const [picture, setPicture] = useState(nsx);
  const h1 = picture === nsx ? "#ff9830" : "#ffffff";

  useEffect(() => {
    if (textCode === code) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [textCode, code]);

  const addDatas = async () => {
    if (!textCode) {
      alert("コードを入力してください");
      return;
    }
    if (!textName) {
      alert("名前を入力してください");
      return;
    }
    while (textCode.length < 4) {
      textCode = "0" + textCode;
    }
    let responce = await axios.get("http://localhost:3000/api/get/page", {
      params: {
        code: textCode,
      },
    });
    if (responce.data.data.length === 1) {
      alert("コードが存在します");
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
      if (response.data.data.affectedRows === 0) {
        alert("既に同じコードが存在しています");
      } else {
        alert("登録が成功しました");
        navigate("/");
      }
    }
  };

  const editDatas = async () => {
    if (!textCode) {
      alert("コードを入力してください");
      return;
    }
    if (!textName) {
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
        setIsOK(true);
        deleteDatas();
      } else {
        setIsOK(false);
        alert("認証失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
    setShow(false);
  };

  const checkSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setTextCode(value);
    }
  };

  const checkSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^.{0,30}$/.test(value)) {
      setTextName(value);
    }
  };

  const back = () => {
    navigate("/");
  };

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
        backgroundImage: `url(${picture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Grid
        item
        xs={11}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <motion.h1
          initial={{ x: "-100%" }}
          animate={{ x: 100 }}
          transition={{ duration: 1 }}
          style={{ marginTop: "80px", color: h1 }}
        >
          コード:4ケタ以内半角数字
        </motion.h1>

        <motion.h1
          animate={{ x: 100 }}
          transition={{ duration: 1 }}
          style={{ color: h1 }}
        >
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
                width: "70px",
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
                width: "520px",
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
              onClick={handleSubmit(isEdit ? editDatas : addDatas)}
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
