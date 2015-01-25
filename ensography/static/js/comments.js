window.Comments = function(container, tag, title) {
    this.tag = tag;
    this.title = title;
    this.$ = $(container);
    this.user = { success: false }; // name, id, email
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
            url: '/comments/load',
            dataType: 'json',
            success: function(data) {
                that.onLoad(data.comments);
            }
        })
    },
    data_sendComment: function(text) {
        if (!this.user.success) return false;
        // TODO ajax send comment, should return new comment to add
        return true
    },


    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    onLoad: function(comments) {
        this.data = comments;
        this.view_updateCount();
        this.view_renderComments();
    },
    onAuth: function(user) { 
        this.user = user;
        if (this.user.success) this.view_authSuccess();
        else                   this.view_authFailure();
    },


    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    view_suspend: function() {
        this.$.find('textarea').attr('disabled', true);
        this.$.addClass('m-commends-suspend');
    },
    view_activate: function() {
        this.$.find('textarea').attr('disabled', false);
        this.$.removeClass('m-commends-suspend');
    },
    view_authFailure: function() {
        // works for all Comments on page
        $('.m-comments-send-facebook-auth')
            .removeClass('m-comments-send-facebook-auth')
            .addClass('m-comments-send-facebook');
    },
    view_authSuccess: function() {
        // works for all Comments on page
        $('.m-comments-send-facebook')
            .addClass('m-comments-send-facebook-auth')
            .removeClass('m-comments-send-facebook');
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
    view_addComment: function(data) {
        var prerenderReplies = [];
        for (var i=0; i<data.replies.length; i++)
            prerenderReplies[i] = [
                '<div class="comments-comments-one comments-typeface">',
                '   <span class="comments-comments-author comments-author-typeface">',
                    data.replies[i].author.name,
                '   </span>',
                '   <span class="comments-comments-text">',
                    data.replies[i].text,
                '   </span>',
                '</div>'
            ].join("");
        var prerender = [
            '<div class="comments-paper paper-white comments-sheet comments-pile-'+parseInt(Math.random()*3+1)+'">',
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
            '           <div class="comments-paper paper-white comments-reply-sheet comments-typeface">',
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
    view_bind: function() {
        this.$.find('.js-comments-area-submit').click(function(e){
            if (this.user.success) {
                this.view_suspend();
                if (!this.data_sendComment(this.$.find('.comments-area textarea').val()))
                    this.view_activate();
            } else {
                window.open(window.Comments.loginUrl); // TODO better pop-up
            }
            e.stopPropagation();
            return true;
        })
        this.$.find('.icon')
            .mouseover(show_tooltips)
            .mousemove(show_tooltips)
    },


    // EOF
    undef: function(u) { return u }
}