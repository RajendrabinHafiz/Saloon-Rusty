import React, { Fragment } from "react";
import {
  setEmoji,
  setEmojiForce,
  setLatestEmoji,
  setPlayable,
  setSquareData,
  openAllSquares,
  completeGame,
} from "../../../redux/ducks/landmines";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { socket } from "../../../Socket";

function padLeadingZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

const GameSquare = React.forwardRef((props) => {
  const dispatch = useDispatch();
  const isDemo = useSelector((state) => state.landmines.isDemo);
  const isActive = useSelector((state) => state.landmines.isActive);
  const playable = useSelector((state) => state.landmines.playable);
  const game = useSelector((state) => state.landmines.game);
  const square = game.squares[props.offset];

  function openDemoSquare(offset) {
    if (!playable || square.open) return;
    const isMine = square.isMine;
    dispatch(
      setSquareData({
        offset,
        data: {
          open: true,
          openByUser: true,
          isMine,
        },
      }),
    );

    if (!isMine) {
      if (
        25 - game.mineCount <=
        game.squares.filter((el) => el.open && !el.isMine).length + 1
      )
        return props.finalizeGame({ won: true });
      else
        return setTimeout(() => {
          dispatch(setEmojiForce("sunglasses"));
        }, 300);
    }

    dispatch(setPlayable(false));
    setTimeout(() => {
      props.finalizeGame({ won: false });
    }, 700);
  }
  function open(offset) {
    //if (!playable) return;
    if (game.isCompleted || !square || square.open) return;
    socket.emit("mines:step", { offset });
  }

  return (
    <div
      className={
        "mines__game-square " +
        (game.isCompleted && !square.openByUser ? "lowbright" : "")
      }
      onMouseEnter={(e) => {
        return;
        dispatch(setEmoji("curious"));
      }}
      onMouseLeave={(e) => {
        return;
        dispatch(setEmoji("happy"));
      }}
      onMouseDown={(e) => {
        dispatch(setEmoji("scared"));
      }}
      onClick={(e) => {
        console.log(props.offset)
        isDemo ? openDemoSquare(props.offset) : open(props.offset);
      }}
    >
      <div
        className={
          "mines__game-square-cube " +
          (isActive && square.open ? "mines__game-square-active" : "")
        }
      >
        <div class="cube-front">
          <img src="/images/cowboy.png" />
        </div>

        {isActive && square.open ? (
          <div
            className={
              "cube-top " + (square.isMine ? "cube-top-lose " : "cube-top-win ")
            }
            key={"square" + props.offset + (square.open ? 1 : 0)}
          >
            {square.isMine ? (
              <img src="/images/mines/bomb.svg" class="mine" />
            ) : (
              <React.Fragment>
                <img src="/images/mines/star.svg" class="mine" />
                {!square.isMine && !isDemo && square.multiplier > 0 ? (
                  <div>{square.multiplier}x</div>
                ) : (
                  ""
                )}
              </React.Fragment>
            )}
          </div>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </div>
    </div>
  );
});

export default React.forwardRef((props, ref) => {
  const isActive = useSelector((state) => state.landmines.isActive);
  const game = useSelector((state) => state.landmines.game);
  const emoji = useSelector((state) => state.landmines.emoji);
  return (
    <div class="mines__game-area-wrap">
      <div className={"game-info " + (isActive ? "game-info-active" : "")}>
        <div class="wrap">
          {isActive && (
            <div class="part">
              <div class="spaces-cleared">
                <FontAwesomeIcon icon="check" className="" />
                {padLeadingZeros(game.spacesCleared, 2)}
              </div>
            </div>
          )}
          <div class="part">
            <img src={`/images/mines/emoji-${emoji}.svg`} alt="" />
          </div>

          <div class="part">
            <div class="mine-count">
              <FontAwesomeIcon icon="bomb" className="" />
              {padLeadingZeros(game.mineCount, 2)}
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          "mines__game-area " + (!isActive ? "mines__game-area-nopadd" : "")
        }
      >
        {[...Array(25)].map((x, i) => (
          <GameSquare key={i} offset={i} finalizeGame={props.finalizeGame} />
        ))}
      </div>
    </div>
  );
});
