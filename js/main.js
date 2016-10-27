(function() {
  // the matrix to remember indexes of opened cells
  var openedCells = [[], []];
  // the matrix to remember the picture number
  // in corresponding cell
  var field = [];
  // to initialize counter
  var counter = makeCounter();
  // run the game
  run();

  function run() {
    getFieldSize();
  }

  function getFieldSize() {
    var url = 'https://kde.link/test/get_field_size.php';

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);

      createField(data.width, data.height);
    }
  }

  function createField(width, height) {
    var table = document.createElement('table');
    var div = document.querySelector('div.wrapper');

    var newRow, newCell;
    for (var i = 0; i < height; i++) {
      newRow = table.insertRow();

      for (var j = 0; j < width; j++) {
        newCell = newRow.insertCell();
        newCell.className = 'closed';
      }
    }

    div.appendChild(table);

    initField(width, height);
    hangEventListenerOn();
  }

  function initField(width, height) {
    for (var i = 0; i < height; i++) {
      field[i] = [];

      for (var j = 0; j < width; j++) {
        field[i].push(0);
      }
    }

    initCells(width, height);
  }

  function initCells(width, height) {
    var LOWEST_PICTURE_NUMBER = 1;
    var BIGGEST_PICTURE_NUMBER = 9;

    var pictureNumber;
    for (var i = 0; i < height; i++)
      for (var j = 0; j < width; j++)
        if( field[i][j] == 0 ) {
          pictureNumber = rand(LOWEST_PICTURE_NUMBER, BIGGEST_PICTURE_NUMBER);
          field[i][j] = pictureNumber;

          initPicDublicate(width, height, i, j, pictureNumber);
        }
  }

  function initPicDublicate(width, height, i, j, pictureNumber) {
    var x = rand(0, height - 1);
    var y = rand(0, width - 1);

    if( x !== i && y !== j && field[x][y] === 0) field[x][y] = pictureNumber;
    else
      for(var k = height - 1; k >= 0; k--)
        for(var m = width - 1; m >= 0; m--)
          if(field[k][m] === 0) {
            field[k][m] = pictureNumber;
            return;
          }
  }

  function hangEventListenerOn() {
    var table = document.querySelector('table');

    table.addEventListener('click', function(event) {
      var target = event.target;

      if(target.tagName == 'TD') {
        openCell(target);
      }
    });
  }

  function openCell(node) {
    if( counter.get() == 2 ) {
      closeCells();
      counter.reset();
    }

    counter();

    var i = node.parentNode.rowIndex,
        j = node.cellIndex;
    var value = field[i][j];

    rememberOpenedCells(i, j);

    if( node.classList.contains('closed') ) {
      node.classList.remove('closed');
      node.style.background = "url('https://kde.link/test/" + value + ".png')";
    } else {
      node.style.background = "";
      node.classList.add('closed');   
    }

    if( counter.get() == 2 ) {

      if( checkDuplicate() ) {      
        getOpenedCell(0, false).style.background = "";
        getOpenedCell(0, false).classList.add('hidden');

        getOpenedCell(1, false).style.background = "";
        getOpenedCell(1, false).classList.add('hidden');      
      
        closeCells();
        counter.reset();
      }
    }

    if( checkEndGame() ) winnerMenu();
  }

  function closeCells() {
    var firstOpenedCell = getOpenedCell(0, true), 
        secondOpenedCell = getOpenedCell(1, true);

    firstOpenedCell.style.background = "";
    firstOpenedCell.classList.add('closed');

    secondOpenedCell.style.background = "";
    secondOpenedCell.classList.add('closed');
  }

  function rememberOpenedCells(i, j) {
    openedCells[ counter.get() - 1 ].push(i, j);
  }

  function checkDuplicate() {
    if(getOpenedCell(0, false) === getOpenedCell(1, false)) return;

    var firstPictureNumber = getOpenedCell(0, false).style.background;
    var secondPictureNumber = getOpenedCell(1, false).style.background;

    return firstPictureNumber === secondPictureNumber;
  }

  function getOpenedCell(index, popOn) {
    var cell, table = document.querySelector('table');
    var i, j;

    if(popOn) {
      j = openedCells[index].pop();
      i = openedCells[index].pop();
    } else {
      j = openedCells[index][1];
      i = openedCells[index][0];
    }

    cell = table.rows[i].cells[j];

    return cell;
  }

  function checkEndGame() {
    var rows = document.querySelector('table').rows;

    for(var i = 0; i < rows.length; i++)
      for(var j = 0; j < rows[i].children.length; j++)
        if( !rows[i].children[j].classList.contains('hidden') ) return false;

    return true;
  }

  function winnerMenu() {
    var wrapper = document.querySelector('div.wrapper');
    var div = document.createElement('div');
    div.className = 'winner_menu'

    div.innerHTML = '<p class="winner_title">you win</p></br><div class="winner_button_wrapper">' + 
                    '<button class="winner_new_game_button">Play now</button></div>';

    wrapper.appendChild(div);

    newGame();
  }

  function newGame() {
    var button = document.querySelector('button.winner_new_game_button');

    button.addEventListener('click', function() {
      var parent = document.querySelector('div.wrapper');
      var childTable = document.querySelector('table');
      var childMenu = document.querySelector('div.winner_menu');

      parent.removeChild(childTable);
      parent.removeChild(childMenu);

      run();
    });
  }

  function makeCounter() {
    var currentCount = 0;

    function counter() {
      return currentCount++;
    }

    counter.reset = function() {
      currentCount = 0;
    }

    counter.get = function() {
      return currentCount;
    }

    return counter;
  }

  // get random number in definite rang
  function rand(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }
})();