jQuery(document).ready(function($) {
    $("#partners > li > a").click(function(e){
        e.preventDefault();
		if ($(this).hasClass('on')){
			$("#partners > li > a").removeClass('on');
			$(this).next('ul').slideUp(200);
		}else{
			$("#partners > li > a").removeClass('on');
			$("#partners > li > ul").hide();
			$(this).addClass('on');
			$(this).next('ul').slideDown(200);
		}
	});
	$("#partners a").focusout(function(e){
        e.preventDefault();
		setTimeout(function(){
			if($('#partners a:focus').length < 1){
				$("#partners > li > a").removeClass('on');
				$("#partners > li > ul").slideUp(200);
			}
		},100); 
	});
});
