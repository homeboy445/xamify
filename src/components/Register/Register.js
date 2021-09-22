import React, { useState, useEffect, useContext } from "react";
import "./Register.css";
import axios from "axios";
import Loader from "react-loader-spinner";
import avatar from "animal-avatar-generator"; //TODO: Re-Consider this.
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import AuthContext from "../../AuthContext";
import InputBox from "../sub_components/InputBox/InputBox";
import Dropdown from "../sub_components/Dropdown/Dropdown";
import Sequencer from "../Sequencer/Sequencer";

const Register = () => {
  const Main = useContext(AuthContext);
  const [students, updateStudentsList] = useState([]);
  const [firstName, set_fName] = useState("");
  const [secondName, set_SName] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [course, set_course] = useState("Choose your course");
  const [enr_year, set_enryear] = useState("Choose current enrollment year");
  const [roll_Number, set_rNumber] = useState("");
  const [AvatarString, set_avString] = useState("First1Name");
  const [searching_status, set_search_status] = useState(false);
  const [fetchedData, updateStatus] = useState(false);
  let curCharArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const getTodaysDate = () => {
    var obj = new Date();
    var dd = obj.getDate(),
      mm = obj.getMonth(),
      yy = obj.getFullYear();
    return yy + "-" + (mm < 10 ? "0" + mm : mm) + "-" + dd;
  };
  const [DateOfBirth, set_date] = useState(getTodaysDate());
  const ChangeAvatar = () => {
    let s = AvatarString.slice(0, AvatarString.lastIndexOf("N") - 1);
    s += Math.random().toString();
    s += AvatarString.substring(AvatarString.lastIndexOf("N"));
    set_avString(s);
  };

  const ValidateRollNumber = () => {
    setTimeout(() => {
      //This function is supposed to search for roll number
      set_search_status(false); // & validate it and also, update the results
    }, 2000); //accordingly.
  };

  const Shuffler = () => {
    //TODO: Look into it
    let n = curCharArray.length;
    let a = curCharArray[n - 2];
    curCharArray[n - 2] = curCharArray[n - 1];
    curCharArray[n - 1] = a;
    curCharArray.reverse();
    return curCharArray;
  };

  useEffect(() => {
    if (Main.AccessToken !== null && !fetchedData) {
      axios
        .get(Main.url + "/students", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
  }, [students, Main]);

  return (
    <Sequencer
      text={[
        "New Here? Follow along and get your account verified.",
        "Just some more things and you're done",
        "Final Step. Let’s just get this over with!",
      ]}
      sequence_1={
        <div className="rg-form">
          <div className="rg_img_txt">
            <div className="rg-img">
              <img
                src={`https://avatars.dicebear.com/api/human/${AvatarString}.svg`}
                alt=""
              />
            </div>
            <h2 onClick={ChangeAvatar}>Change Avatar</h2>
          </div>
          <div className="rg-form_q">
            <div className="rg-form-1">
              <InputBox
                type="text"
                placeholder="First Name"
                value={firstName}
                onChangeCallback={(e) => set_fName(e.target.value.trim())}
              />
              <InputBox
                type="text"
                placeholder="Second Name"
                value={secondName}
                onChangeCallback={(e) => set_SName(e.target.value.trim())}
              />
            </div>
            <div className="rg-form-2">
              <InputBox
                type="email"
                placeholder="Email"
                value={email}
                onChangeCallback={(e) => set_email(e.target.value.trim())}
              />
              <InputBox
                type="password"
                placeholder="Password"
                value={password}
                onChangeCallback={(e) => set_password(e.target.value.trim())}
              />
            </div>
          </div>
        </div>
      }
      sequence_2={
        <div className="rq_drp_down">
          <h1>
            Please choose your course name and your current enrollment year.
          </h1>
          <Dropdown
            list={[
              "Choose your course",
              "Computer Science",
              "Physics",
              "Chemistry",
              "Mathematics",
            ]}
            value={course}
            onChangeCallback={(e) => {
              set_course(e.target.value.trim());
            }}
          />
          <Dropdown
            list={[
              "Choose current enrollment year",
              "1st year",
              "2nd year",
              "3rd year",
              "4th year",
            ]}
            value={enr_year}
            onChangeCallback={(e) => {
              set_enryear(e.target.value.trim());
            }}
          />
        </div>
      }
      sequence_3={
        <div className="rg-fnl">
          {/* <h1>
            {`For us to verify if it’s really you ${firstName} ${secondName}, you’ve gotta enter the credentials below.`}
          </h1> */}
          <div className="rg-rlNmbr">
            <h1>Your university Roll Number,</h1>
            <div className="rg_rl_bx">
              <input
                type="text"
                placeholder="Enter your roll number"
                value={roll_Number}
                onChange={(e) => {
                  set_rNumber(e.target.value.trim());
                  set_search_status(true);
                  ValidateRollNumber();
                }}
              />
              {searching_status ? (
                <Loader
                  type="Puff"
                  color="#00BFFF"
                  height={30}
                  width={30} //3 secs
                />
              ) : null}
            </div>
          </div>
          <div className="sq-3">
            <h1>Choose your correct Date of Birth,</h1>
            <input
              type="date"
              name="D.O.B"
              className="rg-dob"
              value={DateOfBirth}
              onChange={(e) => set_date(e.target.value)}
              min="1980-01-01"
              max="2021-12-31"
            />
          </div>
        </div>
      }
    />
  );
};

export default Register;
