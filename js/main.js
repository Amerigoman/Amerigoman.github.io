var bomb = [];

function rand (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getAllBombsAndCells() {
  var result = [];
  var amount = 0;

  for(var i = 0; i < bomb.length; i++) {

		for(var j = 0; j < bomb[i].length; j++) {
			if(bomb[i][j] === 1) {
				amount++;
				continue;
			}
		}		
	}
}

function initiateField(bomb) {
	var area = [];

	for(var i = 0; i < 10; i++) {
		area.push([]);
		bomb.push([]);

		for(var j = 0; j < 10; j++) {
			cellsAmount++;

			if(rand(0, 10) > 8) {
				amountBombs++;
				bomb[i].push('1');
			} else {
				bomb[i].push('0');
			}
		}		
	}

	for(i = 0; i < 10; i++) {

		for(j = 0; j < 10; j++) {
			if(bomb[i][j] == 1) {
				area[i].push('X');
			} else {
				area[i].push( getBombAmount(i, j) );
			}
		}		
	}

	return area;
}

var openedCells = 0;
var amountBombs = 0;
var cellsAmount = 0;
var area = initiateField(bomb);

console.log(amountBombs + ' ' + cellsAmount);
 
var selectedTd;
var table = document.getElementsByTagName('table');

table[0].onclick = function(event) {

  var self = this;
  var target = event.target; // где был клик?
  if(target.matches('.opened')) {
  	console.log('cells is already opened ');
  	return;
  }

  if (target.tagName != "TD") {
    return; // не на TD? тогда не интересует
  }

  var row = target.parentElement.rowIndex,
      cell = target.cellIndex;
  var value = area[row][cell];
  var elem = self.firstElementChild.children[row].children[cell];

  if(value == 'X') {
  	gameOver();
  } else if(value != 0) {
  	elem.innerHTML = value;
    highlight(target, value);
    return;
  } else {
  	openCells(self, row, cell, elem);
  }

  highlight(target, value); // подсветить TD
};

function highlight(node, value) {
  selectedTd = node;

  if( selectedTd.matches('.opened') ) return;
  selectedTd.classList.add('opened');
  if(value == 1) selectedTd.classList.add('one');
  else if(value == 2) selectedTd.classList.add('two');
  else if(value == 3) selectedTd.classList.add('three');
  else if(value == 4) selectedTd.classList.add('four');
  openedCells++;
  if(openedCells === cellsAmount - amountBombs) winner();
}
 
table[0].oncontextmenu = function(event) {
  var target = event.target;

  if (target.tagName != "TD") {
    return; // не на TD? тогда не интересует
  }

  highlightBomb(target);
  return false;
}

function highlightBomb(node) {
  selectedTd = node;
  selectedTd.classList.toggle('marker');
}

function openCells(self, row, cell, element) {  
  	var top = true, bottom = true, left = true, right = true;
  	var table = self.firstElementChild;

	if(row-1 < 0) top = false;
	if(row+1 >= bomb.length) bottom = false;
	if(cell-1 < 0) left = false;
	if(cell+1 >= bomb.length) right = false;

	if(top) clickCell(table.children[row-1].children[cell], area[row-1][cell]);
	if(top && left) clickCell(table.children[row-1].children[cell-1], area[row-1][cell-1]);
	if(top && right) clickCell(table.children[row-1].children[cell+1], area[row-1][cell+1]);
	if(left) clickCell(table.children[row].children[cell-1], area[row][cell-1]);
	if(right) clickCell(table.children[row].children[cell+1], area[row][cell+1]);
	if(bottom) clickCell(table.children[row+1].children[cell], area[row+1][cell]);
	if(bottom && left) clickCell(table.children[row+1].children[cell-1], area[row+1][cell-1]);
	if(bottom && right) clickCell(table.children[row+1].children[cell+1], area[row+1][cell+1]);
}


function clickCell(element, value) {
  if( element.matches('.opened') ) return;
  else if(value == 0) element.click();
  else {
    element.innerHTML = value;
	highlight(element, value);
  }  	
}

/**
 * [gameOver work if bomb is exploded]
 * @return {undefined}
 */
function gameOver() {
  openLostCells();

  var parent = document.body;
  var img = document.createElement('img');
  img.classList.add('gameover');
  parent.appendChild(img);

  table[0].onclick = function () {}
  table[0].oncontextmenu = function () {}
}

function openLostCells() {
  var len = table[0].rows.length;

  for (var i = 0; i < len; i++) {
  	for (var j = 0; j < len; j++) {
      var row = table[0].rows[i];
      if( !row.cells[j].matches('.opened') ) {
      	var value = area[i][j];

      	if(value == 'X') {
      		row.children[j].classList.remove('marker');
      		row.children[j].classList.add('markBomb');
      	}
      	else if(value == 0) row.children[j].classList.add('opened');
      	else {
      	  row.children[j].innerHTML = value;
      	  row.children[j].classList.add('opened');
      	  if(value == 1) row.children[j].classList.add('one');
  		  else if(value == 2) row.children[j].classList.add('two');
  		  else if(value == 3) row.children[j].classList.add('three');
  		  else if(value == 4) row.children[j].classList.add('four');
      	}
      }
    }
  }
}

/**
 * [winner work if you are winner]
 * @return {undefined}
 */
function winner() {
  openLostCells();

  var parent = document.body;
  var img = document.createElement('img');
  img.classList.add('winner');
  parent.appendChild(img);

  table[0].onclick = function () {};
  table[0].oncontextmenu = function () {}
}

/**
 * [getBombAmount calculate number of bombs around cell]
 * @return {number} - amount of bumbs
 */
function getBombAmount(i, j) {
  var counter = 0;
  var top = true, bottom = true, left = true, right = true;			

	if(i-1 < 0) top = false;
	if(i+1 >= bomb.length) bottom = false;
	if(j-1 < 0) left = false;
	if(j+1 >= bomb.length) right = false;

	if(top) {
		if(bomb[i-1][j] == 1) counter++;
	}
	if(top && left) {
		if(bomb[i-1][j-1] == 1) counter++;
	}
	if(top && right) {
		if(bomb[i-1][j+1] == 1) counter++;
	}
	if(left) {
		if(bomb[i][j-1] == 1) counter++;
	}
	if(right) {
		if(bomb[i][j+1] == 1) counter++;
	}
	if(bottom) {
		if(bomb[i+1][j] == 1) counter++;
	}
	if(bottom && left) {
		if(bomb[i+1][j-1] == 1) counter++;
	}
	if(bottom && right) {
		if(bomb[i+1][j+1] == 1) counter++;
	}

	return counter;
}