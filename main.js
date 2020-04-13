const n = null;

const colors = [
  "#ffee77",
  "#ffaa00",
  "#e58800",
  "#bb6600",
  "#aa3300",
  "#880000",
];
const puzzle = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const ripples = [];
const nulls = [];
let h = 4,
  w = 4;

const puzzleWrapper = document.createElement("div");
puzzleWrapper.id = "puzzleWrapper";

const sideBarElement = document.createElement("div");
sideBarElement.id = "sidebar";

const stringifiedTextarea = document.createElement("textarea");
stringifiedTextarea.id = "stringifiedTextarea";
stringifiedTextarea.readOnly = true;

window.onload = () => {
  console.log(`loading puzzle`);
  setPuzzle(blankPuzzle(h, w));
  loadPuzzle();
  resetPuzzle();
  loadSidebar();
};

const loadPuzzle = () => {
  document.body.appendChild(puzzleWrapper);
};
const loadSidebar = () => {
  const undoBtn = document.createElement("button");
  undoBtn.innerHTML = "Undo Ripple";
  undoBtn.onclick = undoRipple;
  sideBarElement.appendChild(undoBtn);

  sideBarElement.appendChild(stringifiedTextarea);

  document.body.appendChild(sideBarElement);
};
const resetPuzzle = () => {
  const prevElement = document.getElementById("puzzle");
  if (prevElement) puzzleWrapper.removeChild(prevElement);
  const puzzleElement = document.createElement("div");
  puzzleElement.id = "puzzle";
  const rows = puzzle.length;
  const cols = puzzle[0].length;
  const width = 90 * (cols / rows);
  const height = 90 / rows;
  puzzleElement.style.gridTemplateColumns = puzzle[0]
    .map(() => height + "vh")
    .join(" ");
  puzzleElement.style.width = width + "vh";
  puzzle.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      const tileElement = document.createElement("div");
      tileElement.className = "tile tile-" + tile;
      tileElement.style.backgroundColor = colors[tile] + "b8";
      tileElement.style.borderColor = colors[tile] + "cc";
      tileElement.innerHTML = tile ? tile : "X";
      tileElement.onclick = () => {
        addRipple(rowIndex, tileIndex);
      };
      tileElement.oncontextmenu = (e) => {
        toggleNull(rowIndex, tileIndex);
        e.preventDefault();
        return false;
      };
      puzzleElement.appendChild(tileElement);
    });
  });
  puzzleWrapper.appendChild(puzzleElement);
  updateTextarea();
};
const blankPuzzle = (h, w) => {
  return Array(h)
    .fill()
    .map(() =>
      Array(w)
        .fill()
        .map(() => 0)
    );
};
const setPuzzle = (newPuzzle) => {
  while (puzzle.length) puzzle.pop();
  newPuzzle.forEach((row) => puzzle.push(row));
};
const addRipple = (rowIndex, tileIndex) => {
  ripples.push([rowIndex, tileIndex]);
  _applyRipples();
};
const toggleNull = (rowIndex, tileIndex) => {
  let nullIndex = -1;
  for (let i = 0; i < nulls.length; i++) {
    const [r, t] = nulls[i];
    if (rowIndex === r && tileIndex === t) {
      nullIndex = i;
      break;
    }
  }
  nullIndex === -1
    ? nulls.push([rowIndex, tileIndex])
    : nulls.splice(nullIndex, 1);
  _applyRipples();
};
const undoRipple = () => {
  ripples.pop();
  _applyRipples();
};
const _applyRipples = () => {
  setPuzzle(blankPuzzle(4, 4));
  nulls.forEach(([rowIndex, tileIndex]) => (puzzle[rowIndex][tileIndex] = n));
  ripples.forEach(([rowIndex, tileIndex]) => {
    if (puzzle[rowIndex][tileIndex] === null) {
      return;
    }
    for (let r = rowIndex - 1; r <= rowIndex + 1; r++) {
      for (let t = tileIndex - 1; t <= tileIndex + 1; t++) {
        if (puzzle[r] && puzzle[r][t] !== undefined && puzzle[r][t] !== null) {
          puzzle[r][t]++;
        }
      }
    }
  });
  resetPuzzle();
};

const updateTextarea = () => {
  const stringified = JSON.stringify(puzzle)
    .split("null")
    .join("n")
    .split("],")
    .join("],\n")
    .split("[[")
    .join("[\n[")
    .split("]]")
    .join("]\n]");
  stringifiedTextarea.value = stringified;
};
