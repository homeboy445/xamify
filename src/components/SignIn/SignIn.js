import React, { useState, useContext } from "react";
import "./SignIn.css";
import axios from "axios";
import AuthContext from "../../AuthContext";
import InputBox from "../sub_components/InputBox/InputBox";

const SignIn = ({ HandleAuth }) => {
  const Main = useContext(AuthContext);
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [showPassword, set_ShowStatus] = useState(false);

  return (
    <div className="sgIn">
      <div className="sg-1">
        <h1>Sign In to your account.</h1>
        <h2>And get started with Xamify.</h2>
      </div>
      <form
        className="sg-2"
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(
              Main.url + "/auth/login",
              {
                email: email,
                password: password,
              },
              {
                headers: { Authorization: Main.AccessToken },
              }
            )
            .then((response) => {
              HandleAuth(response.data.accessToken, response.data.refreshToken);
            })
            .catch((err) => {
              Main.toggleErrorBox({ is: true, info: "Wrong email/password." });
            });
        }}
      >
        <InputBox
          type="email"
          placeholder="Email"
          value={email}
          onChangeCallback={(e) => set_email(e.target.value.trim())}
        />
        <InputBox
          type={!showPassword ? "password" : "text"}
          placeholder="Password"
          value={password}
          onChangeCallback={(e) => set_password(e.target.value.trim())}
          iconCallback={() => {
            set_ShowStatus(!showPassword);
          }}
        />
        <button className="sg-btn">SignIn</button>
      </form>
    </div>
  );
};

export default SignIn;
