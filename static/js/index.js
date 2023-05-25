var socket = io()

// 접속 시 실행
socket.on('connect', function() {
    // 이름 입력 받은 후
    var name = prompt('반갑습니다!', '')

    // 이름이 빈칸인 경우
    if (!name) name = '익명'

    // 서버에 새로운 유저가 왔다고 알림
    socket.emit('newUser', name)
})

socket.on('update', function(data) {
    var chat = document.getElementById('chat')
    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''

    // 타입에 따라 적용하는 클래스 다르게 지정
    switch(data.type) {
        case 'message':
            className = 'other'
            break
        
        case 'connect':
            className = 'connect'
            break
        
        case 'disconnect':
            className = 'disconnect'
            break
    }

    message.classList.add(className)
    message.appendChild(node)
    chat.appendChild(message)
})

// 전송 function
function send() {
    // 입력되어있는 데이터 가져오기
    var message = document.getElementById('test').value

    // 가져온 후에는 test를 빈칸으로 바꿈
    document.getElementById('test').value = ''

    // 내가 전송할 메세지 표시
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)

    // 서버로 메세지 send
    socket.emit('message', {type: 'message', message: message})
}