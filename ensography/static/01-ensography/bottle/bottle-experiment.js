window.BottleExperiment = function(container, tag, title) {
    this.tag = tag;
    this.title = title;
    this.$ = $(container);
    window.BottleExperiment.prototype.user = { success: false }; // name, id, email
    this.view_render();
}
window.Comments.prototype = {

    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================


    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    onAuth: function(user) {
        window.BottleExperiment.prototype.user = user;
        if (window.BottleExperiment.prototype.user.success) 
            this.view_authSuccess();
        else
            this.view_authFailure();
    },


    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    view_suspend: function() {
        // TODO refactor
        $('.comments textarea').attr('disabled', true);
        $('.comments').addClass('m-comments-suspend');
    },
    view_activate: function() {
        // TODO refactor
        $('.comments textarea').attr('disabled', false);
        $('.comments').removeClass('m-comments-suspend');
    },
    view_authFailure: function() {
        // TODO refactor
        // works for all Comments on page
        $('.m-comments-send-facebook-auth')
            .removeClass('m-comments-send-facebook-auth')
            .addClass('m-comments-send-facebook');
    },
    view_authSuccess: function() {
        // TODO refactor
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
    view_render: function() {
        // TODO refactor       
        var prerender = [].join("");
        this.$.html(prerender);
        this.view_bind();
    },
    view_auth: function() {
        window.BottleExperiment.prototype.authSource = this;
        var w = "500";
        var h = "500";
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(window.Comments.loginUrl, 'auth', 'width='+w+',height='+h+',left='+left+',top='+top);
    },
    view_bind: function() {
        // TODO refactor
        var that = this;
    },


    // EOF
    undef: function(u) { return u }
}