import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import AuthContext from "../../AuthContext";
import axios from "axios";
import JWT from "jsonwebtoken";
import Crypto from "crypto-js";
import Arrow_Down from "../../assets/Images/arrow-down(white).png";

const Dashboard = () => {
  const Main = useContext(AuthContext);
  const [AssessmentGrouped, update_group] = useState([]);
  const [AllAssessment, update_Details] = useState([]);
  const [Show_Active, set_SActive] = useState(true);
  const [Show_Upcoming, set_SUpcoming] = useState(true);
  const [Show_Previous, set_PAttempted] = useState(true);
  const [shownErrorMessage, set_EMessage] = useState(false);
  const [makeSubmission, updateSubStatus] = useState(false);
  const [FileData, updateFileData] = useState("");
  const [DetailBox, toggleDetailBox] = useState({
    is: false,
    object: {
      subject: {
        name: "empty",
        year: { label: "1st year" },
      },
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  });
  const [fetchedData, updateStatus] = useState(false);

  const getDuration = (obj) => {
    let d1 = new Date(obj.startTime),
      d2 = new Date(obj.endTime);
    let diff = Math.floor((d2 - d1) / 60e3);
    return `${Math.floor(diff / 60)} hours ${diff % 60} minutes`;
  };

  const getDayDifference = (day1, day2) => {
    let diff = Math.floor((day1 - day2) / 60e3);
    diff = Math.floor(diff / 24 / 60);
    return diff;
  };

  useEffect(() => {
    if (
      Main.AccessToken !== null &&
      !fetchedData &&
      Main.userInfo.profile.year.label !== "YEAR"
    ) {
      axios
        .get(Main.url + "/assessments", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          updateStatus(true);
          set_EMessage(false);
          let obj = [];
          response.data.map((item) => {
            if (item.subject.year.label !== Main.userInfo.profile.year.label) {
              return null;
            }
            let d1 = new Date(item.startTime),
              d2 = new Date(item.endTime);
            let duration = Math.floor((d2 - d1) / 60e3);
            let dN = new Date();
            let diff = Math.floor((d1 - dN) / 60e3); //Subtracting start date with current date
            if (diff > 0) {
              //If the difference is +ve then put into upcoming catg
              obj.push({ upcoming: item });
            } else {
              //If not,
              if (duration >= Math.abs(diff)) {
                // Check if it's duration greater...
                obj.push({ active: item });
              } else {
                //Else do this...
                obj.push({ previous: item });
              }
            }
            return null;
          });
          update_Details(response.data);
          update_group(obj);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
          set_EMessage(true);
        });
    }
  }, [Main, AssessmentGrouped]);

  return (
    <div className="dashboard">
      <div
        className="detailBox"
        style={{
          transform: DetailBox.is ? "scale(1)" : "scale(0)",
          pointerEvents: DetailBox.is ? "all" : "none",
          transition: "0.6s ease",
          opacity: DetailBox.is ? 1 : 0,
        }}
      >
        <h1>
          {makeSubmission ? "Make submission for this exam" : "Exam Details"}
        </h1>
        {!makeSubmission ? (
          <div>
            <h2>
              Date of the Exam:{" "}
              <span>{new Date(DetailBox.object.startTime).toDateString()}</span>
            </h2>
            <h2>
              Duration of the Exam: <span>{getDuration(DetailBox.object)}</span>
            </h2>
            <h2>
              Subject of the Exam: <span>{DetailBox.object.subject.name}</span>
            </h2>
            <h2>
              For students of year:{" "}
              <span>{DetailBox.object.subject.year.label}</span>
            </h2>
          </div>
        ) : (
          <div className="ofl_sub">
            <h2>
              Upload the text file that you've downloaded when you're internet
              connection went down.
            </h2>
            <label htmlFor="submission" className="lab_sub">
              Submit file
            </label>
            <input
              accept=".txt"
              type="file"
              id="submission"
              style={{
                opacity: 0,
                pointerEvents: "none",
                position: "absolute",
              }}
              onChange={(e) => {
                e.preventDefault();
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const text = e.target.result;
                  updateFileData(text);
                };
                reader.readAsText(e.target.files[0]);
              }}
              disabled={!makeSubmission}
            />
          </div>
        )}
        <button
          className="dtl_btn"
          onClick={() => {
            if (makeSubmission) {
              Main.toggleErrorBox({
                is: true,
                info: "Please wait a moment...",
              });
              let exam_Data = {};
              try {
                var bytes = Crypto.AES.decrypt(
                  FileData,
                  process.env.REACT_APP_TOKEN_KEY
                );
                var decryptedData = JSON.parse(bytes.toString(Crypto.enc.Utf8));
                let jwt_obj = JSON.parse(decryptedData);
                exam_Data = JWT.verify(
                  jwt_obj.token,
                  process.env.REACT_APP_TOKEN_KEY
                );
                exam_Data = JSON.parse(exam_Data.data);
              } catch {
                Main.toggleErrorBox({
                  is: true,
                  info: "Invalid test submission. Token's being tampered with",
                });
                updateSubStatus(false);
                return toggleDetailBox({
                  is: false,
                  object: {
                    subject: {
                      name: "empty",
                      year: { label: "1st year" },
                    },
                    startTime: new Date().toISOString(),
                    endTime: new Date().toISOString(),
                  },
                });
              }
              Main.RefreshAccessToken();
              if (exam_Data.assessmentId !== DetailBox.object.id) {
                Main.toggleErrorBox({
                  is: true,
                  info: "Invalid test submission.",
                });
                updateSubStatus(false);
                return toggleDetailBox({
                  is: false,
                  object: {
                    subject: {
                      name: "empty",
                      year: { label: "1st year" },
                    },
                    startTime: new Date().toISOString(),
                    endTime: new Date().toISOString(),
                  },
                });
              }
              axios
                .post(Main.url + "/submissions", exam_Data, {
                  headers: { Authorization: Main.AccessToken },
                })
                .then((response) => {
                  console.log(response.data);
                  setTimeout(() => (window.location.href = "/dashboard"), 5000);
                })
                .catch((err) => {
                  Main.toggleErrorBox({
                    is: true,
                    info: "Something's wrong. Please try again.",
                  });
                });
              updateSubStatus(false);
            }
            toggleDetailBox({
              is: false,
              object: {
                subject: {
                  name: "empty",
                  year: { label: "1st year" },
                },
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
              },
            });
          }}
        >
          {makeSubmission ? "Verify & Upload" : "OK"}
        </button>
      </div>
      <div
        className="db-titl"
        style={{
          opacity: DetailBox.is ? 0.4 : 1,
          pointerEvents: DetailBox.is ? "none" : "all",
        }}
      >
        <h1 className="d-title">Dashboard</h1>
      </div>
      <div
        className="dashboard-1"
        style={{
          opacity: DetailBox.is ? 0.4 : 1,
          pointerEvents: DetailBox.is ? "none" : "all",
        }}
      >
        <div className="Active">
          <div
            className="Active_1"
            onClick={() => {
              set_SActive(!Show_Active);
            }}
          >
            <h1>Active Tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Active ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.1s ease",
              }}
            />
          </div>
          {AssessmentGrouped.map((item, index) => {
            if (!("active" in item)) {
              return null;
            }
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  transform: !Show_Active
                    ? `translate(0%,${-20 - index * 25}%)`
                    : "translate(0%,0%)",
                  opacity: Show_Active ? 1 : 0,
                  marginBottom: Show_Active ? "0%" : "-14%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Active ? "transparent" : "#cde4f6",
                  pointerEvents: !Show_Active ? "none" : "all",
                }}
              >
                <h2>{item.active.subject.name}</h2>
                <button
                  style={{
                    alignSelf: "center",
                    background: "#3f75ff",
                    fontSize: "1.5rem",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "1%",
                  }}
                  onClick={() => {
                    window.location.href = `/exam/${item.active.id}`;
                  }}
                >
                  Take Test
                </button>
              </div>
            );
          })}
        </div>
        <div className="Upcoming">
          <div
            className="Upcoming_1"
            onClick={() => {
              set_SUpcoming(!Show_Upcoming);
            }}
          >
            <h1>Upcoming Tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Upcoming ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.1s ease",
              }}
            />
          </div>
          {AssessmentGrouped.map((item, index) => {
            if (!("upcoming" in item)) {
              return null;
            }
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  transform: !Show_Upcoming
                    ? `translate(0%,${-30 - index * 25}%)`
                    : "translate(0%,10%)",
                  opacity: Show_Upcoming ? 1 : 0,
                  marginBottom: Show_Upcoming ? "0%" : "-10%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Upcoming ? "transparent" : "#cde4f6",
                  pointerEvents: !Show_Upcoming ? "none" : "all",
                }}
              >
                <h2>{item.upcoming.subject.name}</h2>
                <p
                  onClick={() => {
                    let obj = AllAssessment.find(
                      (item1) => item1.id === item.upcoming.id
                    );
                    toggleDetailBox({ is: true, object: obj });
                  }}
                >
                  Details
                </p>
              </div>
            );
          })}
        </div>
        <div className="Attempted">
          <div
            className="Attempted_1"
            onClick={() => {
              set_PAttempted(!Show_Previous);
            }}
          >
            <h1>Previously hosted tests</h1>
            <img
              src={Arrow_Down}
              alt="\/"
              style={{
                transform: Show_Previous ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.001s",
              }}
            />
          </div>
          {AssessmentGrouped.map((item, index) => {
            if (!("previous" in item)) {
              return null;
            }
            return (
              <div
                key={index}
                className="db-card"
                style={{
                  opacity: Show_Previous ? 1 : 0,
                  transform: !Show_Previous
                    ? `translate(0%,${-20 - index * 25}%)`
                    : "translate(0%,0%)",
                  marginBottom: Show_Previous ? "0%" : "-25%",
                  transition: "0.8s ease",
                  backgroundColor: !Show_Previous ? "transparent" : "#cde4f6",
                  pointerEvents: !Show_Previous ? "none" : "all",
                }}
              >
                <h2>{item.previous.subject.name}</h2>
                <div className="prev_sub">
                  {getDayDifference(
                    new Date(),
                    new Date(item.previous.endTime)
                  ) <= 2 ? (
                    <p
                      style={{ width: "100%" }}
                      className="mk_sub"
                      onClick={() => {
                        //I am considering that item.id is the assessment id
                        toggleDetailBox({ is: true, object: { id: item.id } });
                        updateSubStatus(true);
                      }}
                    >
                      Make submission
                    </p>
                  ) : null}
                  <p
                    className="dtls"
                    onClick={() => {
                      let obj = AllAssessment.find(
                        (item1) => item1.id === item.previous.id
                      );
                      toggleDetailBox({ is: true, object: obj });
                    }}
                  >
                    Details
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
