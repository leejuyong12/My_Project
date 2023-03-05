import BLOCKS from "./blocks.js"

// DOM(문서객체모델-Document Object Model) - XML이나 HTML 문서에 접근하기 위한 일종의 인터페이스, 문서 내의 모든 요소를 정의하고, 각각의 요소에 접근하는 방법을 제공

const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 800;
let downInterval;
let tempMovingItem;





const movingItem = {
  type: "",
  direction: 0,
  top: 0,
  left: 0,
};

init()

// functions
function init(){

  tempMovingItem = { ...movingItem }; // spreadOperator - 내용만 가져온다.(값 복사)

  for(let i=0; i<GAME_ROWS; i++) {
    prependNewLine()
  }
  generateNewBlock()
}

function prependNewLine(){
  
    const li = document.createElement("li"); // createElement : <li></li> 요소를 만든다
    const ul = document.createElement("ul"); // createElement : <ul></ul> 요소를 만든다
  
    for(let j=0; j<GAME_COLS; j++) {
      const matrix = document.createElement("li");
      ul.prepend(matrix); // prepend : 콘텐츠를 선택한 요소 내부의 시작부분에서 삽입
    }
    li.prepend(ul)
    playground.prepend(li)
  
}

function renderBlocks(moveType=""){
  const { type, direction, top, left } = tempMovingItem; //destructuring
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving=>{
    moving.classList.remove(type, "moving");
  })


  BLOCKS[type][direction].some(block => { // some이 아니라 foreach는 중간에 break 시킬수 없다
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
    // 삼항연산자 활용(변수에도 사용 가능)
    const isAvailable = checkEmpty(target); // 범위 벗어나는거 체크하기
    if(isAvailable){
      target.classList.add(type, "moving") // 이동하면서 전의 클래스는 삭제(이동하는거니까 기록 없애기)
    } else {
      tempMovingItem = { ...movingItem }
      if(moveType === 'retry'){
        clearInterval(downInterval)
        showGameoverText()
      }
      // 그냥 renderBlocks();  재귀함수만을 호출하면 Maximum call stack size exceeded 에러 발생
      // 38분쯤
      setTimeout(()=>{
        renderBlocks("retry");
        if(moveType === "top"){
          seizeBlock();
        }
        
      }, 0)
      return true;
    }
  })
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock(){ // 내려갈 곳이 없으면 고정시키기
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving=>{
    moving.classList.remove("moving");
    moving.classList.add("seized");
  })
  checkMatch() // 한줄 완성하면 삭제
}

function checkMatch(){
  const childNodes = playground.childNodes;
  childNodes.forEach(child=>{
    let matched = true;
    child.children[0].childNodes.forEach(li=>{
      if(!li.classList.contains("seized")){ //완성된 애들은 seized를 가지고 있을 수 밖에 없다
        matched = false;
      }
    })
    if(matched){
      child.remove();
      prependNewLine()
      score ++;
      scoreDisplay.innerText = score;
    }
  })

  generateNewBlock()
}

function generateNewBlock(){ // 새로운 블럭 생성

  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock('top', 1)
  }, duration)

  const blockArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random()* blockArray.length)
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = {...movingItem};
  renderBlocks()
}

function checkEmpty(target){
  if(!target || target.classList.contains("seized")){ //contains 포함하고 있는지 없는지 판단
    return false;
  }
  return true;
}

function moveBlock(moveType, amount){
  tempMovingItem[moveType] += amount
  renderBlocks(moveType)
}

function changeDirection(){
  const direction = tempMovingItem.direction;
  direction === 3 ? tempMovingItem.direction = 0: tempMovingItem.direction += 1;
  renderBlocks()
}

function dropBlock(){
  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock("top", 1)
  },10)
}

function showGameoverText(){
  gameText.style.display = "flex"
}

// event handling
document.addEventListener("keydown", e=> { // keydown - 키보드 클릭시
  switch(e.keyCode){  // console.log(e) 찍어보면 keycode 나온다.
    case 39: // 오른쪽 버튼
      moveBlock("left", 1);
      break;
    case 37: // 왼쪽 버튼
      moveBlock("left", -1);
      break;
    case 40: // 아래 버튼
      moveBlock("top", 1);
      break;
    case 38: // 위 버튼(block 돌리기)
      changeDirection();
      break;
    case 32: // 스페이스바 (한번에 내리기)
      dropBlock();
      break;
    default:
      break;

  }
})

restartButton.addEventListener("click", ()=>{
  playground.innerHTML = "";
  gameText.style.display = "none"
  init()
})