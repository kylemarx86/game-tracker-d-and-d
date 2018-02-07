var socket = io();

socket.on('connect', function() {
    console.log('Connected to server as player');
    // var params = $.deparam(window.location.search);
    // socket.emit('join', params, function(err) {
    //     if(err){
    //         alert(err);
    //         window.location.href = '/';
    //     } else{
    //         console.log('no error');
    //     }
    // });
    $p = $('<p>').text('connected to server as player');
    $('body').append($p);
});


socket.on('addUserToGame', function(userName){
    $p = $('<p>').text(`New user ${userName} entered`);
    $('body').append($p);
    
    console.log('add user triggered');
});