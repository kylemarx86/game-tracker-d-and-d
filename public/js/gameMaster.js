var socket = io();

socket.on('connect', function() {
    console.log('Connected to server as GM');

    $p = $('<p>').text('connected to server as GM');
    $('body').append($p);
    socket.emit('join', function() {

    });
});

socket.on('addUserToGame', function(userName){
    $p = $('<p>').text(`Hey GM. New user ${userName} entered`);
    $('body').append($p);
});