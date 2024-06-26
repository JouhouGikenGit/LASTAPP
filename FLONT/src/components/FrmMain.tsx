import { Grid, Card, Button, Switch, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import BG from "./0f0f20371e969a8406188c01492f440b8d563eff.jpg";
import BG2 from "./landmark_light.jpg";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
type table = {
  CODE: string;
  NAME: string;
};

export default function Main() {
  const [table, setTable] = useState<table[]>([]);
  const [pic, setpic] = useState(BG);
  const nav = useNavigate();
  const headingColor = pic === BG ? "#248f59" : "#c40e8e";
  const bgcolor = pic === BG ? "#e0ffff" : "#fffff0";
  const btncolor = pic === BG ? "success" : "secondary";
  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/page");
      setTable(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const wClick = (params: GridRowParams) => {
    const { CODE, NAME } = params.row;
    nav("/sub", { state: { code: CODE, name: NAME } });
  };

  const btnClick = () => {
    nav("/sub");
  };

  const columns: GridColDef[] = [
    {
      field: "CODE",
      headerName: "コード (ダブルクリックで編集画面へ)",
      width: 300,
    },
    { field: "NAME", headerName: "名前", width: 400 },
  ];
  const darkMode = () => {
    if (pic === BG) {
      setpic(BG2);
    } else {
      setpic(BG);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        backgroundImage: `url(${pic})`,
        backgroundSize: "cover", // 画像をカバー表示
        backgroundPosition: "center", // 画像を中央に配置
        height: "100vh",
      }}
    >
      <motion.h1
        initial={{ x: "-100%" }}
        animate={{ x: 700 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          fontSize: "40px",
          color: headingColor,
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          display: "inline-block",
        }}
      >
        PAGEテーブル
      </motion.h1>
      <Grid container spacing={3}>
        <Grid item xs={8} container justifyContent="center" alignItems="center">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 200 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              square={false}
              elevation={24}
              style={{ width: "100%", height: "700px" }}
            >
              <DataGrid
                rows={table}
                columns={columns}
                getRowId={(row) => row.CODE}
                onRowDoubleClick={wClick}
                style={{
                  height: "100%",
                  width: "100%",
                  color: headingColor,
                  backgroundColor: bgcolor,
                }}
              />
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tooltip title="新規登録画面に移動します">
              <Button
                startIcon={<GroupAddIcon />}
                onClick={btnClick}
                variant="contained"
                color={btncolor}
                size="large"
                sx={{ width: "200px", height: "60px" }}
                style={{
                  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.9)",
                  marginRight: "20px",
                }}
              >
                新規登録
              </Button>
            </Tooltip>
            <Tooltip title="ダークモードへの切り替え">
              <Switch
                color="warning"
                onChange={darkMode}
                checkedIcon={<LightModeIcon />}
                icon={<DarkModeIcon />}
              />
            </Tooltip>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
}
