import React, { useState, useEffect, useContext } from "react";
import "./ExamForm.css";
import axios from "axios";
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
  const [currentImages, set_CurImages] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
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
    ans[ActiveQIndex] = data;
    set_answers(ans);
  };

  const UpdateQuestionNumber = (val) => {
    console.log(answers);
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
    if (ExamDetails.type !== "DIGITAL" && answer_Image.data !== null) {
      AppendAnswer(currentImages);
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
    console.log(a.toTimeString(), " ", b.toTimeString());
    let dur = Math.floor((b - a) / 60e3);
    return dur;
  };

  useEffect(() => {
    let id = null;
    if (Main.AccessToken !== null && !fetchedData) {
      axios
        .get(Main.url + `/assessments/${ExamId}`, {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          console.log(response.data);
          updateDuration(
            getDuration(response.data.startTime, response.data.endTime)
          );
          updateStatus(true);
          updateDetails(response.data);
          id = setInterval(() => setTimer(response.data.endTime), 1000);
          set_questions(response.data.questions);
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
  }, [Main, Timer]);

  return (
    <div className="examFormMainer">
      <div className="examForm_3">
        <h1>{ExamDetails.subject.name}</h1>
        <div
          className="examForm_question_grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: `repeat(${4}, ${50 + 10 / 2}px)`,
            gridRowGap: "1%",
          }}
        >
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ].map((item, index) => {
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
                  console.log("Clicked");
                  set_Index(Math.min(questions.length - 1, item - 1));
                }}
              >
                {item}
              </p>
            );
          })}
        </div>
      </div>
      <div className="xmHdr">
        <h1 className="xmtitle">Xamify</h1>
        <h1>{Timer} hours left</h1>
      </div>
      <div className="examForm">
        <div className="examForm_1">
          <div className="exmBtns_1">
            <button>Instruction</button>
            <button>Anouncements</button>
          </div>
          <div className="exmSec">
            Attempt this test based on your own knowledge and just don’t cheat
            cause you're harming your integrity if you’re doing it. And some
            giberrish text... Then a mist closed over the black water and the
            robot gardener. Images formed and reformed: a flickering montage of
            the Sprawl’s towers and ragged Fuller domes, dim figures moving
            toward him in the tunnel’s ceiling. He woke and found her stretched
            beside him in the puppet place had been a subunit of Freeside’s
            security system. Strata of cigarette smoke rose from the tiers,
            drifting until it struck currents set up by the blowers and the
            dripping chassis of a broken mirror bent and elongated as they fell.
            Why bother with the movement of the train, their high heels like
            polished hooves against the gray metal of the car’s floor. He’d
            waited in the tunnel’s ceiling. They were dropping, losing altitude
            in a canyon of rainbow foliage, a lurid communal mural that
            completely covered the hull of the Villa bespeak a turning in, a
            denial of the bright void beyond the hull. He’d fallen face forward
            on a slab of soggy chip board, he rolled over, into the nearest door
            and watched the other passengers as he rode. They were dropping,
            losing altitude in a canyon of rainbow foliage, a lurid communal
            mural that completely covered the hull of the arcade showed him
            broken lengths of damp chipboard and the dripping chassis of a
            skyscraper canyon.
          </div>
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
                      ? answers[ActiveQIndex]
                      : answer_text) || ""
                  }
                  onChange={(e) => {
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
                    type="file" // TODO: Add a check and alert for files other than jpgs and pngs
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
      <div className="xmBtn">
        <button onClick={() => UpdateQuestionNumber(-1)}>Previous</button>
        <button onClick={() => UpdateQuestionNumber(1)}>
          {selectedMCQ === null && ExamDetails.type === "MCQ"
            ? "Next"
            : "Save & Next"}
        </button>
      </div>
    </div>
  );
};

export default ExamForm;
