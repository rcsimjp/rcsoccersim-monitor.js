document.querySelector('#start_server')
        .addEventListener('click', () => {
          fetch('/start_server');
          console.log('start_server');
        });

document.querySelector('#start_teams')
        .addEventListener('click', () => {
          fetch('/start_teams');
          console.log('start_teams');
        });

document.querySelector('#kickoff')
        .addEventListener('click', () => {
          fetch('/kickoff');
          console.log('kickoff');
        });

document.querySelector('#kill_server')
        .addEventListener('click', () => {
          fetch('/kill_server');
          console.log('kill_server');
        });

const regex_show_player = /(\(\(([lLrR] \d+)\) (-?\d+\.?\d*) ([x\d]+) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*))/g;

var rc_frames = []

function parse_rcg_show(msg) {
  let found_players = [... msg.matchAll(regex_show_player) ];

  let frame = []
  found_players.forEach((player) => {
    /*
      0: "((l 2) 8 0x1 -25 -5 0 0 -55.298 0"
​​​      1: "((l 2) 8 0x1 -25 -5 0 0 -55.298 0"
​​​      2: "l 2"
​​​      3: "8"
​​​      4: "0x1"
​​​      5: "-25"
​​​      6: "-5"
​​​      7: "0"
​​​      8: "0"
​​​      9: "-55.298"
​​​      10: "0"
     */
    //console.log(player);
    frame.push([player[2], player[5], player[6]]);
  });
  //console.log(frame);
  rc_frames.push(frame);
  //console.log(rc_frames.length);
  //console.log(found_players);
}

const div_index = document.querySelector('div#index');
const players = {
  'l 1': document.querySelector('#l_1'),
  'l 2': document.querySelector('#l_2'),
  'l 3': document.querySelector('#l_3'),
  'l 4': document.querySelector('#l_4'),
  'l 5': document.querySelector('#l_5'),
  'l 6': document.querySelector('#l_6'),
  'l 7': document.querySelector('#l_7'),
  'l 8': document.querySelector('#l_8'),
  'l 9': document.querySelector('#l_9'),
  'l 10': document.querySelector('#l_10'),
  'l 11': document.querySelector('#l_11'),
  'r 1': document.querySelector('#r_1'),
  'r 2': document.querySelector('#r_2'),
  'r 3': document.querySelector('#r_3'),
  'r 4': document.querySelector('#r_4'),
  'r 5': document.querySelector('#r_5'),
  'r 6': document.querySelector('#r_6'),
  'r 7': document.querySelector('#r_7'),
  'r 8': document.querySelector('#r_8'),
  'r 9': document.querySelector('#r_9'),
  'r 10': document.querySelector('#r_10'),
  'r 11': document.querySelector('#r_11'),
};

const websocket = new WebSocket("ws://0.0.0.0:5001");
websocket.addEventListener('message', (e) => {
  const result = e.data.indexOf('(show ');
  if (result === 0) {
    parse_rcg_show(e.data);
  }
});

var drawed_index = -1;
function draw(i) {
  if (i < 0) {
    return;
  } else if (i == drawed_index) {
    return;
  } else {
    let frame = rc_frames[i];
    div_index.innerHTML = i;
    frame.forEach((player) => {
      players[player[0]].setAttribute('cx', player[1]);
      players[player[0]].setAttribute('cy', player[2]);
    });
    drawed_index = i;
  }
}

// アニメーション(ループ)開始
requestAnimationFrame(function (t0) {
  render(t0);

  function render(t1) {
    draw(rc_frames.length - 1); // 最後のフレームを表示
    requestAnimationFrame(render);
  }
});
