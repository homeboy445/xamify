import React from "react";
import "./InputBox.css";
import user from '../../../assets/icons/user.svg';
import email from '../../../assets/icons/email.svg';
import password from "../../../assets/icons/password.svg";

const InputBox = ({ placeholder, type, onChangeCallback, value }) => {
  return (
    <div className="inputbx">
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChangeCallback}
        value={value}
        required
      />
      <img
        src={
          type === "email"
            ? email
            : type === "text"
            ? user
            : password
        }
        alt={type}
      />
    </div>
  );
};

export default InputBox;
