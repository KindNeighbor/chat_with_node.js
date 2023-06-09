// express 모듈 불러오기
const express = require('express')

// socket.io 모듈 불러오기
const socket = require('socket.io')

// node.js 기본 내장 모듈 불러오기
const http = require('http')
const fs = require('fs')

// mongoose 모듈 불러오기
const mongoose = require('mongoose');

// express 객체 생성
const app = express()

// express http 서버 생성
const server = http.createServer(app)

// 생성된 서버를 socket.io에 바인딩
const io = socket(server)

// 채팅로그 스키마 생성
const ChatSchema = new mongoose.Schema({
    name: String,
    message: String,
    time: { type: Date, default: Date.now }
});

// 채팅로그 모델 생성
const Chat = mongoose.model('Chat', ChatSchema);

// 접속 시
io.sockets.on('connection', function(socket) {

    // 새로운 유저 접속시 다른 소켓에 알려줌
    socket.on('newUser', function(name) {
        console.log(name + ' 님이 접속했습니다.')

        // 소켓에 이름 저장
        socket.name = name
    
        // 모든 소켓에 전송
        io.sockets.emit('update', 
            {type: 'connect', name: 'SERVER', message: name + '님이 접속했습니다.'})
    })

    // 전송한 메세지 받기
    socket.on('message', function(data) {
        // 받은 데이터에 누가 보냈는지 이름 추가
        data.name = socket.name
        console.log(data)

        // 채팅로그 생성 및 저장
        const chat = new Chat({
            name: data.name,
            message: data.message
        });

        chat.save()
        .then(() => {
            console.log('Chat saved');
        })
        .catch(err => {
            console.log(err);
        });

        // 보낸 사람을 제외한 나머지 유저에게 메세지 전송
        socket.broadcast.emit('update', data)
    })

    // 접속 종료
    socket.on('disconnect', function() {
        console.log(socket.name + '님이 나가셨습니다.')

        // 나가는 사람을 제외한 나머지 유저에게 메세지 전송
        socket.broadcast.emit('update', 
            {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'})
    })
})

// 몽구스 연결
mongoose
  .connect(
    'mongodb+srv://zerosix1017:Vldksh1017@cluster0.ttry0op.mongodb.net/?retryWrites=true&w=majority',
    {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB conected'))
  .catch((err) => {
    console.log(err);
  });


// 서버를 8080 포트로 listen
server.listen(8080, function() {
    console.log('서버 실행 중')
})

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if (err) {
            response.send('error')
        } else {
            response.writeHead(200, {'Content-Type' : 'text/html'})
            response.write(data)
            response.end()
        }
    })
})