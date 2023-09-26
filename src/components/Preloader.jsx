import React from "react";
const Preloader = (props) => {
  return (
    <React.Fragment>
      <div class="preloader">
        <div class="prewrap">
          <img src="/images/logo.png" />
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Preloader;
