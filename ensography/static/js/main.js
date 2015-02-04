var timeoutTooltips;
function hide_tooltips() {
    $('.icon .icon-text').filter('.icon-always-visible-label').css({ opacity: 0 })
}
function show_tooltips() {
    $('.icon .icon-text').css({ opacity: 1 })
    clearTimeout(timeoutTooltips)
    timeoutTooltips = setTimeout(hide_tooltips, 2500);
}

// Tiny preloader plugin
$.fn.preload = function(callback) {      
    var i=0, that = this;
    var increment = function() { if (++i >= that.length) return callback(that); }
    for (var j=0; j<that.length; j++)
        $('<img/>').load(increment)[0].src = that[j];
};

// Django CSRF support
$.ajaxSetup({ beforeSend: function(xhr, settings) {
    if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && !this.crossDomain)
        xhr.setRequestHeader("X-CSRFToken", jQuery.cookie('csrftoken'));
}});

$(function(){

    $('.auto-comments').each(function(){
        new window.Comments(this, $(this).data('tag'), this.title)
    })
    

    // GENERIC CHROME SCRIPTS -----------------------------------------------
    // GENERIC CHROME SCRIPTS -----------------------------------------------
    // GENERIC CHROME SCRIPTS -----------------------------------------------
    // GENERIC CHROME SCRIPTS -----------------------------------------------
    $('.autosizejs').autosize();
    $('.control-expandable .control-center .icon, .control-expandable .control-right .icon')
        .click(function(){
            if ($(this).data('skip-click')) {
                $(this).data('skip-click', false);
                return;
            }
            show_tooltips();
            var $ctrl = $(this).parents('.control-expandable');
            var isExpanded = $ctrl.hasClass('control-expanded');
            $ctrl.toggleClass('control-expanded');
            if (isExpanded) $ctrl.find('.control-expansion').slideUp();
            else            $ctrl.find('.control-expansion').slideDown();
        })
        .mouseover(show_tooltips)
        .mousemove(show_tooltips)
    $('.author .icon')
        .mouseover(show_tooltips)
        .mousemove(show_tooltips)

    $('.author .userpic')
        .click(function(){
            show_tooltips();
            var $ctrl = $(this).parents('.author');
            var isExpanded = $ctrl.hasClass('author-expanded');
            $ctrl.toggleClass('author-expanded');
        })

    show_tooltips();
    $('body').scroll(function(){ show_tooltips() });

    // ILLUSTRATION SCRIPTS ---------------------------------------------------
    // ILLUSTRATION SCRIPTS ---------------------------------------------------
    // ILLUSTRATION SCRIPTS ---------------------------------------------------
    // ILLUSTRATION SCRIPTS ---------------------------------------------------
    $('.photo-block .photo').click(function(){
        if ($(this).hasClass('photo-no-move')) return;
        $(this).appendTo($(this).parent())
        var $this = $(this);
        setTimeout(function(){
            var count = 0;
            if (!$this.hasClass('photo-flipped'))
                $this.addClass('photo-flipped');
            else
                $this.parent().find('.photo-flipped').each(function(){
                    var $that = $(this);
                    setTimeout(function(){ $that.removeClass('photo-flipped') }, 20*count++)
                })
        }, 1)
        
    })

    // COMMENTS SCRIPTS -------------------------------------------------------
    // COMMENTS SCRIPTS -------------------------------------------------------
    // COMMENTS SCRIPTS -------------------------------------------------------
    // COMMENTS SCRIPTS -------------------------------------------------------
    $('.comments-host-right').on('click', '.comments-sheet', function(){
        $this = $(this);
        $comments = $this.parents('.comments');
        $(this).css({
            'margin-left': -704,
        }).removeClass('comments-pile-1 comments-pile-2 comments-pile-3');
        $comments.find('.comments-host-middle .comments-sheet')
            .css({
                'margin-left': -704, 
                'opacity': 0.5,
            })
            .find('.comments-comments').hide()
        $comments.find('.comments-host-middle .comments-reply-sheet').hide()
        $comments.find('.comments-host-middle .comments-controls').hide()
        setTimeout(function(){
            $comments.find('.comments-host-middle .comments-sheet')
                .appendTo($comments.find('.comments-host-left'))
                .css({'margin-left':0, 'opacity':1})
                .addClass('comments-pile-'+parseInt(Math.random()*3+1))
            $this.prependTo($comments.find('.comments-host-middle'))
                .css({'margin-left':0, 'opacity':1})
                .find('.comments-comments').show()
            $comments.find('.comments-host-middle .comments-reply-sheet').show()
            $comments.find('.comments-reply-controls').show();
        }, 250)
    })
    $('.comments-host-left').on('click', '.comments-sheet', function(){
        $this = $(this);
        $comments = $this.parents('.comments');
        $(this).css({
            'margin-left': 704,
        }).removeClass('comments-pile-1 comments-pile-2 comments-pile-3');
        $comments.find('.comments-host-middle .comments-sheet')
            .css({
                'margin-left': 704,        
                'opacity': 0.5,
            })
            .find('.comments-comments').hide()
        $comments.find('.comments-host-middle .comments-reply-sheet').hide();
        $comments.find('.comments-host-middle .comments-controls').hide()
        setTimeout(function(){
            $comments.find('.comments-host-middle .comments-sheet')
                .appendTo($comments.find('.comments-host-right'))
                .css({'margin-left':0, 'opacity':1})
                .addClass('comments-pile-'+parseInt(Math.random()*3+1))
            $this.prependTo($comments.find('.comments-host-middle'))
                .css({'margin-left':0, 'opacity':1})
                .find('.comments-comments').show()
            if ($this.hasClass('comments-area')) {
                $this.find('textarea').focus();
                $comments.find('.comments-area-controls').show();
            } else {
                $comments.find('.comments-host-middle .comments-reply-sheet').show()
                $comments.find('.comments-reply-controls').show();
            }
        }, 250)
    })

})