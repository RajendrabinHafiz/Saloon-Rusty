function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntFromConcreteRange(value, min, max) {
  // console.log(value + Math.floor(Math.random() * (max - min + 1) + min));

  let values = [366, 375, 387, 394, 356, 364]; // this will be from server
  return values[Math.floor(Math.random() * values.length)];
  // return value + Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function fixedCirclesCoordinates(width, height, lines = 8) {
  let coordinatesArray = [];
  let startCirclesCount = 3;
  let endCirclesCount = lines + 2;

  let yLineCoordinate = 0;
  let heightBetweenLines = height / (lines + 1);
  let widthBetweenCircles = (width - 200) / endCirclesCount; // - 50 from left and right sides
  let middleOfWidth = width / 2;

  for (let i = startCirclesCount; i <= endCirclesCount; i++) {
    yLineCoordinate += heightBetweenLines;

    if (i % 2 === 0) {
      let k = 0;
      for (let j = i / 2 + 1; j <= i; j++) {
        let x;

        x = middleOfWidth + widthBetweenCircles / 2 + widthBetweenCircles * k;

        coordinatesArray.push({
          x: x,
          y: yLineCoordinate,
        });

        x = middleOfWidth - widthBetweenCircles / 2 - widthBetweenCircles * k;

        coordinatesArray.push({
          x: x,
          y: yLineCoordinate,
        });

        k++;
      }
    } else {
      let k = 0;
      for (let j = Math.ceil(i / 2); j <= i; j++) {
        let x;
        if (j === Math.ceil(i / 2)) {
          x = middleOfWidth;

          coordinatesArray.push({
            x: x,
            y: yLineCoordinate,
          });
        } else {
          x = middleOfWidth + widthBetweenCircles * k;

          coordinatesArray.push({
            x: x,
            y: yLineCoordinate,
          });

          x = middleOfWidth - widthBetweenCircles * k;

          coordinatesArray.push({
            x: x,
            y: yLineCoordinate,
          });
        }
        k++;
      }
    }
  }

  return coordinatesArray;
}

/**
 *
 * @param velocity
 * @param angle
 * @returns {{x: number, y: number}}
 */
function rotate(velocity, angle) {
  return {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
}

/**
 *
 * @param particle
 * @param otherParticle
 */
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x,
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    // otherParticle.velocity.x = vFinal2.x;
    // otherParticle.velocity.y = vFinal2.y;
  }
}

export const utilsPlinko = {
  randomIntFromRange,
  randomIntFromConcreteRange,
  fixedCirclesCoordinates,
  distance,
  rotate,
  resolveCollision,
};
