import React, { useState, useEffect } from "react";
import "../commom/scss/page_navBar.scss";
import "../commom/scss/normalize.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimesCircle } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import NavBarSign from "./NavBarSign";
import NavBarUnSign from "./NavBarUnSign";
import MemberBox from "./MemberBox";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

const NavBar = ({ checkLogIn, login, ...props }) => {
  console.log(login.login);
  const [showLightBox, setShowLightBox] = useState(false);
  const [showMenuBtn, setshowMenuBtn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [memberImgName, setMemberImgName] = useState("");
  const [imgHand] = useState(false);

  const openCart = check => {
    setShowCart(check);
  };
  const memberSignIn = () => {
    setShowLightBox(!showLightBox);
  };
  const MenuListLeave = () => {
    if (showMenuBtn === true) {
      setshowMenuBtn(!showMenuBtn);
    }
  };
  if (showLightBox) {
    console.log("clicked");
  }
  useEffect(() => {
    fetch("http://localhost:5000/handmade/member/getMemberImg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        member_sid: localStorage.getItem("member_id")
      })
    })
      .then(res => {
        return res.json();
      })
      .then(rows => {
        console.log(rows);
        setMemberImgName(rows.info[0].member_photo_name);
      })
      .catch(error => console.log(error));
  }, [imgHand]);
  return (
    <>
      <nav className="navbar page-nav  align-items-center">
        <div className="page-nav-aside d-flex align-items-center justify-content-between">
          <div style={{ position: "relative", cursor: "pointer" }}>
            <GiHamburgerMenu
              onClick={() => setshowMenuBtn(true)}
              className="mx-3 "
              style={{ fontSize: "30px", color: "#fff" }}
            />
          </div>
          <ul
            className={showMenuBtn ? "move  navbarBtn" : "navbarBtn"}
            onMouseLeave={MenuListLeave}
          >
            <li className="w-100">
              <FaTimesCircle
                onClick={() => setshowMenuBtn(false)}
                style={{ margin: "30px 0 30px 0" }}
              />
              <Link
                style={{ color: "#fff" }}
                to="/handmade"
                style={{ marginLeft: "79px" }}
              >
                <img src="/image/logo/logo-03.png" alt="" width="180px" />
              </Link>
            </li>
            <li>
              <Link style={{ color: "#fff" }} to="/handmade/store">
                烘焙店家
              </Link>
            </li>
            <li>
              <Link style={{ color: "#fff" }} to="/handmade/teacher">
                優質老師
              </Link>
            </li>
            <li>
              <Link style={{ color: "#fff" }} to="/handmade/ingredients">
                精緻食材
              </Link>
            </li>
            <li>
              <Link style={{ color: "#fff" }} to="/handmade/test">
                測試
              </Link>
            </li>
            <li>
              <Link
                style={{
                  color: "#fff",
                  position: "absolute",
                  bottom: "10px",
                  right: "50px",
                  fontSize: "30px"
                }}
                to="/handmade/"
              >
                <GoHome style={{ marginBottom: "10px" ,marginRight:"5px"}} />
                <span>回首頁</span>
              </Link>
            </li>
          </ul>
        </div>
        {login.login == false ? (
          <NavBarUnSign
            showLightBox={memberSignIn}
            openCart={openCart}
            showCart={showCart}
            login={login}
          />
        ) : (
          <NavBarSign
            openCart={openCart}
            showCart={showCart}
            login={login}
            memberImgName={memberImgName}
          />
        )}
      </nav>
      {/* ------------------ */}
      {showLightBox ? (
        <MemberBox
          LoginBox={login}
          memberSignIn={memberSignIn}
          checkLogIn={checkLogIn}
        ></MemberBox>
      ) : null}
    </>
  );
};

export default withRouter(NavBar);
