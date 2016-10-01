// get random number in definite rang
function rand (min, max) {
  return (Math.random() * (max - min)) + min;
}

/**
 * [initiateField - form bomb area, calculate amount of cells and bombs]
 * @return {[type]} [description]
 */
function initiateField(row, cell, complexity) {
	var area = [];

	for(var i = 0; i < row; i++) {
		area.push([]);
		bomb.push([]);

		for(var j = 0; j < cell; j++) {
			cellsAmount++;

			if(rand(0, 10) > complexity) {
				amountBombs++;
				bomb[i].push('1');
			} else {
				bomb[i].push('0');
			}
		}		
	}

	for(i = 0; i < row; i++) {

		for(j = 0; j < cell; j++) {
			if(bomb[i][j] == 1) {
				area[i].push('X');
			} else {
				area[i].push( getBombAmount(i, j) );
			}
		}		
	}

	return area;
}

var bomb = [];
var openedCells = 0;
var amountBombs = 0;
var cellsAmount = 0;

var area, selectedTd;
var table = document.createElement('table');
table.classList.add('area');

// run sapper
function start() {
  var inputs = document.getElementsByTagName("input");

  var row = inputs[1].value;
  var cell = inputs[0].value;
  var complexity = inputs[2].checked ? 8.5 : 7.8;

  console.log('row :: ' + row + ', cell :: ' + cell + ', compl :: ' + complexity);

  var body = document.body;
  var menu = document.querySelector('.menu')
  console.log(menu);

  body.removeChild(menu);

  createField(row, cell);
  area = initiateField(row, cell, complexity);

  console.log(amountBombs + ' ' + cellsAmount);

  // table[0].addEventListener('click', clickListenerForCell(event));
  // table[0].addEventListener('contextmenu', markListener(event));
  console.dir(table);
}

// create bomb area for sapper
function createField(row, cell) {

  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var body = document.body;

  var span = document.createElement('span');
  span.classList.add('nameGame');
  span.innerHTML = '<em>Game: </em> Sapper';

  body.appendChild(span);  

  var newRow;
  for (var i = 0; i < row; i++) {
    newRow = table.insertRow();

    for (var j = 0; j < cell; j++) {
      newRow.insertCell();
    }
  }

  body.appendChild(table);  
}

// listener for cells
table.onclick = function(event) {
  var self = this;
  var target = event.target; // где был клик?
  if(target.matches('.opened') || target.matches('.marker')) {
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

/**
 * [highlight provide highlight of cells after clicking]
 * @param  {object} node  - element to highlight
 * @param  {string} value - amount of bombs around the cell
 * @return {undefined}
 */
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

// listener for flag (right click)
table.addEventListener('contextmenu', function(event) {
  var target = event.target;

  if (target.tagName != "TD") {
    return; // не на TD? тогда не интересует
  }

  highlightBomb(target);
  event.preventDefault();
});

// mark cell after right click
function highlightBomb(node) {
  selectedTd = node;
  selectedTd.classList.toggle('marker');
}

/**
 * [openCells - open cells by recursion]
 * @param  {object} self    - order not to lose the current object
 * @param  {number} row     - coord Y
 * @param  {number} cell    - coord X
 * @param  {object} element - current clicked element
 * @return {undefined}
 */
function openCells(self, row, cell, element) {  
  	var top = true, bottom = true, left = true, right = true;
  	var table = self.firstElementChild;

	if(row-1 < 0) top = false;
	if(row+1 >= bomb.length) bottom = false;
	if(cell-1 < 0) left = false;
	if(cell+1 >= bomb[0].length) right = false;

	if(top) clickCell(table.children[row-1].children[cell], area[row-1][cell]);
	if(top && left) clickCell(table.children[row-1].children[cell-1], area[row-1][cell-1]);
	if(top && right) clickCell(table.children[row-1].children[cell+1], area[row-1][cell+1]);
	if(left) clickCell(table.children[row].children[cell-1], area[row][cell-1]);
	if(right) clickCell(table.children[row].children[cell+1], area[row][cell+1]);
	if(bottom) clickCell(table.children[row+1].children[cell], area[row+1][cell]);
	if(bottom && left) clickCell(table.children[row+1].children[cell-1], area[row+1][cell-1]);
	if(bottom && right) clickCell(table.children[row+1].children[cell+1], area[row+1][cell+1]);
}

/**
 * [clickCell description]
 * @param  {[type]} element [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
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

  table.onclick = function () {}
  table.removeEventListener('contextmenu', function () {});
}

/**
 * [openLostCells after end of the game to open closed cells]
 * @return {undefined}
 */
function openLostCells() {
  var lenR = table.rows.length;
  var lenC = table.rows[0].cells.length;

  for (var i = 0; i < lenR; i++) {
  	for (var j = 0; j < lenC; j++) {
      var row = table.rows[i];
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

  table.onclick = function () {};
  table.removeEventListener('contextmenu', function () {});
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
	if(j+1 >= bomb[0].length) right = false;

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