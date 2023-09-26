import React from "react";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import Affiliates from "../components/Affiliates";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import Footer from "../components/Footer";

const AffiliatesRoute = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Affiliates />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default AffiliatesRoute;
