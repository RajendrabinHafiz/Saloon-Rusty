import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { turnDropdownOff } from "../utils/before";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const Profile = () => {
  const navigate = useNavigate();
  const { mobile, account } = useSelector((state) => state.main);
  const [currentContent, setCurrentContent] = React.useState(0);
  const dropdownRef = useRef(null);

  const [maxActivities, setMaxActivities] = useState(10);
  const [listCount, setlistCount] = useState(false);

  useEffect(() => {
    if (!account) {
      toast.error("You need to login first");
      navigate("/");
    }

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
  }, [listCount, account]);

  const contents = [
    {
      title: "Overview",
      Element: lazy(() => import("../components/profile/Overview")),
      needSizer: false,
    },
    {
      title: "Game history",
      Element: lazy(() => import("../components/profile/GameHistory")),
      needSizer: true,
    },
    {
      title: "Transaction hisory",
      Element: lazy(() => import("../components/profile/TransactionHistory")),
      needSizer: true,
    },
  ];

  if (!account) {
    return null;
  }

  return mobile ? (
    <div className="page-content">
      <div className={"profile-container-route mobile"}>
        <div className="profile-content">
          <div className="wrap">
            <div className="title">
              <img src="/images/new_form/user.svg" alt="" />
              <span>Profile Page</span>
            </div>
            <div className="wrap-line">
              <div className="square-avatar">
                <img src={account.avatar} alt="" />
              </div>
              <div className="text-section">
                <div className="wrap-line-section-inside">
                  <div className="left">
                    <div className="level">{~~((account.xp ?? 0x0) / 300)}</div>
                    <div className="name">{account.username}</div>
                  </div>
                  <div className="right">
                    <div className="wage">440/1337 WAGERED</div>
                    <div className="level-off">21</div>
                  </div>
                </div>
                <div className="fill">
                  <div></div>
                </div>
              </div>
            </div>
            <div className="wrap-line not-formed">
              <div className="label-wrap green">
                <img src="/images/new_form/gift.svg" alt="" />
                <span>Free Coins</span>
              </div>
              <div className="redeem-button">REDEEM</div>
            </div>
            <div className="wrap-line not-formed">
              <div className="label-wrap nt-spicy">
                <div>Trade link</div>
                <div className="button-line">Find it here</div>
              </div>
              <div className="input">
                <input
                  type="text"
                  defaultValue={
                    "https://steamcommunity.com/tradeoff/new/?partner=412351235123&token=51235123"
                  }
                  placeholder="Enter your trade link"
                />
                <div className="save-button">Save</div>
              </div>
            </div>
            <div className="wrap-line not-formed">
              <div className="label-wrap nt-spicy">
                <div>Used affiliate code</div>
              </div>
              <div className="input lone">
                <input
                  type="text"
                  defaultValue={"SALOON"}
                  placeholder="Enter your trade link"
                />
              </div>
            </div>
            <div className="wrap-line">
              <div className="details-cards">
                {["Deposited", "Withdrawn", "Wagered", "Profit"].map(
                  (item, index) => (
                    <div className="card" key={index}>
                      <div className="label">{item}</div>
                      <div className="amount">
                        <img src="/images/diamond.svg" alt="" />
                        <span>354.00</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="wrap-line">
              <div className="content-buttons">
                {contents.map((item, index) => (
                  <div
                    className={
                      "button-content" +
                      (index === currentContent ? " active" : "")
                    }
                    onClick={() => setCurrentContent(index)}
                    key={index}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
              {contents[currentContent].needSizer && (
                <div
                  className="max-acts drop-down-button"
                  onClick={() =>
                    !listCount && turnDropdownOff() && setlistCount(true)
                  }
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
              )}
            </div>
          </div>

          <Suspense fallback="">
            {contents.map(
              ({ Element }, index) =>
                index === currentContent && <Element key={index} />,
            )}
          </Suspense>
        </div>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="page-content">
      <div className={"profile-container-route"}>
        <div className="profile-content">
          <div className="wrap">
            <div className="title">
              <img src="/images/new_form/user.svg" alt="" />
              <span>Profile Page</span>
            </div>
            <div className="wrap-line">
              <div className="square-avatar">
                <img src={account.avatar} alt="" />
              </div>
              <div className="text-content">
                <div className="content-wrap-line">
                  <div className="progress-wrap">
                    <div className="left-section">
                      <div className="text-section">
                        <div className="left">
                          <div className="level">13</div>
                          <div className="name">{account.username}</div>
                        </div>
                        <div className="right">
                          <div className="wage">420/1337 WAGERED</div>
                          <div className="level-off">14</div>
                        </div>
                      </div>
                      <div className="fill">
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div className="gift-section">
                    <div className="text-label">
                      <img src="/images/new_form/gift.svg" alt="" />
                      <span>Free Coins</span>
                    </div>
                    <div className="redeem-button">REDEEM</div>
                  </div>
                </div>
                <div className="content-wrap-line">
                  <div className="progress-wrap">
                    <div className="form-input">
                      <div className="label spt">
                        <span>Trade Link</span>
                        <span className="colored">Find it here</span>
                      </div>
                      <div className="input">
                        <input
                          type="text"
                          defaultValue={
                            "https://steamcommunity.com/tradeoff/new/?partner=412351235123&token=51235123"
                          }
                          placeholder="Enter your trade link"
                        />
                        <div className="save-button">Save</div>
                      </div>
                    </div>
                  </div>
                  <div id="affiliate" className="form-input">
                    <div className="label">
                      <span>Used affiliate code</span>
                    </div>
                    <div className="input lone">
                      <input
                        type="text"
                        defaultValue={"SALOON"}
                        placeholder="Enter your trade link"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="wrap-line">
              <div className="details-cards">
                {["Deposited", "Withdrawn", "Wagered", "Profit"].map(
                  (item, index) => (
                    <div className="card" key={index}>
                      <div className="label">{item}</div>
                      <div className="amount">
                        <img src="/images/diamond.svg" alt="" />
                        <span>354.00</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="wrap-line">
              <div className="content-buttons">
                {contents.map((item, index) => (
                  <div
                    className={
                      "button-content" +
                      (index === currentContent ? " active" : "")
                    }
                    onClick={() => setCurrentContent(index)}
                    key={index}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
              {contents[currentContent].needSizer && (
                <div
                  className="max-acts drop-down-button"
                  onClick={() =>
                    !listCount && turnDropdownOff() && setlistCount(true)
                  }
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
              )}
            </div>
          </div>

          <Suspense fallback="">
            {contents.map(
              ({ Element }, index) =>
                index === currentContent && <Element key={index} />,
            )}
          </Suspense>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
