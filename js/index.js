$(function(){
	// 点击开始游戏，隐藏.left的div
	$('.left span').on('click',function(){
		$('.left').css('display','none');
		$('.sel').css('display','block');
	});
	// 点击返回，隐藏.sel的div
	$('.sel .back').on('click',function(){
		$('.sel').css('display','none');
		$('.left').css('display','block');
	});
	// 点击游客登录，将玩家二的昵称设置为“游客登录”
	$('.sel .yk').on('click',function(){
		$('input[name="wtwo"]').attr('value','游客登录');
	});
	// 点击开始游戏，隐藏整个开始界面
	$('.sel .sg').on('click',function(){
		// 获取玩家的昵称，难易程度
		var wtwo = $('input[name="wtwo"]').val();
		var nanyi = $('input:checked').val();
		
		$('#container').css('display','none');
		$('#contChess').css('display','block');
	});
})
