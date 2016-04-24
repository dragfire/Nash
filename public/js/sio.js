$(function () {

    var socket = io();
    var oldRoom, defaultRoom = 'general';
    var $rooms = $('#rooms');
    var $username = $('#username');
    var $selectedRoom;
    var $msgBoard = $('div#content');
    var $msgContent = $('.msg-content');
    var $nowTyping = $('#typing');
    var mb = document.querySelector('.msg-board');
    var $invite = $('#invite').val();
    var $privacy = $('#privacy').val();
    var $room = $('#room').val().trim();

    $nowTyping.hide();
    console.log(socket);

    if (!$privacy && !$invite) {
        $selectedRoom = $rooms.val();
    } else if ($privacy && $invite) {
        $selectedRoom = $room;
    }

    socket.emit('new user', {
        room: $selectedRoom,
        username: $username.text()
    });

    oldRoom = $selectedRoom;
    console.log($selectedRoom);

    getMsgs($selectedRoom);

    socket.on('user joined', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just joined: <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.username + '</span>. Welcome</h6>');
        mb.scrollTop = mb.scrollHeight;
    });

    socket.on('user left', function (data) {
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text">Just left: <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.username + '</span>. Bye Bye!!!</h6>');
        mb.scrollTop = mb.scrollHeight;
    });

    socket.on('setup', function (data) {
        var rooms = data.rooms;
        oldRoom = $selectedRoom;
        //console.log(rooms);
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
        console.log('message created', msg);
        if(msg.username === $username.text())
            $msgBoard.append("<div id='msg' class='card-panel'> <span class='teal-text accent-3 uname' style='font-weight: bold'>You [<span class='pink-text accent-4 uname' style='font-weight: bold'>" + msg.username + "</span>]</span> says: <h6 class='text' style='margin-left: 20px!important;'>" + msg.content + "</h6> </div>");
        else $msgBoard.append("<div id='msg' class='card-panel'> <span class='pink-text accent-4 uname' style='font-weight: bold'>" + msg.username + "</span> says: <h6 class='text' style='margin-left: 20px!important;'>" + msg.content + "</h6> </div>");

        mb.scrollTop = mb.scrollHeight;
    });

    $('.send-btn').click(function () {
        //console.log("Send button clicked");

        console.log('send to', $room);
        socket.emit('new message', {
            message: $msgContent.val(),
            username: $username.text(),
            room: $selectedRoom
        });
        $msgContent.val('');
    });

    $msgContent.keydown(function () {
        //console.log('user typing');
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
        //console.log(data.username, $username.text(), data.username!=$username.text());

        if ($username.text() != data.username) {
            //console.log('Updating typing...');
            $nowTyping.show();

            $nowTyping.find('span').css({color: 'blue'});
            $nowTyping.find('span').text(data.username);
        }
    });

    socket.on('no typing', function (data) {
        //console.log('no typing');
        $nowTyping.hide();
    });

    $('.ch-uname-btn').click(function () {
        var oldUsername = $username.text();
        var newUsername = $('.ch-uname').val();
        // console.log(oldUsername, newUsername);
        socket.emit('change username', {
            oldUsername: oldUsername,
            username: newUsername,
            room: oldRoom
        });
    });

    socket.on('username changed', function (data) {
        // console.log('username changed', data);
        $msgBoard.append('<h6 class="center-align black-text darken-4 shades-text"> <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.oldUsername + '</span> changed Username to: <span class="light-green-text accent-4 big" style="font-weight: bold">' + data.username + '</span> </h6>');
        if ($username.text() == data.oldUsername)
            $username.text(data.username);
        mb.scrollTop = mb.scrollHeight;
    });
});

function getMsgs(selectedRoom) {
    var $msgBoard = $('div#content');
    var mb = document.querySelector('.msg-board');

    $.ajax({
        url: '/message',
        dataType: 'json',
        data: {room: selectedRoom},
        success: function (data) {
            //console.log(data);
            data.forEach(function (msg) {
                $msgBoard.append("<div id='msg' class='card-panel'> <span class='pink-text accent-4 uname' style='font-weight: bold'>" + msg.username + "</span> says: <h6 class='text' style='margin-left: 20px!important;'>" + msg.content + "</h6> </div>");
            });
        },
        error: function (xhr, status, err) {
            console.log(err.toString());
        }
    });
    mb.scrollTop = mb.scrollHeight;
}