//(show 3000 (pm 1) (tm LEFT RIGHT 1 2) ((b) 0 0 0 0)
const regex_show_ball = /^\(show (\d+) \(pm (\d+)\) \(tm ([^ ]+) ([^ ]+) (\d+) (\d+)\) \(\(b\) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*)\)/;
const regex_show_player = /(\(\(([lLrR] \d+)\) (-?\d+\.?\d*) ([x\d]+) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*) (-?\d+\.?\d*))/g;

var rc_frames = []

function parse_rcg_show(msg) {
  let found_show_header = msg.match(regex_show_ball);
  /*
   * 0: "(show 196 (pm 3) (tm LEFT RIGHT 0 0) ((b) -23.1076 -31.562 -0.6334 -0.3723)"
​   * 1: "196"
​   * 2: "3"
​   * 3: "LEFT"
​   * 4: "RIGHT"
​   * 5: "0"
​   * 6: "0"
​   * 7: "-23.1076"
​   * 8: "-31.562"
​   * 9: "-0.6334"
​   * 10: "-0.3723"
   */
  let found_players = [... msg.matchAll(regex_show_player) ];

  //console.log(msg);
  //console.log(found_show_header);

  let frame = {
    show: found_show_header[1],
    playmode: found_show_header[2],
    teams: {
      left: {
        name: found_show_header[3],
        score: found_show_header[5]
      },
      right: {
        name: found_show_header[4],
        score: found_show_header[6]
      }
    },
    ball: {
      x:  found_show_header[7],
      y:  found_show_header[8]
    },
    players:[]
  };
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
    frame.players.push([player[2], player[5], player[6]]);
  });
  //console.log(frame);
  rc_frames.push(frame);
  //console.log(rc_frames.length);
  //console.log(found_players);
}

let websocket;

onmessage = function(e) {
  if (e.data.mode == 'data') {
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
  } else if (e.data.mode == 'init') {
    console.log(e.data);
    websocket = new WebSocket("ws://"+ e.data.host +":5001");
    websocket.addEventListener('message', (e) => {
      const result = e.data.indexOf('(show ');
      if (result === 0) {
        parse_rcg_show(e.data);
      }
    });
  }
};
