const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score-value')
const width = 8
const squares = []
let score = 0

const candyColors = [
  'url(images/red.png)',
  'url(images/yellow.png)',
  'url(images/orange.png)',
  'url(images/purple.png)',
  'url(images/green.png)',
  'url(images/blue.png)'
]

const swapSound = new Audio('sounds/swap.mp3')
const matchSound = new Audio('sounds/match.mp3')
swapSound.volume = 0.5
matchSound.volume = 0.5

// Enable sounds after user interaction
document.getElementById('start-btn').addEventListener('click', () => {
  swapSound.play().catch(() => {})
  matchSound.play().catch(() => {})
})

// Create board
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    square.setAttribute('draggable', true)
    square.setAttribute('id', i)
    let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
    square.style.backgroundImage = randomColor
    grid.appendChild(square)
    squares.push(square)
  }
}
createBoard()

// Dragging
let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced

squares.forEach(square => square.addEventListener('dragstart', dragStart))
squares.forEach(square => square.addEventListener('dragend', dragEnd))
squares.forEach(square => square.addEventListener('dragover', e => e.preventDefault()))
squares.forEach(square => square.addEventListener('dragenter', e => e.preventDefault()))
squares.forEach(square => square.addEventListener('drop', dragDrop))

function dragStart() {
  colorBeingDragged = this.style.backgroundImage
  squareIdBeingDragged = parseInt(this.id)
}

function dragDrop() {
  colorBeingReplaced = this.style.backgroundImage
  squareIdBeingReplaced = parseInt(this.id)
  squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
  this.style.backgroundImage = colorBeingDragged
  swapSound.play()
}

function dragEnd() {
  const validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ]
  let validMove = validMoves.includes(squareIdBeingReplaced)

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
  }
}

// Match checking
function checkRowForThree() {
  for (let i = 0; i < 64; i++) {
    let rowOfThree = [i, i+1, i+2]
    let decidedColor = squares[i].style.backgroundImage
    const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]
    if (notValid.includes(i)) continue

    if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && decidedColor !== '')) {
      score += 3
      rowOfThree.forEach(index => squares[index].style.backgroundImage = '')
      scoreDisplay.textContent = score
      matchSound.play()
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < 47; i++) {
    let columnOfThree = [i, i+width, i+width*2]
    let decidedColor = squares[i].style.backgroundImage

    if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && decidedColor !== '')) {
      score += 3
      columnOfThree.forEach(index => squares[index].style.backgroundImage = '')
      scoreDisplay.textContent = score
      matchSound.play()
    }
  }
}

// Gravity
function moveDown() {
  for (let i = 0; i < 56; i++) {
    if (squares[i + width].style.backgroundImage === '') {
      squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
      squares[i].style.backgroundImage = ''
    }
  }

  for (let i = 0; i < 8; i++) {
    if (squares[i].style.backgroundImage === '') {
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      squares[i].style.backgroundImage = randomColor
    }
  }
}

// Run continuously
window.setInterval(() => {
  checkRowForThree()
  checkColumnForThree()
  moveDown()
}, 100)
