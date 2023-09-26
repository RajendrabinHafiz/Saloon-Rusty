import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { turnDropdownOff } from "../../utils/before";

const Activities = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [maxActivities, setMaxActivities] = useState(10);
  const [listCount, setlistCount] = useState(false);
  const { currentActivities } = useSelector((state) => state.home);
  const { mobile } = useSelector((state) => state.main);

  useEffect(() => {
    let intId = setInterval(() => {
      if (dropdownRef.current) {
        if (listCount && !dropdownRef.current.classList.contains("active")) {
          setlistCount(false);
        }
      }
    }, 16);

    return () => {
      clearInterval(intId);
    };
  }, [listCount]);

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
    <div className="latest-activity">
      <div className="activity-types">
        <div className="acts">
          {["Latest Drops", "High rollers", "Lucky winners"].map((item, i) => (
            <div
              className={
                "activity-type" + (i === currentActivities ? " active" : "")
              }
              key={i}
              onClick={(e) =>
                currentActivities !== i &&
                dispatch({
                  type: "UPDATE_HOME_STATE",
                  payload: {
                    currentActivities: i,
                  },
                })
              }
            >
              {item}
            </div>
          ))}
        </div>
        <div
          className="max-acts drop-down-button"
          onClick={() => !listCount && turnDropdownOff() && setlistCount(true)}
        >
          <span>{maxActivities}</span>
          <img src="/images/chevron-down.svg" alt="" />
          <div
            className={"drop-down" + (listCount ? " active" : "")}
            ref={dropdownRef}
          >
            {[10, 20, 30, 40, 50].map(
              (item, i) =>
                item !== maxActivities && (
                  <div
                    className="drop-down-item"
                    key={i}
                    onClick={() => {
                      setMaxActivities(item);
                      setlistCount(false);
                    }}
                  >
                    {item}
                  </div>
                ),
            )}
          </div>
        </div>
      </div>

      <table tabIndex={0}>
        <thead>
          <tr>
            <th>Games</th>
            <th>User</th>
            {!mobile ? <th>Date</th> : null}
            <th>Bet amount</th>
            <th>Multiplier</th>
            <th>Payout</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="/images/roulette.svg" alt="" />
              <span>Roulette</span>
            </td>

            <td>
              <img src="/images/unknown-icon.svg" alt="" />
              <span className="darken">Hidden</span>
            </td>

            {!mobile ? (
              <td>
                <span className="darken">{parseTime(Date.now())}</span>
              </td>
            ) : null}
            <td>
              <img src="/images/diamond.svg" alt="" />
              <span>344.00</span>
            </td>
            <td>x 2.00</td>
            <td>
              <img src="/images/green-diamond.svg" alt="" />
              <span>364.00</span>
            </td>
          </tr>
          <tr>
            <td>
              <img src="/images/roulette.svg" alt="" />
              <span>Roulette</span>
            </td>

            <td>
              <img src="/images/unknown-icon.svg" alt="" />
              <span className="darken">Hidden</span>
            </td>

            {!mobile ? (
              <td>
                <span className="darken">{parseTime(Date.now())}</span>
              </td>
            ) : null}
            <td>
              <img src="/images/diamond.svg" alt="" />
              <span>344.00</span>
            </td>
            <td>x 2.00</td>
            <td>
              <img src="/images/green-diamond.svg" alt="" />
              <span>364.00</span>
            </td>
          </tr>
          <tr>
            <td>
              <img src="/images/roulette.svg" alt="" />
              <span>Roulette</span>
            </td>

            <td>
              <img src="/images/unknown-icon.svg" alt="" />
              <span className="darken">Hidden</span>
            </td>

            {!mobile ? (
              <td>
                <span className="darken">{parseTime(Date.now())}</span>
              </td>
            ) : null}
            <td>
              <img src="/images/diamond.svg" alt="" />
              <span>344.00</span>
            </td>
            <td>x 2.00</td>
            <td>
              <img src="/images/green-diamond.svg" alt="" />
              <span>364.00</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
