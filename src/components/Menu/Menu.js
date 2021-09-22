import React, { useEffect, useContext } from "react";
import "./Menu.css";
import AuthContext from "../../AuthContext";
import Dashboard_Icon from "../../assets/icons/dashboard.svg";
import ImageFrame from "../sub_components/ImageFrame/ImageFrame";

const Menu = () => {
  const Main = useContext(AuthContext);

  useEffect(() => {}, [Main]);

  return (
    <div className="menu">
      <h1 className="title">Xamify</h1>
      <div className="menu-1">
        <ImageFrame
          image={`https://avatars.dicebear.com/api/human/${
            localStorage.getItem("dp") || 0
          }.svg`}
        />
        <h2
          onClick={() => {
            window.location.href = "/profile";
          }}
        >
          {Main.userInfo.name}
        </h2>
      </div>
      <div className="menu-2">
        <div>
          <img src={Dashboard_Icon} alt="" />
          <h2 onClick={() => (window.location.href = "/dashboard")}>
            Dashboard
          </h2>
        </div>
      </div>
      <h1 className="SignOut">Sign out</h1>
    </div>
  );
};

export default Menu;
