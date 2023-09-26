import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import FAQ from "../components/FAQ";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const FAQRoute = (props) => {
  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      <div className="page-content" style={props.styles}>
        <FAQ />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default FAQRoute;
