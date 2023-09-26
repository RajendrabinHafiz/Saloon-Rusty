import React from "react";

const FullPopup = (props) => {
  return (
    <div className="full-popup " onClick={props.close}>
      <div className={"full-popup__bg " + (props.visible ? "visible" : "")}></div>
      <div className={"full-popup__content " + (props.visible ? "visible" : "")} onClick={ ((e) => {e.stopPropagation()}) }>
        <div className="full-popup__header">
          <div>{props.title}</div>
          <div className="full-popup__close" onClick={props.close}>
            <img src={process.env.PUBLIC_URL + "/images/x.svg"} alt="" />
          </div>
        </div>
        <div className="full-popup__body">{props.children}</div>
      </div>
    </div>
  );
};
export default FullPopup;
