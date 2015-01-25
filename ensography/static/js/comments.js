window.Comments = function(container, tag, title) {
    this.tag = tag;
    this.title = title;
    this.$ = $(container);
    window.Comments.prototype.user = { success: false }; // name, id, email
    this.view_render();
    this.data_load();
}
window.Comments.prototype = {

    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    data_load: function() {
        var that = this;
        $.ajax({
            url: '/comments/load/',
            dataType: 'json',
            data: { tag: this.tag },
            success: function(data) {
                that.onLoad(data.comments);
            }
        })
    },
    data_sendComment: function(text) {
        if (!window.Comments.prototype.user.success) return false;
        var that = this;
        $.ajax({
            url: '/comments/send/comment/',
            type: 'POST',
            dataType: 'json',
            data: {
                tag: this.tag,
                text: text
            },
            success: function(data) { that.onSentComment(data.comment); }
        })
        return true
    },
    data_sendReply: function(comment_id, text) {
        if (!window.Comments.prototype.user.success) return false;
        var that = this;
        $.ajax({
            url: '/comments/send/reply/',
            type: 'POST',
            dataType: 'json',
            data: {
                comment_id: comment_id,
                text: text
            },
            success: function(data) { that.onSentReply(data.reply); }
        })
        return true
    },
    data_updateCommentWithReply: function(comment_id, reply) {
        for (var i=0; i<this.data.length; i++)
            if (this.data[i].id == comment_id)
                this.data[i].replies.push(reply);
    },


    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    onSentComment: function(comment) {
        console.log('comment return')
        this.data.push(comment);
        this.view_addComment(comment);
        this.view_activate();
        this.view_clearComment();
        this.view_focusOnTheFirstComment();      
    },
    onSentReply: function(reply) {
        this.data_updateCommentWithReply(reply.comment_id, reply);
        this.view_addReply(reply);
        this.view_activate();
        this.view_clearReply();
    },
    onLoad: function(comments) {
        this.data = comments;
        this.view_updateCount();
        this.view_renderComments();
    },
    onAuth: function(user) {
        window.Comments.prototype.user = user;
        if (window.Comments.prototype.user.success) 
            this.view_authSuccess();
        else
            this.view_authFailure();
    },


    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    view_focusOnTheFirstComment: function() {
        this.$.find('.comments-host-right .comments-sheet').first().click();
    },
    view_clearComment: function() {
        this.$.find('.comments-sheet textarea').val('');
    },
    view_clearReply: function() {
        this.$.find('.comments-reply-sheet textarea').val('');
    },
    view_suspend: function() {
        $('.comments textarea').attr('disabled', true);
        $('.comments').addClass('m-comments-suspend');
    },
    view_activate: function() {
        $('.comments textarea').attr('disabled', false);
        $('.comments').removeClass('m-comments-suspend');
    },
    view_authFailure: function() {
        // works for all Comments on page
        $('.m-comments-send-facebook-auth')
            .removeClass('m-comments-send-facebook-auth')
            .addClass('m-comments-send-facebook');
    },
    view_authSuccess: function() {
        // works for all Comments on page
        window.Comments.prototype.view_activate();
        $('.m-comments-send-facebook')
            .addClass('m-comments-send-facebook-auth')
            .removeClass('m-comments-send-facebook');
        // patch and show userpics
        $('.comments-area .userpic').show().css({
            'background-image' : 'url('+window.Comments.prototype.user.userpic+')'
        })
        // focus on single textarea 
        if (window.Comments.prototype.authSource) {
            var that = window.Comments.prototype.authSource;
            var isFocus = false;
            that.$.find('.comments-host-middle .comments-sheet textarea')
                .each(function(){ isFocus = true; $(this).focus(); });
            if (!isFocus) that.$.find('.comments-host-middle .comments-reply-sheet textarea')
                .each(function(){ $(this).focus(); });
            window.Comments.prototype.authSource = false;
        }
    },
    view_updateCount: function() {
        if (this.data.length == 0) {
            this.$.find('.js-comments-count-wrapper').hide();
        } else {
            this.$.find('.js-comments-count-wrapper').show();
            this.$.find('.js-comments-count').html(this.data.length);
        }
    },
    view_renderComments: function() {
        for (var i=0; i<this.data.length; i++) 
            this.view_addComment(this.data[i]);
    },
    view_addReply: function(reply) {
        var prerender = this.view_prerenderReply(reply);
        this.$.find('.comments-sheet').each(function(){
            if ($(this).data('id') == reply.comment_id) {
                $(this).find('.comments-comments').append(prerender);
            }
        })
    },
    view_prerenderReply: function(reply) {
        var starter = ['<span class="comments-comments-author comments-author-typeface">',
                        reply.author.name,
                        '</span><span class="comments-comments-text">',
                        reply.text];
        if (reply.text.substr(0,3) == '<p>')
            starter = ['<p><span class="comments-comments-author comments-author-typeface">',
                        reply.author.name,
                        '&nbsp;&nbsp;</span><span class="comments-comments-text">',
                        reply.text.substr(3)];
        return ['<div class="comments-comments-one comments-typeface">',
                starter.join(""),
                '</div>'].join("");
    },
    view_addComment: function(data) {
        var prerenderReplies = [];
        if (data.replies) {
            for (var i=0; i<data.replies.length; i++)
                prerenderReplies[i] = this.view_prerenderReply(data.replies[i]);
        }
        var prerender = [
            '<div data-id="'+data.id+'" class="comments-paper paper-white comments-sheet comments-pile-'+parseInt(Math.random()*3+1)+'">',
            '   <div class="comments-shade"></div>',
            '   <div class="userpic" style="background-image:url('+data.author.userpic+')"></div>',
            '   <div class="comments-author comments-author-typeface">',
                    data.author.name,
            '   </div>',
            '   <div class="comments-text comments-typeface">',
                    data.text,
            '   </div>',
            '   <div class="comments-comments">',
                    prerenderReplies.join(""),
            '   </div>',
            '</div>'
        ].join("");
        this.$.find('.comments-host-right').prepend(prerender);
    },

    view_render: function() {
        var prerender = [
            '<div class="control-expandable">',
            '<div class="control-right js-comments-count-wrapper" style="display:none">',
            '   <div class="icon icon--comments clearfix">',
            '       <div class="js-comments-count icon-img icon-static chrome-label-typeface">X</div>',
            '       <div class="icon-text chrome-label-typeface">Findings</div>',
            '   </div>',
            '</div>',
            '<div class="control-center control-comments">',
            '   <div class="icon icon--notes clearfix">',
            '       <div class="icon-collapse"></div>',
            '       <div class="icon-img"></div>',
            '       <div class="icon-text chrome-label-typeface">'+this.title+'</div>',
            '   </div>',
            '</div>',
            '<div class="control-expansion">',
            '   <div class="comments clearfix">',
            '       <div class="comments-host-left comments-host"></div>',
            '       <div class="comments-host-right comments-host"></div>',
            '       <div class="comments-host-middle comments-host">',
            '           <div class="comments-paper paper-white comments-sheet comments-area">',
            '               <div class="userpic"></div>',
            '               <textarea class="comments-typeface autosizejs" placeholder="What do you think of this? How do you recollect the experience?\nPlease reflect on the topic and share your thoughts here."></textarea>',
            '           </div>',
            '           <div class="comments-controls comments-area-controls">',
            '               <div class="comments-hint chrome-hint-typeface">',
            '                   We expect thoughts deeper than 140 symbols.',
            '               </div>',
            '               <div class="comments-send m-comments-send-facebook">',
            '                   <div class="icon icon--send clearfix js-comments-area-submit">',
            '                       <div class="icon-img icon-static"></div>',
            '                       <div class="icon-text chrome-label-typeface m-comments-send-facebook-show">Sign in with Facebook</div>',
            '                       <div class="icon-text chrome-label-typeface m-comments-send-facebook-hide">Share your thoughts</div>',
            '                   </div>',
            '               </div>',
            '           </div>',
            '           <div class="comments-paper paper-white comments-reply-sheet comments-comments-typeface">',
            '               <textarea class="comments-typeface autosizejs" placeholder="Reply to these thoughts"></textarea>',
            '           </div>',
            '           <div class="comments-controls comments-reply-controls">',
            '               <div class="comments-send m-comments-send-facebook">',
            '                   <div class="icon icon--send clearfix js-comments-reply-submit">',
            '                       <div class="icon-img icon-static"></div>',
            '                       <div class="icon-text chrome-label-typeface m-comments-send-facebook-show">Sign in with Facebook</div>',
            '                       <div class="icon-text chrome-label-typeface m-comments-send-facebook-hide">Submit your reply</div>',
            '                   </div>',
            '               </div>',
            '           </div>',
            '       </div>',
            '   </div>',
            '   <div class="brick64"></div>',
            '</div>',
            '</div>'
        ].join("");
        this.$.html(prerender);
        this.view_bind();
    },
    view_auth: function() {
        window.Comments.prototype.authSource = this;
        var w = "500";
        var h = "500";
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(window.Comments.loginUrl, 'auth', 'width='+w+',height='+h+',left='+left+',top='+top);
    },
    view_bind: function() {
        var that = this;
        this.$.find('.js-comments-area-submit').click(function(e){
            that.view_suspend();
            if (window.Comments.prototype.user.success) {
                if (!that.data_sendComment(that.$.find('.comments-sheet textarea').val()))
                    that.view_activate();
            } else {
                that.view_auth();
            }
            e.stopPropagation();
            return true;
        })
        this.$.find('.comments-host-middle').on('click', '.js-comments-reply-submit', function(e){
            that.view_suspend();
            if (window.Comments.prototype.user.success) {
                if (!that.data_sendReply(
                        that.$.find('.comments-host-middle .comments-sheet').data("id"),
                        that.$.find('.comments-reply-sheet textarea').val()))
                    that.view_activate();
            } else {
                that.view_auth();
            }
            e.stopPropagation();
            return true;
        })
        this.$.find('.comments-reply-sheet textarea')
            .focus(function(){ 
                $(this).addClass('m-comments-reply-sheet-focus');
                $(this).parent().next().css({opacity:1}); show_tooltips(); })
            .blur(function(){  
                var $this = $(this);
                setTimeout(function(){
                    $this.removeClass('m-comments-reply-sheet-focus')
                         .parent().next().css({opacity:0}) 
                }, 500);
            })
        this.$.find('.icon')
            .mouseover(show_tooltips)
            .mousemove(show_tooltips)
    },


    // EOF
    undef: function(u) { return u }
}