import React from "react";
import { useSelector } from "react-redux";

const MeBar = (props) => {
  const username = useSelector((state) => state.profile.username);
  const avatar = useSelector((state) => state.profile.avatar);
  const loggedIn = useSelector((state) => state.profile.loggedIn);

  
  function login() {
    const mainUrl = window.location.origin;
    const authUrl = mainUrl + "/auth/steam";
    const newWindow = this.openWindow(authUrl);
    let newWindowLoaded = false;
    newWindow.addEventListener('unload', function(event) {
  newWindowLoaded = true;
});
    let locationCheckerInterval = {};
    locationCheckerInterval = setInterval(() => {
      let stop = false;
      try {
        const newWindowLocation = newWindow.location.href;
        const expectedDomain = this.globals.domain.split(':1337')[0];
        if (newWindowLoaded && newWindowLocation.includes(expectedDomain) && !newWindowLocation.includes('/api/')) {
          const hasAuthorization = newWindowLocation.includes('?authorization=');
          if (hasAuthorization) {
            const authToken = newWindowLocation.split('?authorization=')[1];
            window.localStorage.setItem('authToken', authToken);
          }
          newWindow.close();
          this.$socket.disconnect()
          this.$nextTick(() => {
             this.$socket.connect()
          });
          stop = true;
        }
      } catch(err) {

      } finally{
        if (newWindow.closed || stop) clearInterval(locationCheckerInterval);
      }
      
    }, 100)


    //document.location.replace("/auth/steam");
    
  }

  
  return (
    <div className="me-bar">
      <div className={"info " + (!loggedIn ? "hidden" : "")}>
        <img className="profile-pic" src={avatar} alt="" />
        <a href="/profile">{username}</a>
        <img
          className="hide-on-mobile logout"
          src={process.env.PUBLIC_URL + "/images/logout.svg"}
          onClick={() => {
            document.location.replace("/logout");
          }}
          alt=""
        />
      </div>

      <img
        className={"login " + (loggedIn ? "hidden" : "")}
        src={process.env.PUBLIC_URL + "/images/login.png"}
        onClick={() => {
          document.location.replace("/auth/steam");
        }}
        alt=""
      />
    </div>
  );
};

export default MeBar;
