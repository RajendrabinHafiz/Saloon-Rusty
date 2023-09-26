import { store } from "../../../redux/store";

const updateConstant = (type, data) => {
  let state = store.getState().wof;
  store.dispatch({
    type: "UPDATE_WOF_STATE",
    payload: {
      [type]: Object.assign(
        {},
        type in state && typeof state[type] === "object" ? state[type] : {},
        data,
      ),
    },
  });
};

export function d_mod(vi, t) {
  const animation = store.getState().wof.animation;
  return (vi * (Math.pow(animation.R, t) - 1)) / animation.LOGR;
}

export function getTf(vi) {
  const animation = store.getState().wof.animation;
  return (Math.log(animation.S) - Math.log(vi)) / animation.LOGR;
}

export function getVi(df) {
  const animation = store.getState().wof.animation;
  return animation.S - df * animation.LOGR;
}

export function calculateDist(ticket) {
  const animation = store.getState().wof.animation;
  const LOGR = Math.log(animation.R);
  updateConstant("animation", { LOGR });
  const dist = 2 + 360 * 4 + ((ticket - 1) / 54) * 360;
  updateConstant("animation", { dist });
}

export function spinWof(ticket, color, startTime) {
  calculateDist(ticket);
  const roundId = store.getState().wof.id;
  const animation = store.getState().wof.animation;

  const vi = getVi(animation.dist);
  const tf = getTf(vi);

  startTime = startTime ? startTime : Date.now();

  updateConstant("animation", {
    vi,
    tf,
    startTime,
  });

  updateConstant("spinning", true);

  updateWof(roundId, color);
}

export function updateWof(currentRoundId, color) {
  try {
    const roundId = store.getState().wof.id;
    const animation = store.getState().wof.animation;

    let t = Date.now() - animation.startTime;
    if (t > animation.tf) {
      t = animation.tf;
    }

    const deg = d_mod(animation.vi, t);

    updateConstant("animation", {
      offsetX: deg,
    });

    let maxTf = -1;
    maxTf = Math.max(maxTf, animation.tf);

    if (roundId !== currentRoundId) return;

    if (t < maxTf) {
      requestAnimationFrame(() => {
        updateWof(currentRoundId, color);
      });
    } else {
      updateConstant("animation", {
        winningColor: color,
      });
    }
  } catch (err) {}
}

export function updateLastBetsWof(history) {
  let temp = {
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
  };

  if (history) {
    for (let info of history) {
      if (info.fairRound.color === "red") {
        temp.red++;
      } else if (info.fairRound.color === "green") {
        temp.green++;
      } else if (info.fairRound.color === "yellow") {
        temp.yellow++;
      } else {
        temp.black++;
      }
    }
  }

  return temp;
}
