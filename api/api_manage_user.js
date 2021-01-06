const express = require("express");
const router = express.Router();
const user = require("./../model/user");
const bcrypt = require("bcryptjs");
const constants = require("./../constant/constant");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const mailer = require("nodemailer");

router.get("/user", async (req, res) => {
  try {
    let result = await user.findAll({
      order: [["lastLogOn", "DESC"]],
    });

    res.json({
      result,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      error,
      message: constants.kResultNok,
    });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    let result = await user.findOne({
      where: {
        username: username,
      },
    });
    res.json({
      result,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      result: JSON.stringify(error),
      message: constants.kResultNok,
    });
  }
});

router.get("/find_user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    let result = await user.findAll({
      where: {
        username: { [Op.like]: "%" + username + "%" },
      },
    });
    res.json({
      result: result,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      result: JSON.stringify(error),
      message: constants.kResultNok,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    // encrypt password
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    randomKey = makeid(10);
    req.body.randomKey = randomKey;
    let result = await user.create(req.body);

    //send verify email
    try {
      var smtp = {
        host: "smtp.googlemail.com", //set to your host name or ip
        port: 465, //25, 465, 587 depend on your
        // secure: true, // use SSL
        auth: {
          user: "micnmb@gmail.com", //user account
          pass: "mic@admin", //user password
        },
      };

      var smtpTransport = mailer.createTransport(smtp);
      console.log(req.body.email);
      var mail = {
        from: "micnmb@gmail.com", //from email (option)
        to: req.body.email, //to email (require)
        subject: "Please verify your email (NMB AWS API)", //subject
        html:
          `<p>Please click below this link to verify your email</p>
        <a href='http://nmbtracking1.minebea.co.th/:2003/verifyEmail/` +
          req.body.username +
          `/` +
          randomKey +
          `'>Click</a>`, //email body
      };

      await smtpTransport.sendMail(mail, function (error, _response) {
        smtpTransport.close();
        if (error) {
          //error handler
          res.json({
            error,
            message: constants.kResultNok,
          });
        } else {
          // res.json({
          //   result: _response,
          //   message: constants.kResultOk,
          // });
        }
      });
    } catch (error) {
      res.json({
        error,
        message: constants.kResultNok,
      });
    }

    res.json({
      result,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      error,
      message: constants.kResultNok,
    });
  }
});

router.put("/user", async (req, res) => {
  try {
    if (req.body.password != null && req.body.password != "") {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    await user.update(req.body, { where: { username: req.body.username } });

    res.json({
      // result ,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      message: constants.kResultNok,
      error,
    });
  }
});

router.delete("/user", async (req, res) => {
  try {
    let result = await user.destroy({
      where: { username: req.body.username },
    });
    res.json({
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      message: constants.kResultNok,
      error,
    });
  }
});

router.get("/verifyEmail/:username&:randomKey", async (req, res) => {
  try {
    console.log("verify");
    const { username, randomKey } = req.params;
    let result = await user.update(
      { levelUser: "user" },
      { where: { username, randomKey } }
    );

    res.json({
      result,
      message: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      error,
      message: constants.kResultNok,
    });
  }
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
