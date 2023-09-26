import React, { createRef } from "react";
import { socket } from "../Socket";
import FakeCaptcha from "./Captcha";

import { ToastContainer, toast } from "react-toastify";
function retoastr(type, msg) {
  if (toast[type]) {
    toast[type](msg, { position: toast.POSITION.BOTTOM_LEFT });
  }
}


class Affiliates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captchaActive: false,
      code: "None",
      codeLink: "",
      balance: 0,
      wager: 0,
      earnings: 0,
      recentEarnings: [],
      users: 0,
    };

    this.code = createRef();
  }

  componentDidMount() {
    document.title = "RustySaloon | Affiliate";

    socket.emit("referralConnect");

    socket.on("referralConnectResponse", (data) => {
      console.log("referralRes", data);
      this.setState({
        balance: data.balance,
        code: data.code,
        codeLink: `https://rustysaloon.com/${data.code}`,
        wager: data.wager,
        earnings: data.earnings,
        recentEarnings: data.recentEarnings,
        users: data.users,
      });
    });

    socket.on("claimRewardResponse", () => {
      this.setState({ balance: 0 });
    });
  }

  componentWillUnmount() {
    socket.off("referralConnectResponse");
    //
  }

  render() {
    return (
      <div className="affiliates">
        <input id="codeLink" value={this.state.codeLink} class="" />
        <div className="affiliates__header">
          <div className="affiliates__header-item">
            <div className="affiliates__header-item-label">Code</div>
            <div className="affiliates__header-item-value">{this.state.code}</div>
          </div>

          <div className="affiliates__header-item">
            <div className="affiliates__header-item-label">Total Referrals</div>
            <div className="affiliates__header-item-value">{this.state.users}</div>
          </div>

          <div className="affiliates__header-item">
            <div className="affiliates__header-item-label">Generated Comission</div>
            <div className="affiliates__header-item-value">{(this.state.earnings / 100).toFixed(2)} (5%)</div>
          </div>

          <button
            className={this.state.code === "None" ? "hidden" : "button button--green"}
            onClick={()=> {
              var copyText = document.getElementById("codeLink");
              copyText.focus();
              copyText.select();
              copyText.setSelectionRange(0, 99999);
              document.execCommand('copy');
              try { navigator.clipboard.writeText(copyText.value); } catch(err) { }
              global.retoastr("success", "You have successfully copied the referral link!")
          
            }}
          >
            Copy Ref Link
          </button>

          <div className={this.state.code === "None" ? "hidden" : "affiliates__header-item right"}>
            <div className="affiliates__header-item-label">Available Comission</div>
            <div className="affiliates__header-item-value">{(Number(this.state.balance) / 100).toFixed(2)}</div>
          </div>

          <button
            className={this.state.code === "None" ? "hidden" : "button button--green"}
            onClick={() => {
              socket.emit("referralClaimReward");
            }}
          >
            Claim
          </button>

          <div className={this.state.code === "None" ? "affiliates__header-item right" : "hidden"}>
            <div className={this.state.code === "None" ? "" : "hidden"}>
              <article className={this.state.captchaActive ? "flexCol" : "hidden"}>
                <FakeCaptcha
                  submit={(captcha) => {
                    socket.emit("createReferralCode", {
                      captcha: captcha,
                      code: this.code.current.value,
                    });
                    this.setState({ captchaActive: false });
                  }}
                  key="6LdCXfkdAAAAACLaCEaFZvBRNyau410x0ibgx2l3"
                />
              </article>
            </div>

            <div>
              <p
                style={{
                  color: "lightgrey",
                  marginLeft: "55px",
                  display: "flex",
                }}
              >
                Set your Code
              </p>

              <div
                className={this.state.code !== "None" ? "hidden" : "right-input"}
                style={{ display: "flex", height: "30px" }}
              >
                <input class="input" ref={this.code} />
                <div
                  className="button button--green"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5px",
                  }}
                  onClick={() => {
                    this.setState({ captchaActive: true });
                  }}
                >
                  <b>SAVE</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Time</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
       
            {this.state.recentEarnings.map((earning) => {
              const date = new Date(earning.createdAt * 1000);
              return (
               <tr>
                  <td>{earning.username}</td>
                  <td>
                    {date.getDate()}/{date.getMonth()}/{date.getFullYear()} {date.getHours()}:{date.getMinutes()}
                  </td>
                  <td>{earning.type}</td>
                  <td>{(earning.amount / 100).toFixed(2)}</td>
                  <td className="green">{(earning.feeAmount / 100).toFixed(2)}</td>
                  </tr>
              );
            })}
            
          </tbody>
        </table>
      </div>
    );
  }
}
export default Affiliates;
