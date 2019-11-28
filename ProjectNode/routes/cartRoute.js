const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db_Obj = require("C:/Users/__connect.json"); //連線到資料庫
const db = mysql.createConnection(db_Obj);
const bluebird = require("bluebird"); //使用兩次sql
const bodyParser = require("body-parser");
bluebird.promisifyAll(db);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const moment = require("moment-timezone");

// router.get('/',(req,res)=>{
//     res.send("cart-Page");
// });



router.get("/getcoupon/:id",(req,res)=>{
  const memberId = req.params.id;
  sql =
    "SELECT * FROM `member_coupon` JOIN `coupon` ON `member_coupon`.`coupon_sid` = `coupon`.`coupon_sid` AND `member_coupon`.`member_coupon_used` = 0 WHERE `member_coupon`.`member_sid` = "+
    memberId;
  db.queryAsync(sql).then(results => {
    res.json(results);
  });
})

router.post("/submitcart", (req, res) => {
  const courseCart = JSON.parse(req.body.courseCart);
  const ingreCart = JSON.parse(req.body.ingreCart);
  console.log(ingreCart);
  const user = req.body.user;
  const coupon = req.body.coupon || 0;
  const totalPrice = req.body.totalPrice;
  const outPut = [];
  let order_sid;

  let courseCartInsert = [];

  db.queryAsync("INSERT INTO `order` (member_sid, coupon_sid, order_total_price) VALUES (?, ?, ?)", [
    user,
    coupon,
    totalPrice
  ]).then((results, fields) => {
    db.queryAsync(
      "SELECT `order`.`order_sid`,`order`.`order_create_time` FROM `order` ORDER BY `order`.`order_create_time` DESC LIMIT 1"
    )
      .then(results => {
        order_sid = results[0].order_sid;
        if(coupon){
          db.query(
            `UPDATE member_coupon SET member_coupon_used = 1 WHERE member_sid = ${user} AND coupon_sid = ${coupon}`)
        }
        if (courseCart.length !== 0 && ingreCart.length !== 0) {
          console.log(courseCart,ingreCart);
          for (i = 0; i < courseCart.length; i++) {
            db.query(
              "INSERT INTO `course_order` (order_sid, course_sid, course_order_choose, course_order_applicants) VALUES (?, ?,?,?)",
              [
                order_sid,
                courseCart[i].course_sid,
                courseCart[i].course_order_choose,
                courseCart[i].course_order_applicants
              ]
            );
          }
          for (i = 0; i < ingreCart.length; i++) {
            db.query(
              "INSERT INTO `ingredients_order` (order_sid, ingredients_sid, ingredients_order_quantity) VALUES (?, ?,?)",
              [
                order_sid,
                ingreCart[i].ingredients_sid,
                ingreCart[i].ingredients_order_quantity
              ]
            );
          }
        } else if (courseCart.length !== 0) {
          for (i = 0; i < courseCart.length; i++) {
            db.query(
              "INSERT INTO `course_order` (order_sid, course_sid, course_order_choose, course_order_applicants) VALUES (?, ?,?,?)",
              [
                order_sid,
                courseCart[i].course_sid,
                courseCart[i].course_order_choose,
                courseCart[i].course_order_applicants
              ]
            );
          }
        } else{
          for (i = 0; i < ingreCart.length; i++) {
            db.query(
              "INSERT INTO `ingredients_order` (order_sid, ingredients_sid, ingredients_order_quantity) VALUES (?, ?,?)",
              [
                order_sid,
                ingreCart[i].ingredients_sid,
                ingreCart[i].ingredients_order_quantity
              ]
            );
          }
        }
        return results;
      })
      .then((results, fields) => {
        const formatDate = "YYYY-MM-DD HH:mm:ss";
        results.course_order_choose = moment(results.course_order_choose).tz('Asia/Taipei').format(formatDate);
        res.json(results);
      });
  });
});

router.post("/checkCourseAttendee", (req, res) => {});

module.exports = router;
