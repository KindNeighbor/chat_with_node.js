// express 모듈 불러오기
const express = require('express')

// socket.io 모듈 불러오기
const socket = require('socket.io')

// node.js 기본 내장 모듈 불러오기
const http = require('http')
const fs = require('fs')

// express 객체 생성
const app = express()

// express http 서버 생성
const server = http.createServer(app)

// 생성된 서버를 socket.io에 바인딩
const io = socket(server)

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