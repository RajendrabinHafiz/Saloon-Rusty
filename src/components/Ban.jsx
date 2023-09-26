import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

const BanHook = () => {
  return (
    <React.Fragment>
      <div class="ban">
        <div class="banwrap">
          <img style={{ width: "125px" }} src="/images/logo.png" alt="" />

          <h5>YOU HAVE BEEN BANNED</h5>
          <p>To appeal please make a ticket in the Discord</p>

          <div class="chat-bar">
            <FontAwesomeIcon
              icon={["fab", "discord"]}
              className={classNames({
                "chat-bar-social-icon icon-discord": true,
              })}
              onClick={() => {
                window.open("https://discord.gg/sYRJaTF");
              }}
            />

            <FontAwesomeIcon
              icon={["fab", "twitter"]}
              className={classNames({
                "chat-bar-social-icon icon-twitter": true,
              })}
              onClick={() => {
                window.open("https://twitter.com/RustySaloon");
              }}
            />

            <FontAwesomeIcon
              icon={["fab", "steam"]}
              className={classNames({
                "chat-bar-social-icon icon-steam": true,
              })}
              onClick={() => {
                window.open("https://steamcommunity.com/groups/RustySaloon");
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BanHook;
