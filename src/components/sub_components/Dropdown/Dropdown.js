import React from "react";

const Dropdown = ({ list, value, onChangeCallback }) => {
  return (
    <select
      value={value}
      onChange={onChangeCallback}
      style={{
        width: "80%",
        backgroundColor: "#E4DEDE",
        fontSize: "1.8rem",
        borderRadius: "30px",
        padding: "1%",
        border: "none",
        outline: "none",
        boxShadow: "2px 2px 2px black",
      }}
    >
      {list.map((item, index) => {
        return (
          <option key={index} value={item}>
            {item}
          </option>
        );
      })}
    </select>
  );
};

export default Dropdown;
