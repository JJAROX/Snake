let snakeDirection = 'right';
    let snakeSegments = [];
    let gameInterval;
    let applePosition = { row: -1, col: -1 };
    let currentDifficulty = 'łatwy';

    function createGrid(rows, cols) {
      const gridContainer = document.createElement('div');
      gridContainer.classList.add('grid');

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const gridItem = document.createElement('div');
          gridItem.classList.add('grid-item');
          gridContainer.appendChild(gridItem);
        }
      }

      document.body.appendChild(gridContainer);

      const middleRowIndex = Math.floor(rows / 2);
      const middleColIndex = Math.floor(cols / 2);
      snakeSegments = [
        { row: middleRowIndex, col: middleColIndex },
        { row: middleRowIndex, col: middleColIndex - 1 }
      ];

      renderSnake();
      placeApple();

      document.addEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(event) {
      switch (event.key) {
        case 'W':
        case 'w':
          snakeDirection = 'up';
          break;
        case 'S':
        case 's':
          snakeDirection = 'down';
          break;
        case 'A':
        case 'a':
          snakeDirection = 'left';
          break;
        case 'D':
        case 'd':
          snakeDirection = 'right';
          break;
      }
    }

    function moveSnake() {
      const gridSize = 21;
      const head = { ...snakeSegments[0] };
      switch (snakeDirection) {
        case 'up':
          head.row -= 1;
          break;
        case 'down':
          head.row += 1;
          break;
        case 'left':
          head.col -= 1;
          break;
        case 'right':
          head.col += 1;
          break;
      }

      if (isValidMove(head)) {
        snakeSegments.unshift(head);
        const gridContainer = document.querySelector('.grid');
        const headIndex = head.row * gridSize + head.col;
        if (gridContainer.children[headIndex].classList.contains('apple')) {
          placeApple();
        } else {
          const tail = snakeSegments.pop();
          const tailIndex = tail.row * gridSize + tail.col;
          gridContainer.children[tailIndex].classList.remove('snake-tail');
        }
        gridContainer.children[headIndex].classList.add('snake-head');
        renderSnake();

        if (isCollisionWithFrame(head, gridSize) || isCollisionWithSelf(head)) {
          clearInterval(gameInterval);
          alert('Przegrałeś 🤣🤣🤣');
          resetGame();
        }
      } else {
        clearInterval(gameInterval);
        alert('Przegrałeś 🤣🤣🤣');
        resetGame();
      }
    }

    function isValidMove(head) {
      const gridSize = 21;

      if (
        head.row < 0 ||
        head.row >= gridSize ||
        head.col < 0 ||
        head.col >= gridSize
      ) {
        return false;
      }
      return !snakeSegments.some(segment => segment.row === head.row && segment.col === head.col) &&
        !gridItemIsOccupiedBySnake(head);
    }

    function gridItemIsOccupiedBySnake(position) {
      return snakeSegments.some(segment => segment.row === position.row && segment.col === position.col);
    }

    function isCollisionWithFrame(head, gridSize) {
      return (
        head.row < 0 ||
        head.row >= gridSize ||
        head.col < 0 ||
        head.col >= gridSize
      );
    }

    function isCollisionWithSelf(head) {
      return snakeSegments.slice(1).some(segment => segment.row === head.row && segment.col === head.col);
    }

    function placeApple() {
      const gridSize = 21;
      const gridContainer = document.querySelector('.grid');
      gridContainer.querySelector('.apple')?.classList.remove('apple');

      let randomRow, randomCol;
      do {
        randomRow = Math.floor(Math.random() * (gridSize - 2)) + 1;
        randomCol = Math.floor(Math.random() * (gridSize - 2)) + 1;
      } while (gridItemIsOccupiedBySnake({ row: randomRow, col: randomCol }));

      applePosition = { row: randomRow, col: randomCol };

      const appleElement = gridContainer.children[randomRow * gridSize + randomCol];
      appleElement.classList.add('apple');
    }

    function resetGame() {
      const existingGrid = document.querySelector('.grid');
      if (existingGrid) {
        document.body.removeChild(existingGrid);
      }
      snakeDirection = 'right';
      snakeSegments = [];
      applePosition = { row: -1, col: -1 };
      clearInterval(gameInterval);
      showLevelSelection();
      createGrid(21, 21);
    }

    function renderSnake() {
      const gridContainer = document.querySelector('.grid');

      for (let i = 0; i < gridContainer.children.length; i++) {
        gridContainer.children[i].classList.remove('snake-head', 'snake-tail');
      }

      snakeSegments.forEach((segment, index) => {
        const segmentIndex = segment.row * 21 + segment.col;
        if (index === 0) {
          gridContainer.children[segmentIndex].classList.add('snake-head');
        } else {
          gridContainer.children[segmentIndex].classList.add('snake-tail');
        }
      });
    }

    function showLevelSelection() {
      document.getElementById('level-heading').classList.remove('hidden');
      document.getElementById('level-selection').classList.remove('hidden');
      document.getElementById('level-display').classList.add('hidden');
    }

    function setDifficulty(difficulty) {
      currentDifficulty = difficulty;

      switch (difficulty) {
        case 'Łatwy':
          gameInterval = setInterval(moveSnake, 150);
          break;
        case 'Normalny':
          gameInterval = setInterval(moveSnake, 100);
          break;
        case 'Ekstremalny':
          gameInterval = setInterval(moveSnake, 50);
          break;
      }

      document.getElementById('level-heading').classList.add('hidden');
      document.getElementById('level-selection').classList.add('hidden');
      document.getElementById('level-display').textContent = `Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
      document.getElementById('level-display').classList.remove('hidden');
    }

    showLevelSelection();
    createGrid(21, 21);