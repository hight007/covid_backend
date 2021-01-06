const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const json2xls = require('json2xls');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false }));
app.use(json2xls.middleware);
app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());

app.use("/api/v1/authen/", require("./api/api_authen"));
app.use("/api/v1/manage_user/", require("./api/api_manage_user"));
app.use("/api/v1/manage_master/", require("./api/api_manage_master"));
app.use("/api/v1/qr_covid19/", require("./api/api_covid_report"));
app.use("/api/v1/master_covid19/", require("./api/api_covid_master"));
app.use("/api/v1/file_manage/", require("./api/api_csv"));
app.use("/api/v1/covid_alert/", require("./api/api_covid_alert"));
app.use("/api/v1/body_temperature/", require("./api/api_body_tempurature"));
app.use("/api/v1/home_image/", require("./api/api_image"));

app.listen(2009, () => {
  console.log("Backend is running...");
});
