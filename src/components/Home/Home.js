import React from "react";
import "./Home.css";
import Logo from "../sub_components/Logo/Logo";
import ExamVideo from "../../assets/exam.mp4";

const Home = () => {
  return (
    <div className="home-mainer">
      <video autoPlay muted loop id="myVideo">
        <source src={ExamVideo} type="video/mp4" />
      </video>
      <div className="home-content">
        <div className="hc-sub1">
          <Logo style={{ fontSize: "2rem" }} />
          <div className="hc-sub1-btn">
            <button
              className="sgn_btn"
              onClick={() => (window.location.href = "/signin")}
            >
              SignIn
            </button>
          </div>
        </div>
        <div className="hc-sub2">
          <h1>Make Exam taking your hobby.</h1>
          <h2>Attending an Exam has never been this fun.</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
