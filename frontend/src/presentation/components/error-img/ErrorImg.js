import React from "react";
import Img from "../../assets/img/png/No-imagen.png";

export const ErrorImg = ({ alt, height }) => {
  return (
    <>
      <img src={Img} alt={alt} style={{ height: height }} />
    </>
  );
};
