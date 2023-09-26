import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import {Wof} from "../components/games/50x/Wof";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const FiftyTimesRoute = props => {
  return (
    <React.Fragment>
      <div className="page-content" style={props.styles}>
        <Wof />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default FiftyTimesRoute;
