import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = (props) => {
  const navigate = useNavigate();
  const { mobile } = useSelector((state) => state.main);

  return (
    <div id="footer-app" className={mobile ? "mobile" : ""}>
      <div className="container-wraps">
        <div className="wrap intro">
          <div className="logo">
            <img src="/images/logo.png" alt="" />
          </div>
          <div className="description">
            RustClash is not affiliated, endorsed by, or in any way associated
            with the Rust game, Facepunch, Steam, Valve or any of its
            subsidiaries or its affiliates.
          </div>
          <div className="social-links">
            <div id="twitter" className="small-wrap">
              <img src="/images/new_form/twitter.svg" alt="" />
            </div>
            <div id="discord" className="small-wrap">
              <img src="/images/new_form/discord.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="title">Games</div>
          <div className="item">Cases</div>
          <div className="item">Case Battles</div>
          <div className="item">Upgrader</div>
          <div className="item">Plinko</div>
        </div>
        <div className="wrap">
          <div className="title">Info</div>
          <div className="item">FAQ</div>
          <div className="item" onClick={() => navigate("/tos")}>
            Tos
          </div>
          <div className="item">Privacy Policy</div>
          <div className="item">Provably Fair</div>
        </div>
        <div className="wrap">
          <div className="title">Additional</div>
          <div className="item">Leaderboard</div>
          <div className="item">Free Cases</div>
          <div className="item">Contact us</div>
        </div>
      </div>
      <div className="hr"></div>
      <div className="bar-finally">
        <div className="text">All Right Reserved 2021 - 2022.</div>
        <img src="/images/new_form/images-footer.svg" alt="" />
      </div>
    </div>
  );
};

export default Footer;
