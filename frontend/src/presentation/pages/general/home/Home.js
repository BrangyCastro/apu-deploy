import React, { useEffect } from "react";
import ApuLogo from "src/presentation/assets/img/png/apu-logo.png";
import "./Home.scss";

const Home = () => {
  useEffect(() => {
    document.title = "APU | Inicio";
    // eslint-disable-next-line
  }, []);

  return (
    <div className="wrap-dashboard">
      <div className="img">
        <img src={ApuLogo} alt="Apu" />
      </div>
    </div>
  );
};

export default Home;
