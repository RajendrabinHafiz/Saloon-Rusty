import React from "react";
const Loader = (props) => {
  return (
    <React.Fragment>
      <div class="lds-ellipsis m-auto">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </React.Fragment>
  );
}


export default Loader;
