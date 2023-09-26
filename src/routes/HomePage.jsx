import React from "react";
import PageContent from "../components/homepage/Home";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <PageContent />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Home;
