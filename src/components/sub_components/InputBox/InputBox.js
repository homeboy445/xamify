import React from "react";
import "./InputBox.css";
import email from "../../../assets/icons/email.svg";
import password from "../../../assets/icons/password.svg";
import showPassword from "../../../assets/icons/show_password.svg";

const InputBox = ({
  placeholder,
  type,
  onChangeCallback,
  value,
  iconCallback,
}) => {
  iconCallback = typeof iconCallback === undefined ? () => {} : iconCallback;
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
          type === "email" ? email : type === "text" ? showPassword : password
        }
        alt={type}
        onClick={iconCallback}
      />
    </div>
  );
};

export default InputBox;
