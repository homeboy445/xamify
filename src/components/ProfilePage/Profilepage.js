import React, { useEffect, useState, useContext } from "react";
import "./Profilepage.css";
import axios from "axios";
import AuthContext from "../../AuthContext";

const Profilepage = () => {
  const Main = useContext(AuthContext);
  const [studentsList, updateList] = useState([]);
  const [fetchData, updateStatus] = useState(false);
  const [ChangeAvatar, changeIt] = useState(localStorage.getItem("dp") || 0);

  const getString = (num) => {
    if (Number.isInteger(num)) {
      return num + ".0";
    } else {
      return num.toString();
    }
  };

  useEffect(() => {
    localStorage.setItem("dp", getString(ChangeAvatar));
  }, [ChangeAvatar, Main]);

  return (
    <div className="prof_page">
      <div className="rg_img_txt">
        <div className="rg-img">
          <img
            src={`https://avatars.dicebear.com/api/human/${ChangeAvatar}.svg`}
            alt=""
            onClick={() => changeIt(Math.random())}
          />
        </div>
      </div>
      <div className="prof_pg_1">
        <h1>{Main.userInfo.name}</h1>
        <div className="pfg_1_1">
          <h2>Course Name,</h2>
          <h2>YEAR</h2>
        </div>
        <div>Subjects...</div>
      </div>
    </div>
  );
};

export default Profilepage;
