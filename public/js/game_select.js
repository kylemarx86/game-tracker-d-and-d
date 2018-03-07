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


$(document).ready(function(){
    enableClickHandlers();
    $('select').material_select();
});

function enableClickHandlers(){
    // $('.tabs__tab').click(function(){
    //     tabClicked(this);
    // });
}

// /**
//  * controls displaying of content as tabs are switched between
//  * @param {object} $elt - jQuery object representing the tab that was clicked
//  */
// function tabClicked($elt){
//     $elt = $($elt);
//     // capture index of currently active tab
//     var activeIndex = $elt.parent().find('.active').index();
//     // check if index is that of currently active tab
//     if($elt.index() !== activeIndex){
//         // identify panel of tab that was clicked
//         var $panel = $elt.parent().parent().parent();
//         // make form elements related to currently active tab disabled
//         $panel.find('.content:not(.hidden) .panel__input').prop('disabled', true);

//         // unload content of currently active tab
//         $panel.find('.content:not(.hidden)').addClass('hidden');
//         // remove the class active from other tabs in descendents of the parent
//         $elt.parent().find('.active').removeClass('active');
//         // toggle the class active on this
//         $elt.toggleClass('active');
//         // load in content associated with respective tab
//         $panel.find('.content').eq($elt.index()).toggleClass('hidden');
//         // change disabled attr of content associated with respective tab
//         $panel.find('.content').eq($elt.index()).find('.panel__input').prop('disabled', false);

//     }
// }


// won't work in new setup
socket.on('updateGamesList', function(games) {
    var gamesList = JSON.parse(games).games;
    // gamesList = gamesList.games;

    updateGamesList(gamesList);

    if(gamesList.length < 1 ){
        // remove click handler if no games are present
        $first_tab = $('.tabs__tab:nth-of-type(1)');
        $first_tab.off('click');
        $first_tab.addClass('disabled');
        // switch over to other tab if it is not active
        if($first_tab.hasClass('active')){
            var $second_tab = $('.tabs__tab:nth-of-type(2)');
            tabClicked($second_tab);
        }
    } else {
        // re-enable click handler if there are games present and the tab is currently disabled
        $('.tabs__tab.disabled').click(function(){
            tabClicked(this);
        });
        $('.tabs__tab.disabled').removeClass('disabled');
        // enable select input if it is in the active class
        $('.content:not(.hidden) select').prop('disabled', false);
    }
});


// may not work in new setup
/**
 * fills in the DOM element with names of games that are currently active
 * @param {array} games - array of objects that contain names of active games and number of users in them
 */
function updateGamesList(games){
    var $roomSelector = $('select[name=game]');
    $roomSelector.empty();
    var $option = $('<option>').attr('value', '').text('Select an active game');
    $roomSelector.append($option);
    for(var i = 0; i < games.length; i++){
        var $option = $('<option>')
            .attr('value', games[i].name)
            .text(`${games[i].name} - ${games[i].userCount} user${games[i].userCount > 1 ? 's' : ''}`);
        $roomSelector.append($option);
    }
}