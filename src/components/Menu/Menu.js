import React from "react";
import "./Menu.css";
import Dashboard_Icon from "../../assets/icons/dashboard.svg";
import Statistics_Icon from "../../assets/icons/stats.svg";
import Leaderboard_Icon from "../../assets/icons/leaderboard.svg";
import ImageFrame from "../sub_components/ImageFrame/ImageFrame";
import Dashboard from "./../Dashboard/Dashboard";

const Menu = () => {
  return (
    <div className="menu">
      <h1 className="title">Xamify</h1>
      <div className="menu-1">
        <ImageFrame image={Dashboard_Icon} />
        <h2>FirstName</h2>
      </div>
      <div className="menu-2">
        <div>
          <img src={Dashboard_Icon} alt="" />
          <h2>Dashboard</h2>
        </div>
        <div>
          <img src={Statistics_Icon} alt="" />
          <h2>Statistics</h2>
        </div>
        <div>
          <img src={Leaderboard_Icon} alt="" />
          <h2>Leaderboard</h2>
        </div>
      </div>
      <h1 className="SignOut">Sign out</h1>
    </div>
  );
};

export default Menu;
