import React from "react";

import "./error-styles.scss";

export const Error = ({ error, reload }) => (
  <div className="col-sm-12">
    <div className="card">
      <div className="card-body errorContainer">
        <span data-testid="error">{error}</span>
        <button
          className="btn btn-outline-primary"
          data-testid="reload"
          onClick={reload}
        >
          Inténtalo de nuevo
        </button>
      </div>
    </div>
  </div>
);
