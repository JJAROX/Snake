let snakeDirection = 'right'
let snakeElements = []
let gameInterval
let applePosition = {
  row: -1,
  col: -1
}
let currentDifficulty = 'łatwy'
function createGrid(rows, cols) {
  const gridContainer = document.createElement('div')
  gridContainer.classList.add('grid')
  for (let i = 0; i < rows * cols; i++) {
    const gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    const imgElement = document.createElement('img')
    imgElement.src = ''
    gridItem.append(imgElement)
    gridContainer.append(gridItem)

  }
  document.body.append(gridContainer)
  startSnake(rows, cols)
  renderSnake()
  placeApple()
  document.addEventListener('keydown', handleKeyPress)
}
function startSnake(rows, cols) {
  const middleRowIndex = Math.floor(rows / 2)
  const middleColIndex = Math.floor(cols / 2)
  snakeElements = [
    {
      row: middleRowIndex,
      col: middleColIndex,
      direction: 'right'
    },
    {
      row: middleRowIndex,
      col: middleColIndex - 1,
      direction: 'right'
    }
  ]
}
function handleKeyPress(event) {
  switch (event.key) {
    case 'w':
    case 'W':
    case 'ArrowUp':
      snakeDirection = 'up'
      break
    case 's':
    case 'S':
    case 'ArrowDown':
      snakeDirection = 'down'
      break
    case 'a':
    case 'A':
    case 'ArrowLeft':
      snakeDirection = 'left'
      break
    case 'd':
    case 'D':
    case 'ArrowRight':
      snakeDirection = 'right'
      break
  }
}
function moveSnake() {
  const gridSize = 21
  const head = { ...snakeElements[0] }
  switch (snakeDirection) {
    case 'up':
      head.row -= 1
      break
    case 'down':
      head.row += 1
      break
    case 'left':
      head.col -= 1
      break
    case 'right':
      head.col += 1
      break
  }
  if (isValidMove(head)) {
    snakeElements.unshift(head)
    const gridContainer = document.querySelector('.grid')
    const headIndex = head.row * gridSize + head.col
    if (gridContainer.children[headIndex].classList.contains('apple')) {
      placeApple()
    } else {
      const tail = snakeElements.pop()
      const tailIndex = tail.row * gridSize + tail.col
      gridContainer.children[tailIndex].classList.remove('snake-tail')
    }
    gridContainer.children[headIndex].classList.add('snake-head')
    renderSnake()
    if (BorderCollision(head, gridSize) || SelfCollision(head)) {
      clearInterval(gameInterval)
      alert('Przegrałeś 🤣🤣🤣')
      resetGame()
    }
  } else {
    clearInterval(gameInterval)
    alert('Przegrałeś 🤣🤣🤣')
    resetGame()
  }
}
function isValidMove(head) {
  const gridSize = 21
  if (
    head.row < 0 || head.row >= gridSize || head.col < 0 || head.col >= gridSize
  ) {
    return false
  }
  return !snakeElements.find(element => element.row === head.row && element.col === head.col) &&
    !SnakeOnGrid(head)
}
function SnakeOnGrid(position) {
  return snakeElements.find(element => element.row === position.row && element.col === position.col)
}
function BorderCollision(head, gridSize) {
  return (
    head.row < 0 || head.row >= gridSize || head.col < 0 || head.col >= gridSize
  )
}
function SelfCollision(head) {
  return snakeElements.slice(1).find(element => element.row === head.row && element.col === head.col)
}
function placeApple() {
  const gridSize = 21
  const gridContainer = document.querySelector('.grid')
  gridContainer.querySelector('.apple')?.classList.remove('apple')
  let randomRow, randomCol
  while (true) {
    randomRow = Math.floor(Math.random() * (gridSize - 2)) + 1
    randomCol = Math.floor(Math.random() * (gridSize - 2)) + 1

    if (!SnakeOnGrid({ row: randomRow, col: randomCol })) {
      break
    }
  }
  applePosition = {
    row: randomRow,
    col: randomCol
  }
  const appleElement = gridContainer.children[randomRow * gridSize + randomCol]
  appleElement.classList.add('apple')
}
function resetGame() {
  const existingGrid = document.querySelector('.grid')
  if (existingGrid) {
    document.body.removeChild(existingGrid)
  }
  snakeDirection = 'right'
  snakeElements = []
  applePosition = {
    row: -1,
    col: -1
  }
  clearInterval(gameInterval)
  showLevelSelection()
  createGrid(21, 21)
}
function renderSnake() {
  const gridContainer = document.querySelector('.grid')

  for (let i = 0; i < gridContainer.children.length; i++) {
    gridContainer.children[i].innerHTML = ''
    gridContainer.children[i].classList.remove('snake-head', 'snake-tail', 'snake-body')
  }
  snakeElements.forEach((element, index) => {
    const elementIndex = element.row * 21 + element.col
    const snakeElement = document.createElement('div')
    const imgElement = document.createElement('img')
    imgElement.width = 25
    imgElement.height = 25
    if (index === 0) {
      imgElement.src = './gfx/snake-head.png'
      imgElement.style.transform = rotation(snakeDirection)
      snakeElement.classList.add('snake-head')
    } else if (index === snakeElements.length - 1) {
      imgElement.src = './gfx/snake-tail.png'
      imgElement.style.transform = SnakeTailRotation()
      snakeElement.classList.add('snake-tail')
    } else {
      imgElement.src = './gfx/body.png'
      imgElement.style.transform = SnakeBodyRotation(index)
      snakeElement.classList.add('snake-body')
    }
    snakeElement.append(imgElement)
    gridContainer.children[elementIndex].append(snakeElement)
  })
}
function rotation(direction) {
  switch (direction) {
    case 'up':
      return 'rotate(180deg)'
    case 'down':
      return ''
    case 'left':
      return 'rotate(90deg)'
    case 'right':
      return 'rotate(-90deg)'
  }
}
function SnakeTailRotation() {
  const tailIndex = snakeElements.length - 1
  const prevTailIndex = snakeElements.length - 2
  if (prevTailIndex >= 0) {
    const deltaX = snakeElements[tailIndex].col - snakeElements[prevTailIndex].col
    const deltaY = snakeElements[tailIndex].row - snakeElements[prevTailIndex].row
    if (deltaX === 1) {
      return 'rotate(-90deg)'
    } else if (deltaX === -1) {
      return 'rotate(90deg)'
    } else if (deltaY === 1) {
      return ''
    } else if (deltaY === -1) {
      return 'rotate(180deg)'
    }
  }
}
function SnakeBodyRotation(index) {
  if (index > 0) {
    const deltaX = snakeElements[index].col - snakeElements[index - 1].col
    const deltaY = snakeElements[index].row - snakeElements[index - 1].row
    if (deltaX === 1) {
      return 'rotate(90deg)'
    } else if (deltaX === -1) {
      return 'rotate(-90deg)'
    } else if (deltaY === 1) {
      return ''
    } else if (deltaY === -1) {
      return 'rotate(180deg)'
    }
  }
}
function showLevelSelection() {
  document.getElementById('level-heading').classList.remove('hidden')
  document.getElementById('level-selection').classList.remove('hidden')
  document.getElementById('level-display').classList.add('hidden')
}
function setDifficulty(difficulty) {
  currentDifficulty = difficulty
  switch (difficulty) {
    case 'Łatwy':
      gameInterval = setInterval(moveSnake, 150)
      break
    case 'Normalny':
      gameInterval = setInterval(moveSnake, 100)
      break
    case 'Ekstremalny':
      gameInterval = setInterval(moveSnake, 50)
      break
  }
  document.getElementById('level-heading').classList.add('hidden')
  document.getElementById('level-selection').classList.add('hidden')
  document.getElementById('level-display').textContent = `Level: ${difficulty}`
  document.getElementById('level-display').classList.remove('hidden')
}
showLevelSelection()
createGrid(21, 21)
