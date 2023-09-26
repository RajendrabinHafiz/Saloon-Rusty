import React, { useEffect, useState } from "react";
import { socket } from "../../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import FullPopup from "../../FullPopup";

export default React.forwardRef((props, ref) => {


  const [userSeed, setUserSeed] = useState("");
  const dispatch = useDispatch();

  /*
  useState(() => {
    if (seedData.userSeed)
    setUserSeed(seedData.userSeed)
  }, []);

  useState(() => {
    setUserSeed(userSeedGlobal);
  }, [userSeedGlobal])
  */

  function changeUserSeed() {
    socket.emit("slots:setUserSeed", props.publicSeedData.userSeed);
    //dispatch(setUserSeedGlobal(userSeed));
  }

  
  function changeServerSeed() {
    socket.emit("slots:setServerSeed", true);
  }
  

  return (
    <React.Fragment>
      
       { props.isPopupVisible && <div>
        <FullPopup
          title="Change Seeds"
          close={() => { props.setIsPopupVisible(false); }}
          visible={props.isPopupVisible}
        >
          <div class="popup-mines-changeseed">
          <p>The server seed, client seed and nonce are the three ingredients which generate the result this game.</p>
        
          
          <div class="partwrap">
          <label>User Seed</label>
        <div class="part">
          <input type="text" maxlength="64" value={props.publicSeedData.userSeed} onChange={(e) => { props.setPublicSeedDataKey('userSeed', e.target.value); }} placeholder="Enter a new seed" />
          <div class="button" onClick={(e) => { changeUserSeed(); }}>Change</div>
        </div>
        </div>
          

        <div class="partwrap">
          <label>Server Seed {props.time > 0 ? '(Last Game ~ Revealed)' : '(Hashed)'}</label>
        <div class="part">
          <input readonly="readonly" type="text" maxlength="64" value={props.publicSeedData.serverSeed} />
          <div class="button" onClick={(e) => {  changeServerSeed();  }}>Change</div>
        </div>
        </div>

        <div class="partwrap">
          <label>Nonce</label>
        <div class="part">
          <input readonly="readonly" type="text" maxlength="16" value={props.publicSeedData.nonce} />
        </div>
        </div>

          </div>
       
        </FullPopup>
      </div>
      }

    </React.Fragment>
  );
});
