var socket = io()

// 접속 시 실행
socket.on('connect', function() {
    var input = document.getElementById('test')
    input.value = '접속 되었습니다.'
})

// 전송 function
function send() {
    // 입력되어있는 데이터 가져오기
    var message = document.getElementById('test').value

    // 가져온 후에는 test를 빈칸으로 바꿈
    document.getElementById('test').value = ''

    // 서버로 메세지 send
    socket.emit('send', {msg: message})
}