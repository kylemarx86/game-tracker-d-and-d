var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('joinLobby', function(err) {
        console.log('Joined lobby');
        if(err){
            alert(err);
            window.location.href = '/';
        } else{
            console.log('no error');
        }
    });
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
    
});


socket.on('createGame', function(role) {
    // render 
    var $p = $('<p>').text(`welcome user. you are a ${role}.`);
    $('body').append($p);
});

socket.on('joinGame', function(role) {
    var $p = $('<p>').text(`welcome user. you are a ${role}.`);
    $('body').append($p);
});

socket.on('welcome', function(info) {
    var $p = $('<p>').text(`welcome ${info.name} to the game. They are a ${info.role}.`);
    $('body').append($p);
});

socket.on('updateUserList', function(users) {
    console.log('users list', users);
    // var $ol = $('<ol>');

    // users.forEach(function(user) {
    //     var $li = $('<li>').text(user);
    //     $ol.append($li);
    // });
    // $('#users').html($ol);      // updates / wipes and adds to prevent duplicates
})




$('button').click(function() {
    event.preventDefault();
    var params = {
        name: $('input[name="name"]').val(),
        game: $('input[name="game"]').val(),
        role: $('input[name="role"]:checked').val()
    };

    socket.emit('joinGame', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        } else{
            console.log('no error');
            
        }
    });
});