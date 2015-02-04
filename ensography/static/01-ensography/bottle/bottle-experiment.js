window.BottleExperiment = function(container, user) {
    this.$ = $(container);
    window.BottleExperiment.prototype.user = { success: false }; // name, id, email
    if (user) window.BottleExperiment.prototype.onAuth(user);
    this.view_render();
}
window.BottleExperiment.prototype = {

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
        if (this._rendered) {
            if (window.BottleExperiment.prototype.user.success) 
                this.view_authSuccess();
            else
                this.view_authFailure();
        }
    },
    onNext: function() {
        // TODO load next image 
        console.log('go')
    },


    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    // VIEWS ======================================================================
    tick: 250, // animation tick = 0.25s
    view_authFailure: function() {
        $('.experiment-auth').show().css({opacity:1})
        $('.experiment-auth-complete').hide().css({opacity:0})
    },
    view_authSuccess: function() {
        var that = this;
        $('.experiment-auth').css({opacity:0})
        setTimeout(function(){
            $('.experiment-auth').hide();
            $('.experiment-auth-complete').show().css({opacity:1})
        }, this.tick);
        setTimeout(function(){ that.onNext(); }, this.tick*2);
    },
    _rendered: false,
    view_render: function() {
        this._rendered = true;
        var that = this;
        if (this.user.success) 
            this.view_authSuccess();
        else 
            this.view_authFailure();
        this.$.find('.js-auth').click(function(e){
            that.view_auth();
            return true;
        })
    },
    view_auth: function() {
        window.BottleExperiment.prototype.authSource = this;
        var w = "500";
        var h = "500";
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(window.Comments.loginUrl, 'auth', 'width='+w+',height='+h+',left='+left+',top='+top);
    },


    // EOF
    undef: function(u) { return u }
}