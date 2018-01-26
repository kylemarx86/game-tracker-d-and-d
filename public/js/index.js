var socket = io();


socket.on('connect', function() {
    console.log('Connected to server');

    socket.on('redirect', function(destination){
        console.log(destination);
        window.location.href = destination;
    });

});

$('button').click(function(){
    console.log('clicked');
    event.preventDefault();
    socket.emit('sendData', {
        name: $('input[name="name"]').val(),
        game: $('input[name="game"]').val(),
        userType: $('input[name="userType"]:checked').val()
    });
});