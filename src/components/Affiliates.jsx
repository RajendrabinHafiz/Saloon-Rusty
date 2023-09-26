import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRef } from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Affiliates = () => {
  const linkRef = useRef(null);
  const { mobile } = useSelector((state) => state.main);
  const [timeButton, setTimeButton] = useState(0x0);

  let labels = [
    "12:30PM",
    "01:30PM",
    "02:30PM",
    "03:30PM",
    "04:30PM",
    "05:30PM",
    "06:30PM",
    "07:30PM",
    "08:30PM",
  ];

  if (timeButton === 1) {
    labels = [
      "03/22/2022",
      "03/22/2022",
      "03/22/2022",
      "04/22/2022",
      "04/22/2022",
      "05/22/2022",
      "05/22/2022",
      "06/22/2022",
      "07/22/2022",
    ];
  }

  if (timeButton === 2) {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  }

  const copyLink = () => {
    let value = linkRef.current ? linkRef.current.value : null;

    if (!value) {
      return toast.error("There's no thing to copy");
    }

    linkRef.current?.select();
    linkRef.current?.setSelectionRange(0, 99999);

    document.execCommand("copy");

    toast.success("Affiliate link copied!");
  };

  return (
    <div id="affiliates-container" className={mobile ? "mobile" : ""}>
      <div className="title">
        <img src="/images/new_form/anouncement.svg" alt="" />
        <span>Affiliates</span>
      </div>
      <div className="wrap-line spt">
        <div className="left">
          <div className="input-form">
            <div className="label">Set affiliate code</div>
            <div className="input">
              <input
                type="text"
                placeholder="Set affiliate code"
                defaultValue={"Champion"}
              />
              <div className="button">Apply</div>
            </div>
          </div>
          <div className="input-form link">
            <div className="label">Affiliate link</div>
            <div className="input">
              <input
                type="text"
                placeholder="Your Affiliate link"
                ref={linkRef}
                defaultValue={"https://rustysaloon.com/r/champion"}
              />
              <div className="button copy" onClick={() => copyLink()}>
                <img src="/images/new_form/copy.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="input-form">
            <div className="label">Claimable balance</div>
            <div className="input with-image">
              <div className="left">
              <img src="/images/diamond.svg" alt="" />
              <input
                type="number"
                placeholder="Claimable balance"
                defaultValue={"10.00"}
              />
              </div>
              <div className="button">Claim</div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap-line">
        <div className="graph-cont">
          <div className="time-selection">
            <div className="left">
              {["TODAY", "PAST WEEK", "PAST YEAR"].map((item, index) => (
                <div
                  className={"button" + (timeButton === index ? " active" : "")}
                  onClick={() => setTimeButton(index)}
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="right">TOTAL EARNED: $384.00</div>
          </div>
          <div className="graph">
            <Line
              data={{
                labels: labels,
                datasets: [
                  {
                    label: "ddd",
                    data: [0, 180, 19, 30, 90, 20, 30, 120, 8],
                    backgroundColor: "#0062ff",
                    pointBackgroundColor: "transparent",
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: "#cd412a",
                    borderColor: "#fff",
                    pointBorderColor: "transparent",
                    pointHoverBorderColor: "transparent",
                    fill: false,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                hover: {
                  intersect: false,
                },
                legend: {
                  labels: {
                    fontColor: "blue",
                    fontSize: 12,
                  },
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    usePointStyle: true,
                    backgroundColor: "#595E66",
                    bodyFont: { family: "Bai Jamjuree", size: 12 },
                    cornerRadius: 10,
                    callbacks: {
                      title: () => {
                        "";
                      },
                      label: (data) => {
                        return String(data.raw).match(/\./g)
                          ? String(data.raw).split(".")[1].length === 1
                            ? `$${data.raw}0`
                            : `$${data.raw}`
                          : `$${data.raw}.00`;
                      },
                    },
                  },
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
                borderColor: "red",
                scales: {
                  y: {
                    min: 0,
                    ticks: {
                      color: "#fff",
                      beginAtZero: true,
                      font: { family: "Bai Jamjuree", size:mobile ? 10 : 14 },
                      callback: function (value, index, values) {
                        return String(value).match(/\./g)
                          ? String(value).split(".")[1].length === 1
                            ? `$${value}0`
                            : `$${value}`
                          : `$${value}.00`;
                      },
                    },

                    grid: {
                      display: false,
                    },
                  },
                  x: {
                    min: 0,
                    ticks: {
                      color: "#fff",
                      beginAtZero: true,
                      font: { family: "Bai Jamjuree", size: mobile ? 10 : 14 },
                      callback: function (value, index, values) {
                        console.log(index);
                        return !index ? "" : labels[index - 1];
                      },
                    },

                    grid: {
                      borderColor: "#686F78",
                      tickColor: "#fff",
                      drawTicks: false,
                      color: "#686F78",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="title">
        <img src="/images/new_form/users.svg" alt="" />
        <span>Depositers</span>
      </div>
      <table tabIndex={0}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Time</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Payout</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default Affiliates;
