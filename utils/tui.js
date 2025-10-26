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
    const toLines = content.split("\n");
    for (let row = 0; row < Math.min(toLines.length, height); row++) {
      const line = toLines[row];
      let col = 0;
      let i = 0;
      let activeAnsi = "";
      while (i < line.length && col < width) {
        if (line[i] === "\x1b") {
          const match = line.slice(i).match(/^\x1b\[[0-9;?]*[A-Za-z]/);
          if (match) {
            activeAnsi += match[0];
            i += match[0].length;
            continue;
          }
        }
        const info = this.readGrapheme(line, i);
        const cellWidth = Math.max(this.getDisplayWidth(info.base), 1);
        if (col + cellWidth > width) {
          break;
        }
        if ((secBuff[row] || [])[col] !== undefined) {
          secBuff[row][col] = (activeAnsi || "") + info.grapheme;
          for (let pad = 1; pad < cellWidth; pad++) {
            if (
              col + pad < width &&
              (secBuff[row] || [])[col + pad] !== undefined
            ) {
              secBuff[row][col + pad] = "";
            }
          }
        }
        activeAnsi = "";
        col += cellWidth;
        i += info.length;
      }
      if (activeAnsi && col > 0) {
        secBuff[row][Math.min(col - 1, width - 1)] += activeAnsi;
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

  readGrapheme(str, index) {
    const codePoint = str.codePointAt(index);
    let length = codePoint > 0xffff ? 2 : 1;
    let grapheme = String.fromCodePoint(codePoint);
    let ptr = index + length;
    while (ptr < str.length) {
      const cp = str.codePointAt(ptr);
      const cat = this.getUnicodeCategory(cp);
      if (cat !== "Mn" && cat !== "Me" && cat !== "Cf") {
        break;
      }
      const nextChar = String.fromCodePoint(cp);
      grapheme += nextChar;
      ptr += nextChar.length;
      length += nextChar.length;
    }
    return { grapheme, length, base: String.fromCodePoint(codePoint) };
  }

  getUnicodeCategory(cp) {
    if (cp >= 0x0300 && cp <= 0x036f) return "Mn";
    if (cp >= 0x1ab0 && cp <= 0x1aff) return "Mn";
    if (cp >= 0x1dc0 && cp <= 0x1dff) return "Mn";
    if (cp >= 0x20d0 && cp <= 0x20ff) return "Mn";
    if (cp >= 0xfe20 && cp <= 0xfe2f) return "Mn";
    if (cp === 0x200d) return "Cf"; // zero-width joiner
    if (cp === 0x2060) return "Cf"; // word joiner
    return "L";
  }

  getDisplayWidth(char) {
    const cp = char.codePointAt(0);
    if (cp <= 0x1f || (cp >= 0x7f && cp <= 0x9f)) {
      return 0;
    }
    if (
      (cp >= 0x1100 && cp <= 0x115f) ||
      cp === 0x2329 ||
      cp === 0x232a ||
      (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
      (cp >= 0xac00 && cp <= 0xd7a3) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe10 && cp <= 0xfe19) ||
      (cp >= 0xfe30 && cp <= 0xfe6f) ||
      (cp >= 0xff00 && cp <= 0xff60) ||
      (cp >= 0xffe0 && cp <= 0xffe6)
    ) {
      return 2;
    }
    // Treat emojis as double-width
    if (
      (cp >= 0x1f300 && cp <= 0x1f5ff) ||
      (cp >= 0x1f600 && cp <= 0x1f64f) ||
      (cp >= 0x1f680 && cp <= 0x1f6ff) ||
      (cp >= 0x1f900 && cp <= 0x1f9ff) ||
      (cp >= 0x1fa70 && cp <= 0x1faff)
    ) {
      return 2;
    }
    return 1;
  }
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
