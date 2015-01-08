    
window.Crystalgram = {

    states : {
        'init': {
            text: ["This is interactive demonstration of <strong>Crystalgram</strong> app.",
                   "Interface of Crystalgram is simple and obvious, quite familiar for Instagram users."],
            action: "Hit <strong>Camera</strong> button to start demo",
            next: 'camera'
        },
        'camera': {
            text: ["Camera functions are almost similar to Instagram. We even chose to crop picture in the square frame. Differences will appear after you shoot the picture."],
            text2: ["You can choose another picture from the photo library."],
            action: "Shoot the picture to continue",
            next: 'filters',
            prev: 'init'
        },
        'filters': {
            text: ["After the picture is taken, user can apply generic filters and add the <strong>Crystallization Effect</strong>. Crystallization hides picture details, but both scene and intrigue remain quite perceptible."],
            text2: ["Touch <strong>Next</strong> when you are done."],
            action: "Touch the screen to crystallize picture",
            next: 'share',
            prev: 'camera',
            on: function(that) {
                that.$.find('.crystalgram-filters-photo').attr('src',that.$.find('.crystalgram-camera-photo').attr('src'))
                that.$.find('.crystalgram-filters-crystal').css({
                    opacity:0, 'background-image':'none'
                })
                that.crystalCount = 0;
                that.crystallized = false;
            }
        },
        'share': {
            text: ["Other users will be able to remove crystallization for a price. Starting bid is selectable from Share screen. All the usuals are also here."],
            action: "Touch <strong>Share</strong> to publish the picture",
            next: 'result',
            on: function(that) {
                that.$.find('.crystalgram-share-photo').attr('src',that.$.find('.crystalgram-camera-photo').attr('src'))                
            }
        },
        'result': {
            text: ["You see the outcome of your actions now. Others will soon uncover the picture and discuss it. User will receive their payment in full. Meanwhile, there is a new picture in the news feed. And it is <em>crystallized</em>!",
                    "Tap crystallized photo to pay crystals and uncover the picture."],
            next: 'final',
            on: function(that) {
                var img = that.$.find('.crystalgram-camera-photo').attr('src');
                that.insert( img, that.crystallized, 1 );
                setTimeout(function(){ that.insert(); }, 2000);
            }
        },
        'final': {
            text: ["You can see the picture now in full.<br>This little demonstration is concluded.",
                   "Do you want to experience it once again?"],
            action: "Hit <strong>Camera</strong> to shoot",
            next: 'camera',
            text2: ['You can also take a look on <a href="/portfolio/crystalgram">animated&nbsp;crystallization&nbsp;effects</a>.']
        }
    },
    state : 'init',
    prevState: 'init',
    init : function() {
        this.$ = $('.crystalgram-demo');
        var that = this;
        $('.crystalgram-demo .icon').click(function() { that.next_state(); })
        $('.crystalgram-button-camera').click(function(e) { that.pulsate(e, function(){ that.next_state('camera') })})
        $('.crystalgram-button-back').click(function(e) { that.pulsate(e, function(){ that.prev_state() })})
        $('.crystalgram-button-next').click(function(e) { that.pulsate(e, function(){ that.next_state() })})
        $('.crystalgram-button-library').click(function(e) { that.pulsate(e, function(){ that.showhide_library() })})
        $('.crystalgram-camera-library img').click(function(e) { var img = this; that.pulsate(e, function(){ that.set_camera(img) })})
        $('.crystalgram-filters-crystal').mousedown(function(){
            that.crystallize(); return true
        })
        $('.crystalgram-filters-crystal').mouseup(function(){
            that.crystallize(); return true
        })
        $('.crystalgram-result-contents').click(function(e) { 
            if (that.state != 'final')
                that.pulsate(e, function(){ that.next_state() 
        })})
    },
    showhide_library: function() {
        var $wrap = this.$.find('.crystalgram-camera-wrap');
        $wrap.toggleClass('crystalgram-camera-library-open');
        if ($wrap.hasClass('crystalgram-camera-library-open'))
            $wrap.css({marginTop: -160})
        else
            $wrap.css({marginTop: 0})
    },
    set_camera: function(img) {
        $('.crystalgram-camera-photo').attr('src', img.src);
        this.showhide_library();
    },
    crystalCount: 0,
    crystallized: true,
    crystallize: function() {
        var next = Math.floor(Math.random()*8)+1;
        var url = this.$.find('.crystalgram-filters-photo').attr('src').replace('.jpg','-assets/'+next+'.png');
        this.$.find('.crystalgram-filters-crystal').css({'background-image':'url('+url+')'})
        this.$.find('.crystalgram-filters-crystal'+this.crystalCount).css({opacity:0})
        this.crystalCount= (this.crystalCount+1)%2;
        this.crystallized = true;
        this.$.find('.crystalgram-filters-crystal'+this.crystalCount).css({opacity:0.7})
    },
    //insertMargin: 64,
    insert: function( src, isCrystallized, price, undef ) {
        var border = 3;
        var srcs = [
            '11-paninazina.jpg',
            '12-verachkaaa_t23.jpg',
            '13-bobuk.jpg',
            '14-i107i.jpg',
            '15-a_plakhoff.jpg',
            '16-antonzabannikh.jpg',
            '17-innubis.jpg',
            '18-sonna.jpg'
        ]
        if (price === undef) price = Math.floor(Math.random()*7)+1;
        if (isCrystallized === undef) isCrystallized = true;
        if (src === undef) {
            var srcno = Math.floor(Math.random()*srcs.length);
            src = '/static/01-ensography/crystalgram/photos/'+srcs[srcno];
            border = Math.floor(Math.random()*2)+1;
        }
        var data = [];
        var crystal = Math.floor(Math.random()*8)+1;
        data[0] = '<div class="crystalgram-result-wrap crystalgram-result-wrap'+border+'" style="">';
        data[1] = '<img class="crystalgram-result-photo" src="'+src+'">';
        if (isCrystallized) {
            data[1] += 
                "<div class='crystalgram-result-crystal' style='background-image:url("+src.replace('.jpg','-assets/'+crystal+'.png')+")'></div>"+
                "<div class='crystalgram-result-price crystalgram-result-price"+price+"'></div>"
        } 
        data[2] = '</div>';
        $(data.join("")).prependTo(this.$.find('.crystalgram-result-contents'));
        //insertMargin-=445;
        this.$.find('.crystalgram-result-contents').css({'margin-top':64-445})
        var that = this;
        setTimeout(function(){
            that.$.find('.crystalgram-result-contents').css({'margin-top':64}).addClass('crystalgram-result-contents-animated');
        },1)
        setTimeout(function(){
            that.$.find('.crystalgram-result-contents').removeClass('crystalgram-result-contents-animated');
        },500)
    },
    next_state: function( newState, undef ) {
        if (newState == undef)
            newState = this.states[ this.state ].next;
        this.prevState = this.state;
        this.state = newState;
        if (newState == 'final') {
            this.$.find('.crystalgram-result-crystal').css({opacity:0});
            this.$.find('.crystalgram-result-price').css({opacity:0});
        } else {
            this.$.find('.demo-state-prev').removeClass('demo-state-prev');
            this.$.find('.demo-state-active').addClass('demo-state-prev').removeClass('demo-state-active');
            this.$.find('.crystalgram-state-'+this.state).addClass('demo-state-active');
        }
        if (this.states[this.state].on)
            this.states[this.state].on(this);
        this.patch_info();            
    },
    prev_state: function( newState, undef ) {
        if (newState == undef)
            newState = this.prevState;
        if (this.states[this.state].prev)
            newState = this.states[this.state].prev;
        this.prevState = this.state;
        this.state = newState;
        this.$.find('.demo-state-prev').removeClass('demo-state-prev');
        this.$.find('.demo-state-active').removeClass('demo-state-active');
        this.$.find('.crystalgram-state-'+this.state).addClass('demo-state-active');
        this.patch_info();
    }, 
    patch_info: function() {
        this.$.find('.chrome-demo-text-1')
            .html('<p>'+this.states[this.state].text.join('</p><p>')+'</p>')
        if (this.states[this.state].text2)
            this.$.find('.chrome-demo-text-2')
                .html('<p>'+this.states[this.state].text2.join('</p><p>')+'</p>')
        else
            this.$.find('.chrome-demo-text-2').html('');
        if (this.states[this.state].action) {
            this.$.find('.chrome-demo-control')
                .html(this.states[this.state].action);
            this.$.find('.icon').show()
        }
        else
            this.$.find('.icon').hide()
        // also reset library here
        this.$.find('.crystalgram-camera-wrap').css({marginTop:0})
    },
    pulsate : function(event, callback) {
        var $p = $('<div class="chrome-pulsate"></div>')
                .css({left:event.pageX, top:event.pageY})
                .appendTo(document.body);
        setTimeout(function(){ $p.css({opacity:1}) },1);
        setTimeout(function(){ $p.css({opacity:0}) },50);
        setTimeout(function(){ $p.remove() },100);
        setTimeout(callback, 150)
    }
}

$(function(){
    Crystalgram.init();
})