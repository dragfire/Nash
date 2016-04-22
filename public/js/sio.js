$(function () {
    var socket = io();
    var oldRoom, defaultRoom = 'general';
    var $rooms = $('#rooms');
    var $username = $('#username');
    var $selectedRoom = $rooms.val();
    var $msgBoard = $('div#content');
    var $msgContent = $('.msg-content');
    var $nowTyping = $('#typing');

    console.log(socket);

    socket.emit('new user', {
        room: '',
        username: $username.text()
    });

    getMsgs(defaultRoom);

    socket.on('user joined', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just joined: <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.username + '</span>. Welcome</h6>');
    });

    socket.on('user left', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just left: <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.username + '</span>. Bye Bye!!!</h6>');
    });

    socket.on('setup', function (data) {
        var rooms = data.rooms;
        oldRoom = defaultRoom;
        console.log(rooms);
    });

    $rooms.change(function () {
        $selectedRoom = $rooms.val();
        console.log('username: ', $username.text());
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
        $msgBoard.append("<div id='msg' class='card-panel'> <span class='pink-text accent-4 uname' style='font-weight: bold'>" + msg.username + "</span> says: <h6 class='text' style='margin-left: 20px!important;'>" + msg.content + "</h6> </div>");
    });

    $('.send-btn').click(function () {
        console.log("Send button clicked");
        socket.emit('new message', {
            message: $('.msg-content').val(),
            username: $username.text(),
            room: oldRoom
        });
    });

    $msgContent.keydown(function () {
        console.log('user typing');
        socket.emit('user typing', {
            username: $username.text(),
            room: $selectedRoom
        });
    });

    $msgContent.blur(function () {
        console.log('stopped typing');
        socket.emit('stopped typing', {
            username: $username.text(),
            room: $selectedRoom
        });
    });

    socket.on('typing', function (data) {
        console.log(data.username, $username.text(), data.username!=$username.text());

        if($username.text() != data.username){
            console.log('Updating typing...');
            $nowTyping.show();

            $nowTyping.find('span').css({color: 'blue'});
            $nowTyping.find('span').text(data.username);
        }
    });

    socket.on('no typing', function (data) {
        console.log('no typing');
        $nowTyping.hide();
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
                $msgBoard.html("<div id='msg' class='card-panel'> <span class='pink-text accent-4 uname' style='font-weight: bold'>" + msg.username + "</span> says: <h6 class='text' style='margin-left: 20px!important;'>" + msg.content + "</h6> </div>");
            });
        },
        error: function (xhr, status, err) {
            console.log(err.toString());
        }
    });
}