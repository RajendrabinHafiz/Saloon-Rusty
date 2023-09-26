import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import ProvablyFair from "../components/ProvablyFair";
import Footer from "../components/Footer";

const ProvablyFairRoute = (props) => {
  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      <div className="page-content" style={props.styles}>
        <ProvablyFair />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default ProvablyFairRoute;
