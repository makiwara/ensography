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
    _pk: 0,



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
        // TODO serverside for this handle
        var that = this;
        $.ajax({
            url: '/bottle/next/',
            dataType: 'json',
            data: { pk: this.pk },
            success: function(data) {
                if (data.pk) that.pk = data.pk;
                that.view_append(data.html);
            }
        })
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
        this.view_bind();
    },
    view_bind: function() {
        $('.curtain').click(function(){ $($('html').data('curtain-click')).click(); })
        this.$.on('click', '.experiment-one-results .photo', function() {
            var $photo = $('<div class="photo">'+$(this).html()+'</div>');
            $photo.addClass('photo-enlarged')
                  .css({
                    position: 'fixed',
                    'z-index': 1000,
                    left: '50%', top: '50%',
                    margin: '-320px 0 0 -320px'
                  })
                  .click(function(){
                    $('html').removeClass('blocked');
                    $(this).remove();
                  })
            $('body').append($photo);
            $('html').addClass('blocked');
            $('html').data('curtain-click', '.photo-enlarged')
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
    view_append: function(html) {
        var $html = $(html);
        this.$.append($html);
        this.view_animate($html);
    },
    view_animate: function($e) {
        if (!$e.hasClass('experiment-one')) return $e.css({opacity:1});
        var animation_time = 0;
        var animation = [
            ['start', 0], 
            ['incoming', 750], 
            ['open', 250, 
                function($context) { $context.find('.bottle').addClass('bottle-empty').removeClass('bottle-full') }],
            ['enlarge', 750, function($context) { 
                $context.find('.photo').addClass('photo-rotate-'+parseInt(Math.random()*6+1)) }],
            ['upload']
        ];
        var prefix = 'experiment-one-state-';
        for (var i=0; i<animation.length; i++) {
            (function(){
                var this_state = animation[i];
                var next_state = (i+1 == animation.length) ? false : animation[i+1];
                animation_time += this_state[1];
                if (next_state) setTimeout(function(){
                    $e.removeClass(prefix+this_state[0]).addClass(prefix+next_state[0]);
                    if (next_state[2]) next_state[2]($e);
                }, animation_time)
            })();
        }
    },


    // EOF
    undef: function(u) { return u }
}