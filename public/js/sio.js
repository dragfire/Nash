$(function () {
    var socket = io();
    var oldRoom,  defaultRoom = 'general';
    var $rooms = $('#rooms');
    var $username = $('#username');
    var $selectedRoom = $rooms.val();
    var $msgBoard = $('div#content');

    console.log(socket);

    socket.emit('new user', {
        room: '',
        username: $username.text()
    });

    getMsgs(defaultRoom);

    socket.on('user joined', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just joined: '+data.username+'. Welcome</h6>');
    });

    socket.on('user left', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just left: '+data.username+'. Bye Bye!!!</h6>');
    });

    socket.on('setup', function (data) {
        var rooms = data.rooms;
        oldRoom = defaultRoom;
        console.log(rooms);
    });

    $rooms.change(function () {
        $selectedRoom = $rooms.val();
        console.log('username: ',$username.text());
        socket.emit('switch room', {
            oldRoom: oldRoom,
            newRoom: $selectedRoom,
            username: $username.text()
        });
        oldRoom = $selectedRoom;
        $msgBoard.empty();
        getMsgs($selectedRoom);
    });

    socket.on('message created', function (msg) {
        $msgBoard.append("<div id='msg' style='border: 1px solid crimson'> <span class='pink-text accent-4 uname'>"+msg.username+"</span> says: <h6 class='content'>"+msg.content+"</h6> </div>");
    });

    $('.send-btn').click(function () {
        console.log("Send button clicked");
        socket.emit('new message', {
            message: $('.msg-content').val(),
            username: $username.text(),
            room: oldRoom
        });
    });

});

function getMsgs(selectedRoom) {
    var $msgBoard = $('div#content');
    $.ajax({
        url: '/message',
        dataType: 'json',
        data: {room: selectedRoom},
        success: function (data) {
            console.log(data);
            data.forEach(function (msg) {
                $msgBoard.html("<div id='msg' style='border: 1px solid crimson'> <span class='pink-text accent-4 uname'>"+msg.username+"</span> says: <h6 class='content'>"+msg.content+"</h6> </div>");
            });
        },
        error: function (xhr, status, err) {
            console.log(err.toString());
        }
    });
}