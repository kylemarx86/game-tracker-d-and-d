var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

    socket.on('redirect', function(destination) {
        console.log(destination);

        // console.log('socket', )
        // console.log('all rooms', io.sockets.adapter.rooms);
        window.location.href = destination;
        // need to pass info with that
    });

});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

$('button').click(function() {
    console.log('clicked');
    event.preventDefault();
    var params = {
        name: $('input[name="name"]').val(),
        game: $('input[name="game"]').val(),
        role: $('input[name="role"]:checked').val()
    };

    socket.emit('submitForm', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        } else{
            console.log('no error');
            
        }
    });
});