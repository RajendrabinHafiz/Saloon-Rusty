class CirclesXCache {
  constructor() {
    this.circles = {}; // contains all circles width x, y
    this.trick = 0;
  }

  update(id, x, y) {
    let circle = this.circles[id];
    if (circle.x === x) {
      this.trick = 0;
      return true;
    } else {
      this.trick++;
      this.circles[id].x = x;
      this.circles[id].y = y;

      return false;
    }
  }

  look(id, x, y) {
    // Get stuck circles
    for (let scrambleId in this.circles) {
      let circle = this.circles[scrambleId];
      if (parseInt(scrambleId) === id && circle.x === x && circle.y === y) {
        return circle;
      }
    }
  }
}

export const hxc = new CirclesXCache();
