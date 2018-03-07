$(document).ready(function(){
    enableClickHandlers();
});

function enableClickHandlers(){
    $('.tabs__tab').click(function(){
        tabClicked(this);
    });
}

/**
 * controls displaying of content as tabs are switched between
 * @param {object} $elt - jQuery object representing the tab that was clicked
 */
function tabClicked($elt){
    $elt = $($elt);
    // capture index of currently active tab
    var activeIndex = $elt.parent().find('.active').index();
    // check if index is that of currently active tab
    if($elt.index() !== activeIndex){
        // identify panel of tab that was clicked
        var $panel = $elt.parent().parent().parent();
        // make form elements related to currently active tab disabled
        $panel.find('.content:not(.hidden) .panel__input').prop('disabled', true);

        // unload content of currently active tab
        $panel.find('.content:not(.hidden)').addClass('hidden');
        // remove the class active from other tabs in descendents of the parent
        $elt.parent().find('.active').removeClass('active');
        // toggle the class active on this
        $elt.toggleClass('active');
        // load in content associated with respective tab
        $panel.find('.content').eq($elt.index()).toggleClass('hidden');
        // change disabled attr of content associated with respective tab
        $panel.find('.content').eq($elt.index()).find('.panel__input').prop('disabled', false);

    }
}
