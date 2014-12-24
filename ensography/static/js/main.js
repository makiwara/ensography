$(function(){


	$('.autosizejs').autosize();

	$('.control-expandable .icon')
		.click(function(){
			show_tooltips();
			var $ctrl = $(this).parents('.control-expandable');
			var isExpanded = $ctrl.hasClass('control-expanded');
			$ctrl.toggleClass('control-expanded');
			if (isExpanded) $ctrl.find('.control-expansion').slideUp();
			else			$ctrl.find('.control-expansion').slideDown();
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

	var timeoutTooltips;
	function hide_tooltips() {
		$('.icon .icon-text').css({ opacity: 0 })
	}
	function show_tooltips() {
		$('.icon .icon-text').css({ opacity: 1 })
		clearTimeout(timeoutTooltips)
		timeoutTooltips = setTimeout(hide_tooltips, 2500);
	}

	var timeoutTOC;
	$('.chrome-toc-hint').appendTo($('body'))
	$('.control-toc .chrome-toc-chapter')
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

})