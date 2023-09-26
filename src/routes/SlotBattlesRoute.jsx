import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import SlotBattles  from "../components/games/slotbattles/SlotBattles";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

export default (props) => {
  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      <div className="page-content" style={props.styles}>
        <SlotBattles />
        <Footer />
      </div>
    </React.Fragment>
  );
};
