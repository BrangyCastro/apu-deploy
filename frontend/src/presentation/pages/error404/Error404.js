import React from "react";
import { Link } from "react-router-dom";
import "./Error404.scss";

export const Error404 = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div>
          <div className="notfound-404">
            <h1>!</h1>
          </div>
          <h2>
            Error
            <br />
            404
          </h2>
        </div>
        <p>
          Es posible que la página que está buscando se haya eliminado si se
          cambió el nombre o no está disponible temporalmente.{" "}
          <Link to="/">Volver a la página de inicio</Link>
        </p>
      </div>
    </div>
  );
};
