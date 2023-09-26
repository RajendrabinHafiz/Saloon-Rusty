const Player = ({ player }) => {
  const cashedOut = player.cashedOut && parseFloat(player.cashedOut)

  return (
    <div className={`player ${player.cashedOut ? "active" : ""}`}>
      <div className="details">
        <div className="circle" style={{ backgroundImage: `url(${player.avatar})` }}></div>
        <div className="name">{player.username}</div>
      </div>
      <div className="amounts">
        <div className="blnce">
          {cashedOut && <div className="payout">{cashedOut.toFixed(2)}x</div>}
          <img draggable="false" src="/images/diamond.svg" alt="" />
          <span>{player.amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const Players = ({ players }) => {
  return (
    <div className="bets">
      <div className="header-bar-bets">
        <div className="title">
          <img draggable="false" src="/images/new_form/user-icon.svg" alt="" />
          <span>{players.length || 0} Bets</span>
        </div>
        <div className="total-balance">
          <img draggable="false" src="/images/diamond.svg" alt="" />
          <span>{(players.reduce((prev, cur) => (prev += cur.amount), 0) || 0).toFixed(2)}</span>
        </div>
      </div>
      <div className="bets-players">
        {players.map((player) => (
          <Player key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default Players;
