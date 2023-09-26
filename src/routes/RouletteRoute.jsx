import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import Roulette from "../components/games/roulette/Roulette";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const RouletteRoute = props => {
  return (
    <React.Fragment>
      <div className="page-content" style={props.styles}>
        <Roulette />
        <Footer />
      </div>
     
    </React.Fragment>
  );
};

export default RouletteRoute;
