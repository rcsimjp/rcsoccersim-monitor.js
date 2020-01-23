var express = require('express');
var app = express();
var http = require('http').Server(app);

const server = require("ws").Server;
const ws_server = new server({ port: 5001 });

const { spawn } = require('child_process');
const dgram = require('dgram');

const PORT = process.env.PORT || 3000;

ws_server.on("connection", ws => {
  ws.on("message", message => {
    console.log("Received: " + message);
  });
  ws.on('close', () => {
    console.log('I lost a client');
  });
});


app.use(express.static('public'));

app.get('/' , (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

const udp_socket = dgram.createSocket('udp4');
const rcss_PORT = 6000; // docker 内のサーバーを利用
const rcss_HOST ='127.0.0.1';
let server_port = null;
// rcssserver 関連
var proc_server = null;
app.get('/start_server', (req, res, next) => {
  proc_server = spawn('./bin/server.sh');     // 実行
  res.send('respond start_server'); //

  proc_server.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  // 3秒後 サッカーサーバーにモニターとして接続
  setTimeout(() => {
    let count = 0;
    // UDP経由でデータ受信したら websocket 経由で流す
    udp_socket.on('message', (message, remote) => {
      if (remote.port != server_port) {
        server_port = remote.port;
      }
      ws_server.clients.forEach(client => {
        client.send(""+message);
      });

      count++;
    });

    // モニター接続
    udp_socket.send(
      Buffer.from('(dispinit version 4)'),
      rcss_PORT, rcss_HOST,
      (err) => {
        console.log('dispinit error: '+err);
      }
    );
  }, 3 * 1000);
});

app.get('/start_teams', (req, res, next) => {
  spawn('./bin/teams.sh');     // 実行

  res.send('teams start');
});

app.get('/kickoff', (req, res, next) => {
  udp_socket.send(
    Buffer.from('(dispstart)'),
    server_port, rcss_HOST,
    (err) => {
      console.log('kickoff error: '+err);
    }
  );
  console.log('kickoff: ' + server_port);
  res.send('respond kickoff'); //
});

app.get('/kill_server', (req, res, next) => {
  proc_server.kill(); // サーバープロセスを kill

  res.send('respond kill_server');
});

// server start
http.listen(PORT, () => {
  console.log('server listening. Port:' + PORT);
});
