import React from "react";
import Chat from "../components/Chat";
import MobileHeader from "../components/desktop/Header";
import Cups from "../components/games/cups/Game";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const CupsRoute = props => {
  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      <div className="page-content" style={props.styles}>
        <Cups />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default CupsRoute;
