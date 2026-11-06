const SIZE = 8;
    const DIRECTIONS = {
      up: [-1, 0],
      right: [0, 1],
      down: [1, 0],
      left: [0, -1],
    };
    const DIR_LABELS = { up: "上", right: "右", down: "下", left: "左" };

    const levels = [
      {
        title: "第一束光",
        copy: "先熟悉直线滑行：终点前的墙让你恰好停下。",
        player: [7, 4], goal: [2, 4], lamps: [[4, 4]], fixedWalls: [[1, 4]], wallStock: 1,
        answer: { walls: [], moves: ["↑"], note: "无需放置墙体，向上滑行会被 B5 的固定墙稳稳拦住。" },
      },
      {
        title: "补上一面墙",
        copy: "横向滑行没有尽头时，墙就是你的刹车。",
        player: [1, 1], goal: [1, 6], lamps: [[1, 5]], fixedWalls: [[1, 7]], wallStock: 1,
        answer: { walls: [], moves: ["→"], note: "无需放置墙体，向右滑行会被 B8 的固定墙拦在 B7。" },
      },
      {
        title: "两盏灯之间",
        copy: "先在灯下横移，再沿另一束光上行。",
        player: [6, 0], goal: [1, 3], lamps: [[6, 0], [1, 3]], fixedWalls: [[0, 3]], wallStock: 1,
        answer: { walls: ["A1"], moves: ["↑", "→"], note: "先封住 A1，让竖向光路停在 B1，再横向滑到归宿门。" },
      },
      {
        title: "折向归宿",
        copy: "墙会同时改写移动路线和光线边界。",
        player: [7, 7], goal: [1, 0], lamps: [[7, 7], [0, 0]], fixedWalls: [], wallStock: 2,
        answer: { walls: ["A8"], moves: ["↑", "←"], note: "先放 A8，向上停在 B8，再向左穿过暗处抵达 A1 的灯光范围。" },
      },
      {
        title: "暗部之后",
        copy: "允许自己穿过暗部，但要把下一次停靠留给光。",
        player: [5, 1], goal: [2, 6], lamps: [[5, 1], [2, 6]], fixedWalls: [[0, 6]], wallStock: 2,
        answer: { walls: ["B2"], moves: ["↑", "→"], note: "B2 让第一段上行停在光区，随后向右穿过暗处抵达灯下终点。" },
      },
      {
        title: "最后一格光",
        copy: "留意每一面墙落下后，脚下是否仍然明亮。",
        player: [7, 2], goal: [1, 6], lamps: [[7, 2], [1, 6]], fixedWalls: [[0, 6]], wallStock: 2,
        answer: { walls: ["A3"], moves: ["↑", "→"], note: "A3 把上行停在 B3，横移后会经过终点灯。" },
      },
      {
        title: "交错光廊",
        copy: "两条光廊交叉，先让墙决定你从哪一侧停下。",
        player: [7, 0], goal: [1, 7], lamps: [[7, 0], [0, 7], [3, 3]],
        fixedWalls: [[7, 3], [3, 7], [0, 3]], wallStock: 2,
        answer: { walls: ["A1"], moves: ["↑", "→"], note: "A1 让小人停在 B1，再沿第二条光廊向右抵达 B8。" },
      },
      {
        title: "影子的折线",
        copy: "实体墙后的暗影也会挡住路线，绕开它再找下一束光。",
        player: [6, 6], goal: [1, 1], lamps: [[6, 6], [1, 1], [4, 2]],
        fixedWalls: [[6, 2], [2, 6], [4, 5]], wallStock: 3,
        answer: { walls: ["A4"], moves: ["←", "↑", "←"], note: "A4 让上行停在 B4，随后向左滑入 B2 终点。" },
      },
      {
        title: "三灯回环",
        copy: "在三盏灯之间连续换向，每次停靠都要重新确认脚下。",
        player: [7, 7], goal: [3, 3], lamps: [[7, 7], [3, 3], [0, 0]],
        fixedWalls: [[7, 4], [4, 7], [0, 4], [4, 0]], wallStock: 3,
        answer: { walls: ["F3"], moves: ["↑", "←", "↑"], note: "F3 把横移停在 F4，借 C4 的灯光上行即可抵达中心灯。" },
      },
      {
        title: "静默棋盘",
        copy: "可用墙体更多，光路更少；把每一次停靠当作一次落子。",
        player: [7, 1], goal: [0, 6], lamps: [[7, 1], [3, 6], [0, 6]],
        fixedWalls: [[7, 5], [5, 5], [2, 1], [0, 2]], wallStock: 4,
        answer: { walls: ["D8"], moves: ["↑", "→", "↑"], note: "先沿 B2 的光柱上行，再用 D8 在 D7 停靠，最后向上到 A7。" },
      },
      {
        title: "边界回声",
        copy: "边缘没有缓冲区，穿过暗处后要及时借墙刹住。",
        player: [4, 0], goal: [4, 7], lamps: [[4, 0], [4, 7], [1, 4]],
        fixedWalls: [[4, 3], [1, 7], [6, 4]], wallStock: 3,
        answer: { walls: ["A1", "F7"], moves: ["↑", "→", "↓", "→"], note: "A1 先锁住左侧上行，F7 再把右侧下行停在 E7。" },
      },
      {
        title: "归宿的背面",
        copy: "终点藏在交叉光线背后，绕过中央断墙，再把光路拼完整。",
        player: [7, 6], goal: [0, 1], lamps: [[7, 6], [0, 1], [3, 5], [3, 1], [4, 3]],
        fixedWalls: [[7, 2], [5, 5], [3, 3], [0, 5]], wallStock: 4,
        answer: { walls: ["E1"], moves: ["←", "↑", "←", "↑"], note: "E1 让左移停在 E2，连续两次上行穿过中央光廊抵达 A2。" },
      },
    ];

    const state = {
      levelIndex: 0,
      player: [0, 0],
      walls: new Set(),
      wallStock: 0,
      moves: 0,
      wallMode: false,
      animating: false,
      completed: new Set(),
      modalType: null,
    };

    const board = document.getElementById("board");
    const levelStrip = document.getElementById("levelStrip");
    const wallTool = document.getElementById("wallTool");
    const wallValue = document.getElementById("wallValue");
    const wallCount = document.getElementById("wallCount");
    const moveValue = document.getElementById("moveValue");
    const levelTitle = document.getElementById("levelTitle");
    const levelCopy = document.getElementById("levelCopy");
    const goalLabel = document.getElementById("goalLabel");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalKicker = document.getElementById("modalKicker");
    const modalTitle = document.getElementById("modalTitle");
    const modalCopy = document.getElementById("modalCopy");
    const modalRestart = document.getElementById("modalRestart");
    const modalNext = document.getElementById("modalNext");
    const toast = document.getElementById("toast");
    const answerToggle = document.getElementById("answerToggle");
    const answerContent = document.getElementById("answerContent");
    const answerWalls = document.getElementById("answerWalls");
    const answerMoves = document.getElementById("answerMoves");
    const answerNote = document.getElementById("answerNote");
    const directionButtons = [...document.querySelectorAll(".direction-button")];

    function key(row, col) { return `${row},${col}`; }
    function same(a, b) { return a[0] === b[0] && a[1] === b[1]; }
    function inside(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE; }
    function coordLabel([row, col]) { return `${String.fromCharCode(65 + row)}${col + 1}`; }
    function getLevel() { return levels[state.levelIndex]; }
    function isLamp(level, row, col) { return level.lamps.some(([r, c]) => r === row && c === col); }
    function isFixedWall(level, row, col) { return level.fixedWalls.some(([r, c]) => r === row && c === col); }
    function isPhysicalWall(level, row, col) { return isFixedWall(level, row, col) || state.walls.has(key(row, col)); }

    function lampSvg() {
      return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M13 18.5h14l-2.4 8H15.4l-2.4-8Z" fill="#F2C969" stroke="#FFF4C2" stroke-width="1.4"/>
        <path d="M16 28h8M20 27v6" stroke="#5BBBCB" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M20 6v4M9.5 10.5l2.6 2.6M6 21h4M30.5 10.5l-2.6 2.6M34 21h-4" stroke="#FFF0A9" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    }

    function goalSvg() {
      return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="20" cy="20" r="14" stroke="#F2C969" stroke-width="2"/>
        <circle cx="20" cy="20" r="8" stroke="#73D6E6" stroke-width="2"/>
        <circle cx="20" cy="20" r="2.5" fill="#F2C969"/>
      </svg>`;
    }

    function playerSvg() {
      return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="32" cy="32" r="25" fill="#F2C969" fill-opacity=".13" stroke="#F2C969" stroke-opacity=".55" stroke-width="1.5"/>
        <path d="M18 47.5c3.7-8 8.4-12 14-12s10.3 4 14 12" fill="#F2C969" stroke="#FFF4B3" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M20 30.5c0-10.2 4-16 12-16s12 5.8 12 16c0 3.3-1.2 6.4-3.7 9.2H23.7C21.2 36.9 20 33.8 20 30.5Z" fill="#17313B" stroke="#FFF4B3" stroke-width="1.8"/>
        <path d="M21.2 29.6c3.1 1.6 6.7 2.4 10.8 2.4 4.1 0 7.7-.8 10.8-2.4" stroke="#F2C969" stroke-width="1.7" stroke-linecap="round"/>
        <circle cx="27.6" cy="28.4" r="1.9" fill="#FFF4B3"/>
        <circle cx="36.4" cy="28.4" r="1.9" fill="#FFF4B3"/>
        <path d="M24 52h9M38 52h9" stroke="#73D6E6" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M13 55.5h9M42 55.5h9" stroke="#73D6E6" stroke-opacity=".48" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    }

    function computeLighting(level) {
      const lit = new Set();
      const shadowWalls = new Set();
      for (const [row, col] of level.lamps) {
        lit.add(key(row, col));
        for (const [dr, dc] of Object.values(DIRECTIONS)) {
          let r = row + dr;
          let c = col + dc;
          while (inside(r, c)) {
            if (isPhysicalWall(level, r, c)) {
              let shadowRow = r + dr;
              let shadowCol = c + dc;
              while (inside(shadowRow, shadowCol)) {
                shadowWalls.add(key(shadowRow, shadowCol));
                shadowRow += dr;
                shadowCol += dc;
              }
              break;
            }
            lit.add(key(r, c));
            r += dr;
            c += dc;
          }
        }
      }
      for (const cellKey of lit) shadowWalls.delete(cellKey);
      return { lit, shadowWalls };
    }

    function isBlockingCell(level, row, col, lighting) {
      return isPhysicalWall(level, row, col) || lighting.shadowWalls.has(key(row, col));
    }

    function resetLevel(index = state.levelIndex) {
      state.levelIndex = index;
      const level = getLevel();
      state.player = [...level.player];
      state.walls = new Set();
      state.wallStock = level.wallStock;
      state.moves = 0;
      state.wallMode = false;
      state.animating = false;
      state.modalType = null;
      toast.classList.remove("show");
      hideModal();
      render();
    }

    function renderLevelStrip() {
      levelStrip.innerHTML = levels.map((level, index) => {
        const classes = ["level-button"];
        if (index === state.levelIndex) classes.push("active");
        if (state.completed.has(index)) classes.push("complete");
        return `<button class="${classes.join(" ")}" type="button" data-level-index="${index}" aria-label="第${index + 1}关 ${level.title}">0${index + 1} · ${level.title}</button>`;
      }).join("");
      levelStrip.querySelectorAll(".level-button").forEach(button => {
        button.addEventListener("click", () => {
          if (state.animating) return;
          resetLevel(Number(button.dataset.levelIndex));
        });
      });
    }

    function canPlaceWall(row, col) {
      const level = getLevel();
      if (!inside(row, col) || isPhysicalWall(level, row, col) || isLamp(level, row, col)) return false;
      if (same(state.player, [row, col]) || same(level.goal, [row, col])) return false;
      return state.wallStock > 0;
    }

    function renderBoard() {
      const level = getLevel();
      const lighting = computeLighting(level);
      const goalKey = key(...level.goal);
      board.innerHTML = "";
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          const cell = document.createElement("button");
          const cellKey = key(row, col);
          cell.className = "cell";
          cell.type = "button";
          cell.dataset.row = String(row);
          cell.dataset.col = String(col);
          cell.setAttribute("role", "gridcell");
          cell.setAttribute("aria-label", coordLabel([row, col]));

          if (lighting.lit.has(cellKey)) cell.classList.add("lit");
          else cell.classList.add("dark");
          if (cellKey === goalKey) {
            cell.classList.add("goal-cell");
            cell.innerHTML += `<span class="goal-icon">${goalSvg()}</span>`;
          }
          if (isPhysicalWall(level, row, col)) cell.classList.add("wall");
          else if (lighting.shadowWalls.has(cellKey)) cell.classList.add("shadow-wall");
          if (isLamp(level, row, col)) {
            cell.classList.add("lamp-cell");
            cell.innerHTML += `<span class="lamp-icon">${lampSvg()}</span>`;
          }
          if (same(state.player, [row, col]) && state.modalType !== "loss") {
            cell.classList.add("piece-cell");
            cell.innerHTML += `<span class="piece">${playerSvg()}</span>`;
          }
          if (state.wallMode) {
            if (canPlaceWall(row, col)) cell.classList.add("wall-placeable");
            else if (!isPhysicalWall(level, row, col) && !lighting.shadowWalls.has(cellKey) && !isLamp(level, row, col)) cell.classList.add("invalid-place");
          }
          board.appendChild(cell);
        }
      }
      if (state.wallMode) {
        board.querySelectorAll(".wall-placeable").forEach(cell => cell.addEventListener("click", () => {
          placeWall(Number(cell.dataset.row), Number(cell.dataset.col));
        }));
      }
    }

    function renderStatus() {
      const level = getLevel();
      levelTitle.textContent = level.title;
      levelCopy.textContent = level.copy;
      wallValue.textContent = String(state.wallStock);
      wallCount.textContent = `×${state.wallStock}`;
      moveValue.textContent = String(state.moves);
      goalLabel.textContent = coordLabel(level.goal);
      wallTool.classList.toggle("selected", state.wallMode);
      wallTool.disabled = state.wallStock <= 0 || state.animating || state.modalType !== null;
      directionButtons.forEach(button => { button.disabled = state.animating || state.modalType !== null || state.wallMode; });
      renderAnswer();
    }

    function renderAnswer() {
      const answer = getLevel().answer || { walls: [], moves: [], note: "暂无答案。" };
      answerWalls.textContent = answer.walls.length ? answer.walls.join("、") : "无需放置墙体";
      answerMoves.innerHTML = answer.moves.map((move, index) => `<span class="answer-chip"><b>${index + 1}</b>${move}</span>`).join("");
      answerNote.textContent = answer.note;
      answerToggle.setAttribute("aria-expanded", String(!answerContent.hidden));
      answerToggle.textContent = answerContent.hidden ? "显示答案" : "隐藏答案";
    }

    function render() {
      renderLevelStrip();
      renderBoard();
      renderStatus();
    }

    function flashToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      window.clearTimeout(flashToast.timeout);
      flashToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1700);
    }

    function placeWall(row, col) {
      if (state.animating || !state.wallMode || !canPlaceWall(row, col)) return;
      state.walls.add(key(row, col));
      state.wallStock -= 1;
      state.wallMode = false;
      const lighting = computeLighting(getLevel());
      render();
      if (!lighting.lit.has(key(...state.player)) || lighting.shadowWalls.has(key(...state.player))) {
        endLoss("墙体切断了脚下的最后一束光。", 280);
      }
    }

    function simulateSlide(direction) {
      const level = getLevel();
      const [dr, dc] = DIRECTIONS[direction];
      let [row, col] = state.player;
      const steps = [];
      const lighting = computeLighting(level);
      while (true) {
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (!inside(nextRow, nextCol)) {
          return { type: "out", steps, final: [row, col] };
        }
        if (isBlockingCell(level, nextRow, nextCol, lighting)) {
          return { type: "stopped", steps, final: [row, col] };
        }
        row = nextRow;
        col = nextCol;
        steps.push([row, col]);
        if (same([row, col], level.goal)) {
          return { type: "goal", steps, final: [row, col] };
        }
      }
    }

    function animateSlide(result, direction) {
      state.animating = true;
      state.wallMode = false;
      renderStatus();
      const lighting = computeLighting(getLevel());
      const steps = result.steps;
      const duration = Math.max(90, Math.min(150, 900 / Math.max(steps.length, 1)));
      let stepIndex = 0;
      const tick = () => {
        if (stepIndex < steps.length) {
          state.player = [...steps[stepIndex]];
          stepIndex += 1;
          renderBoard();
          window.setTimeout(tick, duration);
          return;
        }
        state.animating = false;
        state.moves += 1;
        state.player = [...result.final];
        render();
        if (result.type === "out") {
          endLoss("没有墙体拦住去路，小人滑出了边缘。", 120);
        } else if (result.type === "goal") {
          if (lighting.lit.has(key(...result.final))) endWin();
          else endLoss("终点落在暗处，亮色小人不能在那里停留。", 120);
        } else if (!lighting.lit.has(key(...result.final))) {
          endLoss("暗处可以穿过，但亮色小人不能停在那里。", 120);
        } else if (steps.length === 0) {
          flashToast(`向${DIR_LABELS[direction]}没有可滑行的格子`);
        }
      };
      tick();
    }

    function move(direction) {
      if (state.animating || state.modalType !== null || state.wallMode) return;
      const result = simulateSlide(direction);
      animateSlide(result, direction);
    }

    function showModal(type, title, copy) {
      state.modalType = type;
      modalKicker.textContent = type === "win" ? "关卡完成" : "行动中止";
      modalTitle.textContent = title;
      modalCopy.textContent = copy;
      modalNext.hidden = type !== "win";
      modalRestart.textContent = type === "win" ? "重玩本关" : "重新开始";
      modalBackdrop.hidden = false;
      renderStatus();
    }

    function hideModal() {
      modalBackdrop.hidden = true;
      state.modalType = null;
    }

    function endLoss(copy, delay = 0) {
      window.setTimeout(() => showModal("loss", "光线断了", copy), delay);
    }

    function endWin() {
      state.completed.add(state.levelIndex);
      const isLast = state.levelIndex === levels.length - 1;
      showModal("win", isLast ? "所有光路已点亮" : "抵达归宿门", isLast ? "第一版关卡全部完成。" : "这条光路已经稳定，下一关正在等你。" );
    }

    wallTool.addEventListener("click", () => {
      if (wallTool.disabled) return;
      state.wallMode = !state.wallMode;
      render();
      if (state.wallMode) flashToast("选择一个空格放置墙体");
    });
    document.getElementById("restartButton").addEventListener("click", () => resetLevel());
    modalRestart.addEventListener("click", () => resetLevel());
    modalNext.addEventListener("click", () => {
      if (state.levelIndex < levels.length - 1) resetLevel(state.levelIndex + 1);
      else resetLevel(0);
    });
    directionButtons.forEach(button => button.addEventListener("click", () => move(button.dataset.direction)));

    answerToggle.addEventListener("click", () => {
      answerContent.hidden = !answerContent.hidden;
      renderAnswer();
    });

    window.addEventListener("keydown", event => {
      const map = { ArrowUp: "up", ArrowRight: "right", ArrowDown: "down", ArrowLeft: "left", w: "up", d: "right", s: "down", a: "left", W: "up", D: "right", S: "down", A: "left" };
      const direction = map[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    });

    resetLevel(0);
