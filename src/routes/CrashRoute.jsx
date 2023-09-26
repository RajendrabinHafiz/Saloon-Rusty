import React from "react";
import Crash from "../components/games/crash-fucked/Crash";
import Footer from "../components/Footer";

const CrashRoute = props => {
  return (
    <React.Fragment>
      <div className="page-content" style={props.styles}>
        <Crash />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default CrashRoute;
