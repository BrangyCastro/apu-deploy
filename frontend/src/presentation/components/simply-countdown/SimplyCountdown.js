import React from "react";
import "./SimplyCountdown.scss";

export const SimplyCountdown = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="simply-countdown">
      <ul>
        <li>
          <span className="number">{days}</span>
          <span>Dias</span>
        </li>
        <li>
          <span className="separator">:</span>
        </li>
        <li>
          <span className="number">{hours}</span>
          <span>Horas</span>
        </li>
        <li>
          <span className="separator">:</span>
        </li>
        <li>
          <span className="number">{minutes}</span>
          <span>Minutos</span>
        </li>
        <li>
          <span className="separator">:</span>
        </li>
        <li>
          <span className="number">{seconds}</span>
          <span>Segundos</span>
        </li>
      </ul>
    </div>
  );
};
