import React from "react";
import { useLocation } from "react-router-dom";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";

const TheLayout = ({ setRefreshCheckLogin }) => {
  let location = useLocation();
  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader setRefreshCheckLogin={setRefreshCheckLogin} />
        <div className="c-body">
          <TheContent />
        </div>
        {location.pathname === "/" && <TheFooter />}
      </div>
    </div>
  );
};

export default TheLayout;
