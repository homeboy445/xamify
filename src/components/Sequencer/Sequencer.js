import React, { useState, useRef } from "react";
import "./Sequencer.css";
import right_arrow from "../../assets/Images/right-arrow.png";

const Sequencer = (props) => {
  const [progress, setProgress] = useState(200);
  const [sequence_number, update_sequence] = useState(0);
  const { text, sequence_1, sequence_2, sequence_3, sequence_4 } = props;
  const ref1 = useRef();

  const UpdateSequence = (val) => {
    if (sequence_number === text.length - 1 && val === 1) {
      return;
    }
    let Wval = ref1.current.offsetWidth;
    update_sequence(Math.max(0, (sequence_number + val) % text.length));
    setProgress(Math.max(0, (progress + (Wval/text.length) * val) % Wval));
  };

  return (
    <div className="sequencer" ref={ref1}>
      <div className="progress-bar">
        <div style={{ transition: "0.5s" }}>
          <img
            src={right_arrow}
            className="sq-img"
            alt="back"
            style={{
              visibility: sequence_number !== 0 ? "visible" : "hidden",
              pointerEvents: sequence_number !== 0 ? "all" : "none",
            }}
            onClick={() => UpdateSequence(-1)}
          />
          <h1 className="sq-title">{text[sequence_number]}</h1>
          {sequence_number !== text.length ? (
            <button className="sq-nxt-btn" onClick={() => UpdateSequence(1)}>
              {sequence_number === text.length - 1 ? "Done" : "Next"}
            </button>
          ) : null}
        </div>
        <div
          className="bluebar"
          style={{
            width: `${progress}px`,
          }}
        ></div>
      </div>
      <div className="sq-mainer">
        {sequence_number === 0 && typeof sequence_1 !== "undefined" ? (
          sequence_1
        ) : sequence_number === 1 && typeof sequence_2 !== "undefined" ? (
          sequence_2
        ) : sequence_number === 2 && typeof sequence_3 !== "undefined" ? (
          sequence_3
        ) : sequence_number === 1 && typeof sequence_2 !== "undefined" ? (
          sequence_4
        ) : (
          <div>404|Not Found|Oppsie!</div>
        )}
      </div>
    </div>
  );
};

export default Sequencer;
