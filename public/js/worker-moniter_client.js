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

const websocket = new WebSocket("ws://0.0.0.0:5001");
websocket.addEventListener('message', (e) => {
  const result = e.data.indexOf('(show ');
  if (result === 0) {
    parse_rcg_show(e.data);
  }
});

onmessage = function(e) {
  let i = e.data.index;

  if (i < 0) { // マイナスのインデックスは、末尾から
    i = rc_frames.length + i;
  } else if (i >= rc_frames.length) { // 要素数より大きい場合は最後の要素を
    i = rc_frames.length - 1;
  }
  postMessage({
    index: i,
    frame: rc_frames[i]
  });
};
