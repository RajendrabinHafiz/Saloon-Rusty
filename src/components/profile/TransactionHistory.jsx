import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";

const GameHistory = ({ key }) => {
  let parseTime = (timestamp) => {
    let date = new Date(timestamp);
    let parsed = date
      .toString()
      .split(/\s/)
      .map((t) => t.trim());
    let dateExact = date.toLocaleTimeString().split(/(:|\s)/);
    return `${parsed[1]} ${parsed[2]}, ${parsed[3]} ${dateExact[0x0]}:${dateExact[0x2]} ${dateExact[0x6]}`;
  };

  return (
    <div className="wrap" key={key}>
      <div className="latest-activity option">
        <table tabIndex={0}>
          <thead>
            <tr>
              <th>Games</th>
              <th>Date</th>
              <th>Action</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="/images/roulette.svg" alt="" />
                <span>Roulette</span>
              </td>
              <td>
                <span className="darken">{parseTime(Date.now())}</span>
              </td>
              <td>
                <span>Deposit</span>
              </td>
              <td>
                <img src="/images/green-diamond.svg" alt="" />
                <span className="green">364.00</span>
              </td>

              <td>
                <span className="green">CONFIRMED</span>
              </td>
            </tr>

            <tr>
              <td>
                <img src="/images/dice.svg" alt="" />
                <span>Dice</span>
              </td>
              <td>
                <span className="darken">{parseTime(Date.now())}</span>
              </td>
              <td>
                <span>Deposit</span>
              </td>
              <td>
                <img src="/images/diamond.svg" alt="" />
                <span className="red">-364.00</span>
              </td>

              <td>
                <span className="green">CONFIRMED</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameHistory;
