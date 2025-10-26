class Compositor {
  constructor() {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
    this.screen = [];
    this.padding = "  ";
    this.newLine = "\n";
    this.pole = "│";
    this.rod = "─";
    this.row = [...this.genRow()];
    this.refresh = () => {};
    this.dirty = false;
  }
  init = () => {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
    this.screen = [];
    let row = [...this.genRow()];
    for (let i = 0; i < this.height; i++) {
      this.screen.push([...row]);
    }
    this.dirty = true;
  };
  display() {
    const cols = process.stdout.columns;
    const rows = process.stdout.rows;
    if (cols !== this.width || rows !== this.height) {
      this.init();
    }
    if (!this.dirty) {
      return;
    }
    const frame = this.toString();
    process.stdout.write("\x1b[2J\x1b[H" + frame + "\n");
    this.dirty = false;
  }
  toString = (screen = this.screen) => {
    return screen.map((scr) => scr.join("")).join("\n");
  };
  genRow = (width = this.width, char = " ") => {
    let row = [];
    for (let i = 0; i < width; i++) {
      row.push(char);
    }
    return [...row];
  };
  genFill = (width = this.width, height = this.height) => {
    let screen = [];
    let row = [...this.genRow(width)];
    for (let i = 0; i < height; i++) {
      screen.push([...row]);
    }
    return [...screen];
  };
  drawDivider = (x, y, height, char = "│") => {
    for (let i = y; i < y + height; i++) {
      if ((this.screen[i] || [])[x]) {
        (this.screen[i] || [])[x] = String(char);
      }
    }
    this.dirty = true;
  };
  drawRow = (x, y, width, char = "─") => {
    this.fill(x, y, width, 1, char);
  };
  draw = (x = 0, y = 0, width = 1, height = 1, content = " ") => {
    // Create a screen buffer to compose the content
    let secBuff = this.genFill(width, height);
    const toLines = content.split("\n").map((i) => i.split(""));
    for (let row = 0; row < toLines.length; row++) {
      for (let col = 0; col < toLines[row].length; col++) {
        if ((secBuff[row] || [])[col]) {
          secBuff[row][col] = toLines[row][col];
        }
      }
    }
    let yCounter = 0;
    let xCounter = 0;
    for (let screenY = y; screenY < height + y; screenY++) {
      for (let screenX = x; screenX < width + x; screenX++) {
        if ((this.screen[screenY] || [])[screenX]) {
          this.screen[screenY][screenX] = secBuff[yCounter][xCounter];
        }
        xCounter++;
      }
      xCounter = 0;
      yCounter++;
    }
    // console.log(this.screen.map((dat) => dat.join("")).join("\n"));
    this.dirty = true;
  };
  fill = (x = 0, y = 0, width = 1, height = 1, char = " ") => {
    // Create a screen buffer to compose the content
    let secBuff = this.genFill(width, height);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if ((secBuff[row] || [])[col]) {
          secBuff[row][col] = (char || " ")[0];
        }
      }
    }
    let yCounter = 0;
    let xCounter = 0;
    for (let screenY = y; screenY < height + y; screenY++) {
      for (let screenX = x; screenX < width + x; screenX++) {
        if ((this.screen[screenY] || [])[screenX]) {
          this.screen[screenY][screenX] = secBuff[yCounter][xCounter];
        }
        xCounter++;
      }
      xCounter = 0;
      yCounter++;
    }
    this.dirty = true;
  };
}

const compositor = new Compositor();

class UseCompositor {
  constructor() {
    this.compositor = compositor;
    process.compositor = compositor;
    process.refreshCompositor = () => {};
  }
}

module.exports = UseCompositor;

// let gX = 10;
// let gY = 10;
// let speedX = 1;
// let speedY = 1;
// compositor.init();
// const greetings =
//   "\nGood Morning Fella\nYou had a great day didn't You?\nCongrats on the EasteEgg";
// const header = "SprintET FSDiscover";
// compositor.draw(4, 4, 20, 5, header);
// compositor.draw(gX, gY, 32, 5, greetings);

// setInterval(() => {
//   compositor.fill(gX - 2, gY - 2, 35, 15, " ");
//   compositor.draw(gX, gY, 32, 5, greetings);
//   if (gX > compositor.width - 32) {
//     speedX *= -1;
//   }
//   if (gY > compositor.height - 3) {
//     speedY *= -1;
//   }
//   if (gX < 1) {
//     speedX *= -1;
//   }
//   if (gY < 1) {
//     speedY *= -1;
//   }
//   gX += speedX;
//   gY += speedY;
// }, 200);
