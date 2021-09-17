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
            <button
              className="rgtr_btn"
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </button>
          </div>
        </div>
        <div className="hc-sub2">
          <h1>Online Exams made fun</h1>
          <h2>Experience the ultimate exam taking platform.</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
