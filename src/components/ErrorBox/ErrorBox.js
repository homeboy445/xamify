import React, { useContext } from "react";
import "./ErrorBox.css";
import AuthContext from "../../AuthContext";
import Alert from '../../assets/Images/alert.svg';
import Close from "../../assets/icons/close.svg";

const ErrorBox = () => {
  const Main = useContext(AuthContext);
  return (
    <div className="errorBX">
      <div className="erBx_1">
        <img src={Alert} alt="!!" className="alert" />
        <h2>{Main.isError.info}</h2>
      </div>
      <img
        src={Close}
        alt="x"
        className="close"
        onClick={() => {
          Main.toggleErrorBox({ is: false, info: "" });
        }}
      />
    </div>
  );
};

export default ErrorBox;
