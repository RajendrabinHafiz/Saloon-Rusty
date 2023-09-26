import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Spinner = (props) => {
  const animation = useSelector((state) => state.roulette.animation);

  function getSpinnerTransform() {
    let view =
      -animation.offsetX +
      animation.SPINNER_VIEW_WIDTH / 2 -
      animation.EL_SIZE / 2;

    return "translateX(" + view + "px)";
  }

  return (
    <div className="spinner" id="spinner">
      <div
        className="spinner__items"
        id="spinner__items"
        style={{ transform: getSpinnerTransform() }}
      >
        {[...new Array(10)].map((item, index) =>
          props.rouletteNumbers.map((number, i) => {
            return <Number number={number} key={i} />;
          }),
        )}
      </div>
      <img
        className="spinner__spin-select"
        src={process.env.PUBLIC_URL + "/images/spin-select.svg"}
        alt=""
      />
      <div className="spinner-left-grad hide-on-mobile"></div>
      <div className="spinner-right-grad hide-on-mobile"></div>
    </div>
  );
};

const Number = (props) => {
  return (
    <div
      className={
        props.number === 0
          ? "spinner__dark spinner__dark--green"
          : props.number < 8
          ? "spinner__dark spinner__dark--red"
          : "spinner__dark spinner__dark--black"
      }
    >
      <div
        className={
          props.number === 0
            ? "spinner__outline spinner__outline--green"
            : props.number < 8
            ? "spinner__outline spinner__outline--red"
            : "spinner__outline spinner__outline--black"
        }
      >
        <div
          className={
            props.number === 0
              ? "spinner__item spinner__item--green"
              : props.number < 8
              ? "spinner__item spinner__item--red"
              : "spinner__item spinner__item--black"
          }
        >
          {props.number === 0 ? (
            <img
              id="spinner__img"
              src={process.env.PUBLIC_URL + "/images/green-icon.svg"}
              alt=""
            />
          ) : props.number < 8 ? (
            <img
              id="spinner__img"
              src={process.env.PUBLIC_URL + "/images/red-icon.svg"}
              alt=""
            />
          ) : props.number > 7 ? (
            <img
              id="spinner__img"
              src={process.env.PUBLIC_URL + "/images/black-icon.svg"}
              alt=""
            />
          ) : (
            props.number
          )}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
