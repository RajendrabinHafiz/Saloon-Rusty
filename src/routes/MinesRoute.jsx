import React from "react";
import Mines from "../components/games/mines/Mines";
import Footer from "../components/Footer";

const MinesRoute = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Mines />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default MinesRoute;
