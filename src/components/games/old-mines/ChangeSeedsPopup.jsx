import React, { useEffect, useState } from "react";
import { socket } from "../../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setChangeSeedsPopupVisible, setUserSeed as setUserSeedGlobal } from "../../../redux/ducks/landmines";
import FullPopup from "../../FullPopup";

export default () => {
  const visible = useSelector((state) => state.landmines.changeSeedsPopupVisible);
  const seedData = useSelector((state) => state.landmines.seedData);
  const userSeedGlobal = useSelector((state) => state.landmines.seedData.userSeed);
  const game = useSelector((state) => state.landmines.game);
  const isDemo = useSelector((state) => state.landmines.isDemo);
  const [userSeed, setUserSeed] = useState("");
  const dispatch = useDispatch();

  useState(() => {
    if (seedData.userSeed)
    setUserSeed(seedData.userSeed)
  }, []);

  useState(() => {
    setUserSeed(userSeedGlobal);
  }, [userSeedGlobal])

  function changeUserSeed() {
    socket.emit("mines:setUserSeed",userSeed);
    console.log(userSeed);
    dispatch(setUserSeedGlobal(userSeed));
  }

  
  function changeServerSeed() {
    socket.emit("mines:setServerSeed",userSeed);
  }

  return (
    <React.Fragment>
      
       { visible && <div>
        <FullPopup
          title="Change Seeds"
          close={() => { dispatch(setChangeSeedsPopupVisible(false)); }}
          visible={visible}
        >
          <div class="popup-mines-changeseed">
          <p>The server seed, client seed and nonce are the three ingredients which generate the result this game.</p>
        
          <div class="partwrap">
          <label>User Seed</label>
        <div class="part">
          <input type="text" maxlength="64" value={userSeed} onChange={(e) => { setUserSeed(e.target.value); }} placeholder="Enter a new seed" />
          <div class="button" onClick={(e) => { changeUserSeed(); }}>Change</div>
        </div>
        </div>

        <div class="partwrap">
          <label>Server Seed {game.isActive && game.isCompleted ? '(Last Game ~ Revealed)' : '(Hashed)'}</label>
        <div class="part">
          <input readonly="readonly" type="text" maxlength="64" value={game.isActive && !isDemo ? game.serverSeed : seedData.serverSeed} />
          <div class="button" onClick={(e) => { changeServerSeed(); }}>Change</div>
        </div>
        </div>

        <div class="partwrap">
          <label>Nonce</label>
        <div class="part">
          <input readonly="readonly" type="text" maxlength="16" value={seedData.nonce} />
        </div>
        </div>
          </div>
       
        </FullPopup>
      </div>
      }

    </React.Fragment>
  );
};
