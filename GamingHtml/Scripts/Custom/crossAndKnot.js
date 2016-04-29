var h1 = document.getElementsByTagName('h1')[0],
seconds = 0, minutes = 0, hours = 0,
    t;
function add() {
   
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}





function DisplayName () {
    var displayname=prompt('Enter your name:', '');
    if (displayname) {
       
        return displayname;
    } else {
        alert("Invalid Input");
        return DisplayName();

    }
};




$(function () {
    var totalUserCount = 0;
    var turn = 0;
    var cplayer;
    
    function stopwatch() {

        h1.textContent = "00:00:00";
        seconds = 0; minutes = 0; hours = 0;
    
        if (cplayer == turn) {
            timer();
        }
    }


    // Reference the auto-generated proxy for the hub.  
    var chat = $.connection.gameHub;
    chat.client.addNewMessageToPage = function (name, message) {
        // Add the message to the page. 
        $('#discussion').append('<li><strong>' + htmlEncode(name)
            + '</strong>: ' + htmlEncode(message) + '</li>');
    };

    // Get the user name and store it to prepend to messages.
    var displayname = DisplayName();
    if (displayname) {

        $.connection.hub.qs = { 'username': displayname };

        $.connection.hub.start();
    }

    chat.client.updateUsersOnlineCount = function (count) {
        totalUserCount = parseInt(count);
       
        if (totalUserCount > 1) {
            StartNewGame();
            stopwatch();
        }
        else {
            document.getElementById("container").innerHTML = "Waiting for other user to join.";
        }
    };

    chat.client.setCurrentPlayer = function (current) {
        cplayer = current;
        
    };
    chat.client.setPlayerMove = function (indicator,cmove) {
        var element = document.querySelector('[data-indicator="' + indicator + '"]');

        var node = document.createElement("div");
        node.className = cmove == 1 ? "circle" : "cross";
        element.appendChild(node);
        element.removeEventListener("click", SetCurrentPlayerMove);

        score[turn] += indicator;
        moves++;
        if (CheckWin(score[turn])) {
            alert("player " + cmove + " Wins");
            StartNewGame();

        }
        else if (moves == 9) {
            alert("Draw!");
            StartNewGame();
        }
        else {
            turn = cmove == 1 ? 0 : 1;
            stopwatch();
        }
      
    };



    var 
      wins = [7, 56, 448, 73, 146, 292, 273, 84],
      score,
      moves,
      CheckWin = function (cscore) {
          var i;
          for (i = 0; i < wins.length; i += 1) {
              if ((wins[i] & cscore) === wins[i]) {
                  return true;
              }
          }
          return false;

      },
      SetCurrentPlayerMove = function (event) {
          if (totalUserCount < 2) {
              alert("waiting for other user to join.");
              return;
          }

          if (cplayer != turn) {

              alert("Not your chance.");
              return;
          }

          var element = event.currentTarget;

          if (element.childElementCount > 0) {
              alert("Wrong Move");
              return;
          }


          chat.server.sendMove(element.getAttribute('data-indicator'));
          clearTimeout(t);
          return;
      },
      StartNewGame = function () {
          stopwatch();
          var number = 3;
          moves = 0;
        //  cplayer = 0;
          score = [0, 0];

          var container = document.getElementById("container");
          container.innerHTML = '';

          var width = container.offsetWidth;
          var height = container.offsetHeight;

          var swidth = parseFloat(100 / number);
          var sheight = parseFloat(100 / number);

          for (var i = 0; i < Math.pow(number, 2) ; i++) {
              var node = document.createElement("div");
              node.style.width = swidth + "%";
              node.style.height = sheight + "%";
              node.className = "smallSquareBox";
              node.setAttribute('data-indicator', Math.pow(2, i));

              node.addEventListener("click", SetCurrentPlayerMove, false);
              container.appendChild(node);

          }
      };

    
});