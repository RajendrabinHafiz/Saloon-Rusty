import Range from "../../components/Range";

const Overview = ({ key }) => {
  return (
    <div className="wrap">
      <div className="title">
        <img src="/images/new_form/settings.svg" alt="" />
        <span>Settings</span>
      </div>
      <div className="container-options">
        <div className="label">Preferences</div>
        <div className="options">
          <div className="option-wrap">
            <div className="option-card">
              <div className="label">
                <img src="/images/new_form/anony.svg" alt="" />
                <span>Annonymous mode</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked={true} />
                <span className="slider round"></span>
              </label>
            </div>
            <div id="lang-selector-option" className="option-card">
              <div className="label">
                <img src="/images/new_form/plant.svg" alt="" />
                <span>English</span>
              </div>

              <img src="/images/chevron-down.svg" alt="" />
            </div>
          </div>
          <div className="option-wrap all">
            <div id="volume-sound" className="option-card">
              <div className="label">
                <span>Volume</span>
              </div>
              <div className="line">
                <Range
                  min={1}
                  max={100}
                  defaultValue={50}
                  onSelect={console.log}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-options">
        <div className="label">Connections</div>
        <div className="options">
          <div className="option-wrap all">
            <div id="volume-sound" className="option-card">
              <div className="label">
                <img src="/images/new_form/discord.svg" alt="" />
                <span>
                  Discord <span>not</span> linked
                </span>
              </div>
              <div className="right-text button">Join here</div>
            </div>
          </div>
          <div className="option-wrap all">
            <div id="volume-sound" className="option-card">
              <div className="label">
                <img src="/images/new_form/steam.svg" alt="" />
                <span>Steam linked</span>
              </div>
              <div className="right-text">76561198105581400</div>
            </div>
          </div>
        </div>
      </div>
      <div className="title">
        <img src="/images/new_form/wager.svg" alt="" />
        <span>Wager Statistics</span>
      </div>
      <div className="container-options">
        <div className="options">
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/roulette.svg`} alt="" />
                <span>Roulette</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/dice.svg`} alt="" />
                <span>Dice</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/mines.svg`} alt="" />
                <span>Mines</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/hilo.svg`} alt="" />
                <span>Hi-Lo</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/blackjack.svg`} alt="" />
                <span>Blackjack</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/keno.svg`} alt="" />
                <span>Keno</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/crash.svg`} alt="" />
                <span>Crash</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/plinko.svg`} alt="" />
                <span>Plinko</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/50x.svg`} alt="" />
                <span>50X</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/towers.svg`} alt="" />
                <span>Towers</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/baccarat.svg`} alt="" />
                <span>Baccarat</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/video-poker.svg`} alt="" />
                <span>Video Poker</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/upgrader.svg`} alt="" />
                <span>Upgrader</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/andar-bahar.svg`} alt="" />
                <span>Andar Bahar</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
          <div className="option-wrap">
            <div className="option-card statis">
              <div className="label statis">
                <img src={`/images/slide.svg`} alt="" />
                <span>Slide</span>
              </div>

              <div className="right-text">
                <img src="/images/diamond.svg" alt="" />
                <span>457.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
