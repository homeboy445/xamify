import React, { useState, useEffect, useContext } from "react";
import "./ExamForm.css";
import axios from "axios";
import JWT from "jsonwebtoken";
import Crypto from "crypto-js";
import AuthContext from "../../AuthContext";
import Upload_Icon from "../../assets/icons/upload.png";
import Close_Icon from "../../assets/icons/close.svg";

const ExamForm = (props) => {
  const Main = useContext(AuthContext);
  const [ExamDetails, updateDetails] = useState({
    id: "",
    type: "",
    author: {
      id: "",
      email: "",
      name: "",
    },
    subject: {
      id: "",
      name: "",
      course: {
        id: "",
        name: "",
      },
      year: {
        id: "",
        label: "",
      },
    },
    startTime: "",
    endTime: "",
  });
  const [questions, set_questions] = useState([
    {
      id: "",
      type: "",
      text: "",
      choices: [
        {
          id: "",
          text: "",
        },
        {
          id: "",
          text: "",
        },
      ],
    },
  ]);
  const [submittedQs, set_subQs] = useState([]);
  const [ActiveQIndex, set_Index] = useState(0);
  const [selectedMCQ, set_selMcq] = useState(null);
  const [answer_text, set_text] = useState("");
  const [answer_Image, set_Image] = useState({
    name: null,
    data: null,
  });
  const [editAnswer, updateEditStatus] = useState(false);
  const [submitPrompt, toggleSubmitPrompt] = useState(false);
  const [currentImages, set_CurImages] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
  const [ActiveContext, updateContext] = useState(0);
  const [answers, set_answers] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [Duration, updateDuration] = useState(0);
  const [Timer, updateTimer] = useState("");
  const ExamId = props.match.params.id;

  const AppendAnswer = (data) => {
    let sub = submittedQs;
    sub.push(ActiveQIndex + 1);
    set_subQs(sub);
    let ans = answers;
    console.log(data);
    ans[ActiveQIndex] = data;
    set_answers(ans);
  };

  const submitTheExam = () => {
    let submitObject = {
        assessmentId: ExamId,
        answers: [],
      },
      ans = [];
      console.log(submitObject);
      try {
      for (const key in answers) {
        if (questions[key].type === "MCQ") {
          ans.push({
            questionId: questions[key].id,
            choiceId: questions[key].choices[answers[key]].id,
          });
        } else {
          if (questions[key].type !== "IMAGE") {
            ans.push({ questionId: questions[key].id, text: answers[key] });
          } else {
            ans.push({ questionId: questions[key].id, images: [] });
            currentImages.map((item) => {
              return ans[ans.length - 1].images.push({ data: item.data });
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
      return Main.toggleErrorBox({
        is: true,
        info: "Something's wrong. Please try again.",
      });
    }
    submitObject.answers = ans;
    if (!navigator.onLine) {
      const offlineObject = {
        studentId: Main.userInfo.id,
        data: JSON.stringify(submitObject),
      };
      const token = JWT.sign(offlineObject, process.env.REACT_APP_TOKEN_KEY, {
        expiresIn: "2 days",
      });
      const encapsulatedOffileObject = {
        token: token,
      };
      var ciphertext = Crypto.AES.encrypt(
        JSON.stringify(JSON.stringify(encapsulatedOffileObject)),
        process.env.REACT_APP_TOKEN_KEY
      ).toString();
      const element = document.createElement("a");
      const file = new Blob([ciphertext], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      var nw = new Date(ExamDetails.startTime);
      element.download = `${
        ExamDetails.subject.name
      }_${nw.toDateString()}_${nw.toTimeString()}.txt`;
      document.body.appendChild(element);
      element.click();
    } else {
      Main.RefreshAccessToken();
      axios
        .post(Main.url + "/submissions", submitObject, {
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
    }
  };

  const UpdateQuestionNumber = (val) => {
    if (
      selectedMCQ !== null &&
      val !== -1 &&
      questions[ActiveQIndex].type === "MCQ"
    ) {
      AppendAnswer(selectedMCQ);
    }
    if (ExamDetails.type === "DIGITAL" && answer_text.length > 0) {
      AppendAnswer(answer_text);
    }
    if (ExamDetails.type === "IMAGE" && answer_Image.data !== null) {
      AppendAnswer(currentImages);
    }
    if (ActiveQIndex === questions.length - 1 && val === 1) {
      return toggleSubmitPrompt(true);
    }
    set_Index(Math.max(0, ActiveQIndex + val) % questions.length);
    set_selMcq(null);
    set_text("");
  };

  const ImageToBlob = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  const setTimer = (ss) => {
    console.log(ss);
    let t1, t2, diff;
    const numTotime = (ss) => {
      return ss < 10 ? `0${ss}` : ss;
    };
    try {
      t1 = new Date(ss);
      t2 = new Date();
      diff = Math.floor((t1 - t2) / 1e3);
      let hr = numTotime(Math.floor(diff / (60 * 60))),
        mn = numTotime(Math.floor(diff / 60) % 60),
        sec = numTotime(diff % 60);
      updateTimer(`${hr}:${mn}:${sec}`);
    } catch {
      updateTimer("00:00:00");
    }
  };

  const getDuration = (start, end) => {
    let a = new Date(start),
      b = new Date(end);
    let dur = Math.floor((b - a) / 60e3);
    return dur;
  };

  useEffect(() => {
    let id = null;
    if (
      Main.AccessToken !== null &&
      !fetchedData &&
      Main.userInfo.id !== null
    ) {
      axios
        .get(Main.url + `/assessments/${ExamId}`, {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          if (
            response.data.subject.year.label !==
            Main.userInfo.profile.year.label
          ) {
            Main.toggleErrorBox({
              is: true,
              info: "You're not eligible for this test.",
            });
            return (window.location.href = "/dashboard");
          }
          if (response.data.questions.length === 0) {
            return (window.location.href = "/dashboard");
          }
          id = setInterval(() => setTimer(response.data.endTime), 1000);
          updateDuration(
            getDuration(response.data.startTime, response.data.endTime)
          );
          updateStatus(true);
          updateDetails(response.data);
          set_questions(response.data.questions);
          let ans = {};
          for (var i = 0; i < response.data.questions.length; i++) {
            ans[i] = null;
          }
          set_answers(ans);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
    const alertUser = async (e) => {
      return "message"; //Preventing the loss of the user's work...
    };
    const handle = () => {
      return; //If the user wants to submit the tests in an immediate manner.
    };
    window.onbeforeunload = alertUser;
    window.onunload = handle;
    window.addEventListener("unload", handle);
    return () => {
      window.onbeforeunload = null;
      window.onunload = null;
      clearInterval(id);
    };
  }, [Main, Timer, submittedQs, currentImages, answer_Image]);

  return (
    <div className="examFormMainer">
      <div
        className="submit_exam"
        style={{
          transform: `scale(${submitPrompt ? 1 : 0.3})`,
          opacity: submitPrompt ? 1 : 0,
          pointerEvents: submitPrompt ? "all" : "none",
        }}
      >
        {!navigator.onLine ? (
          <div>
            <h1>It seems like you're offline.</h1>
            <h2>Worry not as you can submit your test later.</h2>
            <h2>
              You can submit your test through dashboard whenever you're
              internet connection becomes stable again, note that you're
              submission expiration is date is two days from now and so submit
              it before that if you want to get your submission considered.
              We're providing you with a not to be tampered with text file that
              you will have to submit to the dashboard and beware that you're
              submission will be discarded if this text file is tampered with.
              Good luck!
            </h2>
            <div className="sub_exm_btn">
              <button onClick={submitTheExam}>
                Acknowledge & Download File
              </button>
              <button onClick={() => toggleSubmitPrompt(false)}>
                Let me recheck the Exam
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1>Are you sure you want to submit your exam?</h1>
            <h2>Well, if yes... we wish you awesome grades😘</h2>
            <div className="sub_exm_btn">
              <button onClick={submitTheExam}>Yeah, I'm done.</button>
              <button onClick={() => toggleSubmitPrompt(false)}>
                Nope, Not yet.
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="xmHdr"
        style={{
          opacity: !submitPrompt ? 1 : 0.5,
          pointerEvents: !submitPrompt ? "all" : "none",
        }}
      >
        <h1 className="xmtitle">Xamify</h1>
        <h1>{Timer} hours left</h1>
      </div>
      <div
        className="examForm"
        style={{
          opacity: !submitPrompt ? 1 : 0.5,
          pointerEvents: !submitPrompt ? "all" : "none",
        }}
      >
        <div className="examForm_1">
          <div className="exmBtns_1">
            <button onClick={() => updateContext(0)}>Instruction</button>
            <button onClick={() => updateContext(1)}>Questions</button>
          </div>
          {ActiveContext === 0 ? (
            <div className="exmSec">
              {ExamDetails.instructions ||
                "Attempt this test based on your own knowledge and just don’t cheat cause you're harming your integrity if you’re doing it. Good luck!"}
            </div>
          ) : ActiveContext === 1 ? (
            <div
              className="examForm_question_grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: `repeat(${questions.length + 1}, ${60}px)`,
                gridRowGap: "1%",
              }}
            >
              {(
                questions || [
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                  19, 20,
                ]
              ).map((it, index) => {
                let item = index + 1;
                return (
                  <p
                    key={index}
                    style={{
                      transform: `scale(${1 / Math.max(1, 10 / 5) + 0.5})`,
                      background: submittedQs.find((item1) => item1 === item)
                        ? "#5dc185"
                        : "transparent",
                      color: submittedQs.find((item1) => item1 === item)
                        ? "white"
                        : "#5dc185",
                    }}
                    onClick={() => {
                      set_Index(Math.min(questions.length - 1, item - 1));
                    }}
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="examForm_2">
          <div className="examForm_question">
            <h1>{`Question.${ActiveQIndex + 1}`}</h1>
            <h2>{questions[ActiveQIndex].text}</h2>
          </div>
          <div className="examForm_2_1">
            {questions[ActiveQIndex].type === "MCQ" ? (
              <div className="examForm_answer">
                {(questions[ActiveQIndex].choices || []).map((item, index) => {
                  return (
                    <div
                      className="xmOption"
                      onClick={() => {
                        set_selMcq(index);
                      }}
                      key={index}
                      style={{
                        border:
                          selectedMCQ === index ||
                          answers[ActiveQIndex] === index
                            ? "2px solid #3f75ff"
                            : "2px solid black",
                        color:
                          selectedMCQ === index ||
                          answers[ActiveQIndex] === index
                            ? "#3f75ff"
                            : "black",
                      }}
                    >
                      <h2>{item.text}</h2>
                      <input
                        type="radio"
                        checked={
                          selectedMCQ === index ||
                          answers[ActiveQIndex] === index
                            ? true
                            : false
                        }
                        onChange={() => {
                          set_selMcq(index);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : ExamDetails.type === "DIGITAL" ? (
              <div className="examForm_answer_type">
                <textarea
                  placeholder="Type your answer here..."
                  value={
                    (answer_text === ""
                      ? editAnswer
                        ? answer_text
                        : answers[ActiveQIndex]
                      : answer_text) || ""
                  }
                  onChange={(e) => {
                    updateEditStatus(answers[ActiveQIndex] !== null);
                    set_text(e.target.value);
                  }}
                ></textarea>
              </div>
            ) : (
              <div className="examForm_answer_upload">
                <div className="upload_1">
                  <img src={Upload_Icon} alt="" />
                  <h2>Upload Image file</h2>
                  <input
                    accept=".png, .jpg"
                    type="file"
                    onChange={(e) => {
                      ImageToBlob(e.target.files[0]).then((response) => {
                        set_Image({
                          name: e.target.files[0].name,
                          data: response,
                        });
                      });
                    }}
                  />
                  {answer_Image.data !== null ? (
                    <button
                      className="upl_Img"
                      onClick={() => {
                        let ObjArr = currentImages;
                        let flag = true;
                        for (const key of ObjArr) {
                          if (key.name === answer_Image.name) {
                            flag = false;
                            break;
                          }
                        }
                        if (flag) {
                          ObjArr.push(answer_Image);
                          set_CurImages(ObjArr);
                        } else {
                          Main.toggleErrorBox({
                            is: true,
                            info: "You cannot submit the same image twice.",
                          });
                        }
                      }}
                    >
                      Add Image
                    </button>
                  ) : null}
                </div>
                <div className="uploaded">
                  {currentImages.length > 0
                    ? currentImages.map((item, index) => {
                        return (
                          <div key={index}>
                            <h1>{item.name}</h1>
                            <img src={Close_Icon} alt="x" />
                          </div> // TODO: Remove the image if close button is pressed.
                        );
                      })
                    : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="xmBtn"
        style={{
          opacity: !submitPrompt ? 1 : 0.5,
          pointerEvents: !submitPrompt ? "all" : "none",
        }}
      >
        <button onClick={() => UpdateQuestionNumber(-1)}>Previous</button>
        <button onClick={() => UpdateQuestionNumber(1)}>
          {selectedMCQ === null && ExamDetails.type === "MCQ"
            ? "Next"
            : ActiveQIndex !== questions.length - 1
            ? "Save & Next"
            : "Finish & Submit test"}
        </button>
      </div>
    </div>
  );
};

export default ExamForm;
