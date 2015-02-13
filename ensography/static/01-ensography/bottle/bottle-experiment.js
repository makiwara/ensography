window.BottleExperiment = function(container, user) {
    this.$ = $(container);
    window.BottleExperiment.prototype._.push(this);
    window.BottleExperiment.prototype.user = { success: false }; // name, id, email
    if (user) window.BottleExperiment.prototype.onAuth(user);
    this.view_render();
}
window.BottleExperiment.prototype = {
    _ : [],
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    // MODEL =======================================================================
    _pk: 0,
    _isQuestion: false,


    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    // CONTROLLERS ================================================================
    onAuth: function(user) { 
        if (ga) ga('send', 'event', 'profile', 'auth');
        window.BottleExperiment.prototype.user = user;
        for (var i=0; i<window.BottleExperiment.prototype._.length; i++)
            if (window.BottleExperiment.prototype.user.success) 
                window.BottleExperiment.prototype._[i].view_authSuccess();
            else
                window.BottleExperiment.prototype._[i].view_authFailure();
    },

    OnIframeQuestion: function() {
        for (var i=0; i<window.BottleExperiment.prototype._.length; i++)
            if (window.BottleExperiment.prototype._[i]._isQuestion) {
                var that = window.BottleExperiment.prototype._[i];
                that.view_finalize();
            }
    },
    OnIframeAnswer: function(data) { 
        for (var i=0; i<window.BottleExperiment.prototype._.length; i++) {
            var that = window.BottleExperiment.prototype._[i];
            that.$.find('.experiment-one').each(function(){
                if ($(this).data('id') == data.pk) {
                    var $this = $(this);
                    that.view_hideIframe(this);
                    $.ajax({
                        url: '/bottle/results/',
                        dataType: 'json',
                        data: { pk: data.pk },
                        success: function(data) {
                            that.view_appendResults(data.results, $this, function(){
                                that.onNext();
                            });
                        }
                    })
                }
            })
        }        
    },
    // non-static controllers -----------------------------------------------------
    onNext: function() {
        var that = this;
        $.ajax({
            url: '/bottle/next/',
            dataType: 'json',
            data: { pk: this.pk },
            success: function(data) {
                if (data.pk) { that.pk = data.pk; that._isQuestion = false; }
                else that._isQuestion = true;
                if (ga) ga('send', 'event', 'bottle-experiment', 'next');
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
        if (!this._rendered) return;
        this.$.find('.experiment-auth').show().css({opacity:1})
        this.$.find('.experiment-auth-complete').hide().css({opacity:0})
    },
    view_authSuccess: function() {
        if (!this._rendered) return;
        var that = this;
        this.$.find('.js-experiment-auth-userpic').css({
            'background-image' : 'url('+window.BottleExperiment.prototype.user.userpic+')'
        })
        this.$.find('.js-experiment-auth-name').html(window.BottleExperiment.prototype.user.name)
        this.$.find('.experiment-auth').css({opacity:0})
        setTimeout(function(){
            that.$.find('.experiment-auth').hide();
            that.$.find('.experiment-auth-complete').show().css({opacity:1})
        }, this.tick);
        setTimeout(function(){ 
            that.onNext(); 
        }, this.tick*2);
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
            $.ajax({
                url: '/bottle/stat/',
                dataType: 'json',
                data: { answer: $(this).data('answer') }
            })
            var $photo = $('<div class="photo experiment-one-results-loaded">'+$(this).html()+'</div>');
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
    view_finalize: function() {
        this.$.find('.experiment-add').remove();
        this.$.find('.experiment-done').appendTo(this.$).show().css({opacity:1});
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
    view_hideIframe: function(container) {
        $(container).find('iframe').hide();
    },
    view_appendResults: function(results, $this, callback) {
        var pos = 0;
        var that = this;
        var $results = $this.find('.experiment-one-results');
        that.$.find('.experiment-one-state-upload')
            .removeClass('experiment-one-state-upload')
            .addClass('experiment-one-state-results');
        if (results.length < 5) 
            $results.append($('<div>').addClass('experiment-one-results-pan'));
        function add_one() {
            if (pos >= results.length) return callback();
            var pk  = results[pos].pk;
            var url = results[pos].url;
            pos++
            if (url != "") {
                $([url]).preload(function(){
                    var $img = $('<div>').addClass('photo').data('answer', pk);
                    $img.append($('<div>').addClass('photo-image').css({ 'background-image' : 'url('+url+')' }));
                    $results.append($img);
                    setTimeout(function(){ $img.addClass('experiment-one-results-loaded') }, 1)                
                    setTimeout(add_one, that.tick);    
                }) 
            } else add_one();
        }
        add_one();
    },


    // EOF
    undef: function(u) { return u }
}