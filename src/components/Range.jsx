import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const Range = ({ onSelect, min, max, defaultValue, disabled }) => {
  const rangeRef = useRef(null);

  useEffect(() => {
    rangeRef.current.value = defaultValue;
    rangeRef.current.style.backgroundSize =
      ((Number(defaultValue) - min) * 100) / (max - min) + "% 100%";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <input
      type="range"
      min={min}
      ref={rangeRef}
      max={max}
      onChange={(e) => {
        !disabled && onSelect(e.target.value);
        let val = e.target.value;
        e.target.style.backgroundSize =
          ((val - min) * 100) / (max - min) + "% 100%";
      }}
      defaultValue={defaultValue}
      className={"slider-volume" + (disabled ? " disabled" : "")}
      disabled={!!disabled}
    />
  );
};

export default Range;
