var timeoutTooltips;
function hide_tooltips() {
    $('.icon .icon-text').css({ opacity: 0 })
}
function show_tooltips() {
    $('.icon .icon-text').css({ opacity: 1 })
    clearTimeout(timeoutTooltips)
    timeoutTooltips = setTimeout(hide_tooltips, 2500);
}

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

    $('.comments-reply-sheet textarea')
        .focus(function(){ $(this).parent().next().css({opacity:1}); show_tooltips(); })
        .blur(function(){  $(this).parent().next().css({opacity:0}) })

    var timeoutTOC;
    $('.chrome-toc-hint').appendTo($('body'))
    $('.control-toc .chrome-toc-chapter').not('.chrome-toc-unfinished')
        .mouseover(function(){
            clearTimeout(timeoutTOC);
            $('.chrome-toc-hint').css({
                opacity: 1,
                top: $(this).offset().top
            })
        })
        .mouseout(function(){
            clearTimeout(timeoutTOC);
            timeoutTOC = setTimeout(function(){ $('.chrome-toc-hint').css('opacity', 0) }, 250)
        })


    show_tooltips();
    $(window).scroll(show_tooltips);


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
        $(this).css({
            'margin-left': -704,
        }).removeClass('comments-pile-1 comments-pile-2 comments-pile-3');
        $('.comments-host-middle .comments-sheet')
            .css({
                'margin-left': -704, 
                'opacity': 0.5,
            })
            .find('.comments-comments').hide()
        $('.comments-host-middle .comments-reply-sheet').hide()
        $('.comments-host-middle .comments-controls').hide()
        setTimeout(function(){
            $('.comments-host-middle .comments-sheet')
                .appendTo('.comments-host-left')
                .css({'margin-left':0, 'opacity':1})
                .addClass('comments-pile-'+parseInt(Math.random()*3+1))
            $this.prependTo('.comments-host-middle')
                .css({'margin-left':0, 'opacity':1})
                .find('.comments-comments').show()
            $('.comments-host-middle .comments-reply-sheet').show()
            $('.comments-reply-controls').show();
        }, 250)
    })
    $('.comments-host-left').on('click', '.comments-sheet', function(){
        $this = $(this);
        $(this).css({
            'margin-left': 704,
        }).removeClass('comments-pile-1 comments-pile-2 comments-pile-3');
        $('.comments-host-middle .comments-sheet')
            .css({
                'margin-left': 704,        
                'opacity': 0.5,
            })
            .find('.comments-comments').hide()
        $('.comments-host-middle .comments-reply-sheet').hide();
        $('.comments-host-middle .comments-controls').hide()
        setTimeout(function(){
            $('.comments-host-middle .comments-sheet')
                .appendTo('.comments-host-right')
                .css({'margin-left':0, 'opacity':1})
                .addClass('comments-pile-'+parseInt(Math.random()*3+1))
            $this.prependTo('.comments-host-middle')
                .css({'margin-left':0, 'opacity':1})
                .find('.comments-comments').show()
            if ($this.hasClass('comments-area')) {
                $this.find('textarea').focus();
                $('.comments-area-controls').show();
            } else {
                $('.comments-host-middle .comments-reply-sheet').show()
                $('.comments-reply-controls').show();
            }
        }, 250)
    })

})