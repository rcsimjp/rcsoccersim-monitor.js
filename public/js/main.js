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

const div_index = document.querySelector('div#index');

const show = document.querySelector('#show');
const playmode = document.querySelector('#playmode');
const team_left = document.querySelector('#team_left');
const team_right = document.querySelector('#team_right');
const score_left = document.querySelector('#score_left');
const score_right = document.querySelector('#score_right');
const ball = document.querySelector('#ball');
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

const playmodes = [
  "",
  "before_kick_off",
  "time_over",
  "play_on",
  "kick_off_l",
  "kick_off_r",
  "kick_in_l",
  "kick_in_r",
  "free_kick_l",
  "free_kick_r",
  "corner_kick_l",
  "corner_kick_r",
  "goal_kick_l",
  "goal_kick_r",
  "goal_l",
  "goal_r",
  "drop_ball",
  "offside_l",
  "offside_r",
  "penalty_kick_l",
  "penalty_kick_r",
  "first_half_over",
  "pause",
  "human_judge",
  "foul_charge_l",
  "foul_charge_r",
  "foul_push_l",
  "foul_push_r",
  "foul_multiple_attack_l",
  "foul_multiple_attack_r",
  "foul_ballout_l",
  "foul_ballout_r",
  "back_pass_l",
  "back_pass_r",
  "free_kick_fault_l",
  "free_kick_fault_r",
  "catch_fault_l",
  "catch_fault_r",
  "indirect_free_kick_l",
  "indirect_free_kick_r",
  "penalty_setup_l",
  "penalty_setup_r",
  "penalty_ready_l",
  "penalty_ready_r",
  "penalty_taken_l",
  "penalty_taken_r",
  "penalty_miss_l",
  "penalty_miss_r",
  "penalty_score_l",
  "penalty_score_r"
];

var worker = new Worker("/js/worker-moniter_client.js");

worker.onmessage = function(e) {
  //console.log(e.data);
  draw(e.data.index, e.data.frame);
};

var drawed_index = -1;
function draw(i, f) {
  if (i < 0) {
    return;
  } else if (i == drawed_index) {
    return;
  } else {
    let frame = f;
    div_index.innerHTML = i;

    show.innerHTML = frame.show;
    playmode.innerHTML = playmodes[frame.playmode];

    team_left.innerHTML = frame.teams.left.name;
    team_right.innerHTML = frame.teams.right.name;
    score_left.innerHTML = frame.teams.left.score;
    score_right.innerHTML = frame.teams.right.score;

    ball.setAttribute('cx', frame.ball.x);
    ball.setAttribute('cy', frame.ball.y);
    frame.players.forEach((player) => {
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
    // draw(rc_frames.length - 1); // 最後のフレームを表示
    worker.postMessage({index: -1}); // 最新フレームを要求
    requestAnimationFrame(render);
  }
});
