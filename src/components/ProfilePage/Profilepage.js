import React, { useEffect, useState, useContext } from "react";
import "./Profilepage.css";
import AuthContext from "../../AuthContext";

const Profilepage = () => {
  const Main = useContext(AuthContext);
  const [studentInfo, updateInfo] = useState({
    id: "",
    email: "",
    name: "Student",
    type: "",
    profile: {
      rollNo: "",
      year: {
        id: "",
        label: "YEAR",
      },
      course: {
        id: "",
        name: "Course Name",
      },
    },
  });
  const [ChangeAvatar, changeIt] = useState(localStorage.getItem("dp") || 0);

  const getString = (num) => {
    if (Number.isInteger(num)) {
      return num + ".0";
    } else {
      return num.toString();
    }
  };

  useEffect(() => {
    if (Main.userInfo.id !== ''){
      updateInfo(Main.userInfo);
    }
    localStorage.setItem("dp", getString(ChangeAvatar));
  }, [studentInfo, ChangeAvatar, Main]);

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
         <h1>{studentInfo.name}</h1>
        <div className="pfg_1_1">
          <h2>{studentInfo.profile.course.name},</h2>
          <h2>{studentInfo.profile.year.label}</h2>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
