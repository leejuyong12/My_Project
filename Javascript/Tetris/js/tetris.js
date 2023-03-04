// DOM(문서객체모델-Document Object Model) - XML이나 HTML 문서에 접근하기 위한 일종의 인터페이스, 문서 내의 모든 요소를 정의하고, 각각의 요소에 접근하는 방법을 제공
// 18분 23초부터
const playground = document.querySelector(".playground > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;



const BLOCKS = {
  tree: [
    [[0,0], [0,1], [1,0], [1,1]],
    [],
    [],
    [],
  ]
}

const movingItem = {
  type: "tree",
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
  
}

function prependNewLine(){
  
    const li = document.createElement("li"); // createElement : <li></li> 요소를 만든다
    const ul = document.createElement("ul"); // createElement : <ul></ul> 요소를 만든다
  
    for(let j=0; j<10; j++) {
      const matrix = document.createElement("li");
      ul.prepend(matrix); // prepend : 콘텐츠를 선택한 요소 내부의 시작부분에서 삽입
    }
    li.prepend(ul)
    playground.prepend(li)
  
}

function renderBlokcs(){

}