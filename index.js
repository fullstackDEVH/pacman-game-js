const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

export class Boundary {
  static width = 40;
  static height = 40;

  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.image = image;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();

    const { a, d, s, w } = keys;
    if (a.pressed || d.pressed) this.position.x += this.velocity.x;
    else if (w.pressed || s.pressed) this.position.y += this.velocity.y;
  }
}

class Ghost {
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.previousCollisions = [];
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pellet {
  constructor({ position }) {
    this.position = position;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }
}

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKeyPress = "";

const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

const boundaries = [];
let pellets = [];

const createImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

// Additional cases (does not include the power up pellet that's inserted later in the vid)
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: { x: 0, y: 0 },
});

const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: { x: 5, y: 0 },
  }),
  new Ghost({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: { x: 5, y: 0 },
    color: "pink",
  }),
];

const checkConditionCollision = (obj, boundary) => {
  return (
    obj.position.y - obj.radius + obj.velocity.y <=
      boundary.position.y + boundary.height &&
    obj.position.x + obj.radius + obj.velocity.x >= boundary.position.x &&
    obj.position.y + obj.radius + obj.velocity.y >= boundary.position.y &&
    obj.position.x - obj.radius + obj.velocity.x <=
      boundary.position.x + boundary.width
  );
};

const animation = () => {
  window.requestAnimationFrame(animation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      player.position.y - player.radius + player.velocity.y <=
        boundary.position.y + boundary.height &&
      player.position.x + player.radius + player.velocity.x >=
        boundary.position.x &&
      player.position.y + player.radius + player.velocity.y >=
        boundary.position.y &&
      player.position.x - player.radius + player.velocity.x <=
        boundary.position.x + boundary.width
    ) {
      player.velocity = { x: 0, y: 0 };
    }
  });

  pellets = pellets.filter((pellet) => {
    pellet.draw();
    const playerCollidesWithPellet =
      player.position.x - pellet.position.x === 0 &&
      player.position.y - pellet.position.y === 0;

      
    if (playerCollidesWithPellet) {
      return false;
    }

    return true;
  });

  player.update();

  if (keys.a.pressed && lastKeyPress === "a") {
    player.velocity.x = -5;
  } else if (keys.s.pressed && lastKeyPress === "s") {
    player.velocity.y = 5;
  } else if (keys.w.pressed && lastKeyPress === "w") {
    player.velocity.y = -5;
  } else if (keys.d.pressed && lastKeyPress === "d") {
    player.velocity.x = 5;
  }

  ghosts.forEach((ghost) => {
    ghost.update();

    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
    }

    let collisions = [];
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes("right") &&
        checkConditionCollision(
          {
            ...ghost,
            velocity: {
              x: 10,
              y: 0,
            },
          },
          boundary
        )
      ) {
        collisions.push("right");
      }
      if (
        !collisions.includes("left") &&
        checkConditionCollision(
          {
            ...ghost,
            velocity: {
              x: -10,
              y: 0,
            },
          },
          boundary
        )
      ) {
        collisions.push("left");
      }
      if (
        !collisions.includes("up") &&
        checkConditionCollision(
          {
            ...ghost,
            velocity: {
              x: 0,
              y: -10,
            },
          },
          boundary
        )
      ) {
        collisions.push("up");
      }

      if (
        !collisions.includes("down") &&
        checkConditionCollision(
          {
            ...ghost,
            velocity: {
              x: 0,
              y: 10,
            },
          },
          boundary
        )
      ) {
        collisions.push("down");
      }

      if (ghost.previousCollisions.length < collisions.length) {
        ghost.previousCollisions = collisions;
      }

      if (
        JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollisions)
      ) {
        if (ghost.velocity.x > 0)
          !ghost.previousCollisions.includes("right") &&
            ghost.previousCollisions.push("right");
        if (ghost.velocity.x < 0)
          !ghost.previousCollisions.includes("left") &&
            ghost.previousCollisions.push("left");
        if (ghost.velocity.y > 0)
          !ghost.previousCollisions.includes("down") &&
            ghost.previousCollisions.push("down");
        if (ghost.velocity.y < 0)
          !ghost.previousCollisions.includes("up") &&
            ghost.previousCollisions.push("up");

        let t = ghost.previousCollisions.filter(
          (collision) => !collisions.includes(collision)
        );

        // console.log(t);
        const direction =
          ghost.previousCollisions[Math.floor(Math.random() * t.length)];

        switch (direction) {
          case "left":
            ghost.velocity.x = -10;
            ghost.velocity.y = 0;
            break;
          case "right":
            ghost.velocity.x = 10;
            ghost.velocity.y = 0;
            break;
          case "up":
            ghost.velocity.x = 0;
            ghost.velocity.y = -10;
            break;
          case "down":
            ghost.velocity.x = 0;
            ghost.velocity.y = 10;
            break;
        }
        ghost.previousCollisions = [];
      }
    });
  });
};
animation();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKeyPress = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKeyPress = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKeyPress = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKeyPress = "d";
      break;
    default:
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    default:
      break;
  }
});
