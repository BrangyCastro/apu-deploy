import React from "react";
import "./Avatar.scss";

export const Avatar = (props) => {
  const { size, name } = props;

  const getName = () => {
    const iniciales = name.split(" ").map((item) => item.charAt(0));
    return `${iniciales[0]}${iniciales[2]}`;
  };
  return (
    <div className={`avatar ${size}`}>
      <span>{getName()}</span>
    </div>
  );
};
