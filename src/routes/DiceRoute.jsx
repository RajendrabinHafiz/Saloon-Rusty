import React from "react";
import Dice from "../components/games/dice/Dice";
import Footer from "../components/Footer";

const FiftyTimesRoute = props => {
  return (
    <React.Fragment>
      <div className="page-content" style={props.styles}>
        <Dice />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default FiftyTimesRoute;
