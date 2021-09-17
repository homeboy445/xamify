import React, { useState } from "react";
import "./SignIn.css";
import InputBox from "../sub_components/InputBox/InputBox";

const SignIn = () => {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");

  return (
    <div className="sgIn">
      <div className="sg-1">
        <h1>Sign In to your account.</h1>
        <h2>
          Haven't been verified yet? <a href="/register">Do it now.</a>
        </h2>
      </div>
      <div className="sg-2">
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
      <button className="sg-btn">SignIn</button>
    </div>
  );
};

export default SignIn;
