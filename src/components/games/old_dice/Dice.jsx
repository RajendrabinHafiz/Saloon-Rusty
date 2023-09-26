import React from "react";
import { useSelector } from "react-redux";
import Details from "./Details";
import Table from "./Table";

const Dice = (props) => {
  const { mobile } = useSelector((state) => state.main);
  return (
    <div className={"dice" + (mobile ? " mobile" : "")}>
      <Details />
      <Table />
    </div>
  );
};

export default Dice;
