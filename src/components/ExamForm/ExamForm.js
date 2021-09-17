import React, { useState } from "react";
import "./ExamForm.css";
import Upload_Icon from "../../assets/icons/upload.png";
import Close_Icon from "../../assets/icons/close.svg";

const ExamForm = () => {
  const [questions, set_questions] = useState([
    {
      question:
        "What is the worst case time complexity of the binary search algorithm?",
      type: "MCQ",
    },
    {
      question: "What is the best case time complexity of merge sort?",
      type: "Type",
    },
    {
      question:
        "What are some of the tech stacks of JavaScript which are used to developing websites efficiently than the usual way?",
      type: "MCQ",
    },
    {
      question: "Write the insertion sort pseudo-code.",
      type: "Upload",
    },
    {
      question: "What is are some algo-design techniques? Explain in brief.",
      type: "Type",
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
  const [answers, set_answers] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });

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
    if (questions[ActiveQIndex].type === "Type" && answer_text.length > 0) {
      AppendAnswer(answer_text);
    }
    if (
      questions[ActiveQIndex].type === "Upload" &&
      answer_Image.data !== null
    ) {
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

  return (
    <div className="examFormMainer">
      <div className="examForm_3">
        <h1>Algorithm Design</h1>
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
        <h1>00:22:00 hours left</h1>
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
            <h2>{questions[ActiveQIndex].question}</h2>
          </div>
          <div className="examForm_2_1">
            {questions[ActiveQIndex].type === "MCQ" ? (
              <div className="examForm_answer">
                <div
                  className="xmOption"
                  onClick={() => {
                    set_selMcq(1);
                  }}
                  style={{
                    border:
                      selectedMCQ === 1 || answers[ActiveQIndex] === 1
                        ? "2px solid #3f75ff"
                        : "2px solid black",
                    color:
                      selectedMCQ === 1 || answers[ActiveQIndex] === 1
                        ? "#3f75ff"
                        : "black",
                  }}
                >
                  <h2>Option 1</h2>
                  <input
                    type="radio"
                    checked={
                      selectedMCQ === 1 || answers[ActiveQIndex] === 1
                        ? true
                        : false
                    }
                    onChange={() => {
                      set_selMcq(1);
                    }}
                  />
                </div>
                <div
                  className="xmOption"
                  onClick={() => {
                    set_selMcq(2);
                  }}
                  style={{
                    border:
                      selectedMCQ === 2 || answers[ActiveQIndex] === 2
                        ? "2px solid #3f75ff"
                        : "2px solid black",
                    color:
                      selectedMCQ === 2 || answers[ActiveQIndex] === 2
                        ? "#3f75ff"
                        : "black",
                  }}
                >
                  <h2>Option 2</h2>
                  <input
                    type="radio"
                    checked={
                      selectedMCQ === 2 || answers[ActiveQIndex] === 2
                        ? true
                        : false
                    }
                    onChange={() => {
                      set_selMcq(2);
                    }}
                  />
                </div>
                <div
                  className="xmOption"
                  onClick={() => {
                    set_selMcq(3);
                  }}
                  style={{
                    border:
                      selectedMCQ === 3 || answers[ActiveQIndex] === 3
                        ? "2px solid #3f75ff"
                        : "2px solid black",
                    color:
                      selectedMCQ === 3 || answers[ActiveQIndex] === 3
                        ? "#3f75ff"
                        : "black",
                  }}
                >
                  <h2>Option 3</h2>
                  <input
                    type="radio"
                    checked={
                      selectedMCQ === 3 || answers[ActiveQIndex] === 3
                        ? true
                        : false
                    }
                    onChange={() => {
                      set_selMcq(3);
                    }}
                  />
                </div>
                <div
                  className="xmOption"
                  onClick={() => {
                    set_selMcq(4);
                  }}
                  style={{
                    border:
                      selectedMCQ === 4 || answers[ActiveQIndex] === 4
                        ? "2px solid #3f75ff"
                        : "2px solid black",
                    color:
                      selectedMCQ === 4 || answers[ActiveQIndex] === 4
                        ? "#3f75ff"
                        : "black",
                  }}
                >
                  <h2>Option 4</h2>
                  <input
                    type="radio"
                    checked={
                      selectedMCQ === 4 || answers[ActiveQIndex] === 4
                        ? true
                        : false
                    }
                    onChange={() => {
                      set_selMcq(4);
                    }}
                  />
                </div>
              </div>
            ) : questions[ActiveQIndex].type === "Type" ? (
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
                    <button className="upl_Img" onClick={
                      ()=>{
                        let ObjArr = currentImages;
                        let flag = true;
                        for(const key of ObjArr){
                          if (key.name === answer_Image.name){
                            flag = false; break;
                          }
                        }
                        if (flag){
                          console.log(flag);
                          ObjArr.push(answer_Image);
                          set_CurImages(ObjArr);
                        }
                      }
                    }>Add Image</button>
                  ) : null}
                </div>
                <div className="uploaded">
                  {currentImages.length > 0
                    ? currentImages.map((item, index) => {
                        return (
                          <div key={index}>
                            <h1>{item.name}</h1>
                            <img src={Close_Icon} alt="x" />
                          </div>// TODO: Remove the image if close button is pressed.
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
          {selectedMCQ === null && questions[ActiveQIndex].type === "MCQ"
            ? "Next"
            : "Save & Next"}
        </button>
      </div>
    </div>
  );
};

export default ExamForm;
