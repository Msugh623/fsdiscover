class Compositor {
  constructor() {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
    this.screen = [];
    this.padding = "  ";
    this.newLine = "\n";
    this.row = [...this.genRow()];
  }
  init = () => {
    let row = [...this.genRow()];
    for (let i = 0; i < this.height; i++) {
      this.screen.push([...row]);
    }
  };
  display() {
    process.stdout.write("\x1b[2J");
    process.stdout.write("\x1b[H");
    process.stdout.write("\x1b");
    process.stdout.write(this.toString());
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
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
  drawDivider = (x, height, char = "|") => {
    for (let i = 0; i < height; i++) {
      screen[height][x] = char;
    }
  };
  draw = (x = 0, y = 0, width = 1, height = 1, content = " ") => {
    // Create a screen buffer to compose the content
    let secBuff = this.genFill(width, height);
    const toLines = content.split("\n").map((i) => i.split(""));
    for (let row = 0; row < toLines.length; row++) {
      for (let col = 0; col < toLines[row].length; col++) {
        if ((secBuff[row]||[])[col]) {
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
    this.display();
  };
}

const compositor = new Compositor();

class UseCompositor {
  constructor() {
    this.compositor = compositor;
  }
}

module.exports = UseCompositor;

compositor.init();
const greetings =
  "\ngood Morning snitch\nwe had a great day didn't we?\nnew run time";
compositor.draw(5, 10, 30, 5, greetings);
