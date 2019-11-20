import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "../commom/scss/MemberLogin.scss";
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
); //信箱正規
function MemberEmail(props) {
  const [account, setaccount] = useState("");
  const [email, setemail] = useState("");
  const [password] = useState("");
  const [formErrors, setformErrors] = useState({
    account: "",
    email: "",
    password: ""
  });
  //------事件處理-------
  const handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name + value);
    switch (name) {
      case "account":
        setaccount(value);
        formErrors.account = value.length < 3 ? "最少3個字" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value) ? "" : "請輸入正確的格式";
        setemail(value);
        break;
      default:
        break;
    }
    setformErrors({ formErrors, ...formErrors });
  }; //錯誤訊息篩選順便更新狀態
  const submitForm = event => {
    event.preventDefault();
    console.log();
    if (account.length <= 3 || !emailRegex.test(email)) {
      alert("請輸入正確資訊");
      return;
    }
    fetch("http://localhost:5000/handmade/member/mail", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        member_account: account,
        member_email: email
      })
    })
      .then(res => {
        console.log(res.json);
        return res.json();
      })
      .then(info => {
        alert(info.message);
      });
    console.log(account.length);
    setaccount("");
    setemail("");
    setTimeout(() => {
      props.boxStateChange(0);
    }, 1000);
  };
  return (
    <>
      <div className="login-wrap d-flex flex-column align-items-center">
        <div className="mt-4">LOGO</div>
        <p className="mt-4 mb-3">請填寫帳號與信箱</p>
        <form>
          <ul>
            <li>
              <label htmlFor="member-account">
                <FaUserAlt />
              </label>
              <input
                name="account"
                id="member-account"
                placeholder="帳號"
                onChange={handleChange}
                className={formErrors.account === "最少3個字" ? "error" : null}
                value={account}
              />
              <p className="errorText">{formErrors.account} &nbsp;</p>
            </li>
            <li>
              <label htmlFor="member-email">
                <MdEmail />
              </label>
              <input
                name="email"
                id="member-email"
                placeholder="信箱"
                onChange={handleChange}
                value={email}
              />
              <p className="errorText">{formErrors.email}&nbsp;</p>
            </li>
          </ul>
          <div className="login-btn mt-0">
            <input
              type="submit"
              className=""
              value="確認"
              onClick={submitForm}
            />
          </div>
          <div className="text-center m-3">
            <span className="register" onClick={() => props.boxStateChange(0)}>
              切換到登入頁&nbsp;
            </span>
          </div>
          <div className="text-center"></div>
        </form>
      </div>
      <div className="login-backdrop" onClick={props.memberSignIn}></div>
    </>
  );
}
export default MemberEmail;