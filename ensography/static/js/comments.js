window.Comments = function(container, tag, title) {
    this.tag = tag;
    this.title = title;
    this.$ = $(container);
    this.view_render();
    this.data_load();
}
window.Comments.prototype = {

    data_load: function() {
        // TODO ajax load
        this.data_loaded([
            {
                author: { 
                    name:'Nikolay Yaremko', 
                    userpic:'/static/people/userpic-nyaremko.png'
                },
                text: 'Apparently, when the body is healthy its sensory organs provide enough guarantees against such problems. On the other hand, the enormously excessive degrees of freedom, apparently give us considerable advantages.',
                replies: [
                    {
                        author: { name:'Daniel Stryder' },
                        text: 'The point is moot. I would like to discuss rather silly topic: the mating process of whales. Do you know whale falli are longer than whales themselves?'
                    }
                ]
            }
        ]);
    },
    data_loaded: function(comments) {
        this.data = comments;
        this.view_updateCount();
        this.view_renderComments();
    },

    view_updateCount: function() {
        this.$.find('.js-comments-count').html(this.data.length);
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
            '<div class="control-right">',
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
            '                   We expect thoughts deeper than 140 symbols.<br>',
            '                   Your thoughts will be published only if you ask for it.',
            '               </div>',
            '               <div class="comments-send">',
            '                   <div class="icon icon--send clearfix">',
            '                       <div class="icon-img icon-static"></div>',
            '                       <div class="icon-text chrome-label-typeface">Store your thoughts</div>',
            '                   </div>',
            '               </div>',
            '           </div>',
            '           <div class="comments-paper paper-white comments-reply-sheet comments-typeface">',
            '               <textarea class="comments-typeface autosizejs" placeholder="Reply to these thoughts"></textarea>',
            '           </div>',
            '           <div class="comments-controls comments-reply-controls">',
            '               <div class="comments-send">',
            '                   <div class="icon icon--send clearfix">',
            '                       <div class="icon-img icon-static"></div>',
            '                       <div class="icon-text chrome-label-typeface">Submit your reply</div>',
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
    },


    // EOF
    undef: function(u) { return u }
}