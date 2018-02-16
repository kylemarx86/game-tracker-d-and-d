var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
    // console.log('data', data);

    // socket.emit('joinGame', data, function(err) {
    //     if(err){
    //         alert(err);
    //         window.location.href = '/';
    //     } else{
    //         console.log('no error');
    //     }
    // });

    // socket.on('playerConnecting', function() {
    //     console.log('player trying to connect to game. Allow? Y/N');
    // });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('welcome', function (info) {
    var $p = $('<p>').text(`welcome ${info.name} to the game.`);
    $('body').append($p);
});

// socket.on('updateUserList', function(users) {
//     console.log('users list', users);
//     // var $ol = $('<ol>');

//     // users.forEach(function(user) {
//     //     var $li = $('<li>').text(user);
//     //     $ol.append($li);
//     // });
//     // $('#users').html($ol);      // updates / wipes and adds to prevent duplicates
// });

$(document).ready(function () {
    $('.collapsible').collapsible();
    $('.add-to-cart').click(function () {
        addToCart(this);
        // console.log('click')
    });
});

function addToCart($item) {
    console.log('added to cart')
    var $name = $($item).closest('tr').find('td:nth-of-type(1)').text();
    console.log($name)
}