import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import Tower from "../components/games/tower/Tower";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const TowerRoute = props => {
  return (
    <React.Fragment>
      <div className="page-content" style={props.styles}>
        <Tower />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default TowerRoute;
