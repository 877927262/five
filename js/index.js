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

		//根据用户的选择进行绘制棋盘和选择算法
		if(nanyi === 'easy'){
      // 简单难度代码
			var chessBoard = [];
	var me = true;
	var over = false;

	var wins = [];
	var myWin = [];
	var computerWin = [];


	//5.初始化棋盘的每一个交叉点值为0
	for(var i=0;i<15;i++){
		chessBoard[i] = [];
		for(var j=0;j<15;j++){
			chessBoard[i][j] = 0;
		}
	}

	//7.定义一个嬴法数组
	for(var i=0;i<15;i++){
		wins[i] = [];
		for(var j=0;j<15;j++){
			wins[i][j] = [];
		}
	}
	var count = 0;  //嬴法种类的索引,即第几种嬴法
	//所有横线嬴法
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i][j+k][count] = true;
			}
			count++;
		}
	}
	//所有竖线嬴法
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[j+k][i][count] = true;
			}
			count++;
		}
	}
	//所有斜线嬴法
	for(var i=0;i<11;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}
	//所有反斜线嬴法
	for(var i=0;i<11;i++){
		for(var j=14;j>3;j--){
			for(var k=0;k<5;k++){
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}
	// console.log(count);  //print:572(在15*15棋盘上共有572种嬴法)

	//8.定义嬴法的统计数组
	for(var i=0;i<count;i++){
		myWin[i] = 0;
		computerWin[i] = 0;
	}

	//获取棋盘所在的画布2d上下文
	var chess=document.getElementById("chess");
	var context=chess.getContext('2d');

	//2.绘制水印
	// var logo = new Image();  //image有一个onload方法，当图片加载完毕以后才去绘制水印
	// // logo.src = "images/logo.png";
	// logo.src = "images/logo3.jpg";
	// logo.onload = function(){  //此方法是异步执行的,所以为了不让水印压住棋盘线，需要先绘制水印再绘制棋盘线
	// 	context.drawImage(logo,0,0,450,450);
	// 	drawChessBoard();
	// }

	//1.绘制棋盘
	//整个canvas画布是450px*450px，一共15条线(即14个格,每个格子30px，两边留白各15px)
	context.strokeStyle="#BFBFBF"; //设置棋盘线的样式(颜色)
	var drawChessBoard = function(){
		for(var i=0;i<15;i++){
		    context.moveTo(15 + i*30, 15);
		    context.lineTo(15 + i*30, 435);
		    context.stroke();
		    context.moveTo(15 , 15 + i*30);
		    context.lineTo(435 ,15 + i*30);
		    context.stroke();
		}
	}
	drawChessBoard();
	alert("请玩家持黑子先行");

	//3.绘制棋子
	var oneStep = function(i,j,me){  //i,j是索引；me是黑棋/白棋
		context.beginPath();
		context.arc(15 + i*30,15 + j*30,13,0,2*Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2,13, 15 + i*30 + 2, 15 + j*30 - 2,0); //实现渐变
		if(me){ //如果是黑棋
			gradient.addColorStop(0,"#0A0A0A"); //0所对应的是圆心为200,200，半径是50的圆；并为该圆设置颜色
			gradient.addColorStop(1,"#636766"); //1所对应的是圆心为200,200，半径是20的圆；并为该圆设置颜色
		}else{ //如果是白棋
			gradient.addColorStop(0,"#D1D1D1");
			gradient.addColorStop(1,"#F9F9F9");
		}
		context.fillStyle = gradient;
		context.fill();
	}


	//4.当鼠标点击时，调用oneStep函数实现落子
	chess.onclick = function(e){
		if(over){ //如果已经结束了直接return
			return;
		}
		if(!me){
			return;
		}
		var x = e.offsetX;  //offsetX,offsetY是相对于canvas的0,0点来计算的坐标
		var y = e.offsetY;
		var i = Math.floor(x/30);  //floor，向下取整
		var j = Math.floor(y/30);
		if(chessBoard[i][j] == 0){ //如果被点击的地方没有棋子，才允许落子
			oneStep(i,j,me);
			chessBoard[i][j] = 1;//如果落子的位置是黑棋，则设置他的值为1；白棋值为2

			for(var k=0;k<count;k++){
				if(wins[i][j][k]){
					myWin[k]++;
					computerWin[k] = 6;
					if(myWin[k] == 5){
						window.alert("你赢了");
						over = true;

						// alert("测试开始");
						if(confirm("再来一局")){
							location.reload();
						}else{
							location.href="./index.html";
						}
					}
				}
			}

			if(!over){ //如果没有结束，调用函数computerAI
				me = !me; //如果没有结束就将下棋的权利交给计算机
				computerAI();
			}
		}
	}

	//实现计算机自动落子
	var computerAI = function(){
		var myScore = [];
		var computerScore = [];
		var max = 0;
		var u = 0, v = 0;
		for(var i=0;i<15;i++){
			myScore[i] = [];
			computerScore[i] = [];
			for(var j=0;j<15;j++){
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}
		//遍历整个棋盘
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				if(chessBoard[i][j] == 0){ //如果棋盘的某个交叉点没有落子
					for(var k=0;k<count;k++){
						if(wins[i][j][k]){
							if(myWin[k] == 1){
								myScore[i][j] += 200;
							}else if(myWin[k] == 2){
								myScore[i][j] += 400;
							}else if(myWin[k] == 3){
								myScore[i][j] += 2000;
							}else if(myWin[k] == 4){
								myScore[i][j] += 10000;
							}

							if(computerWin[k] == 1){
								computerScore[i][j] += 220;
							}else if(computerWin[k] == 2){
								computerScore[i][j] += 420;
							}else if(computerWin[k] == 3){
								computerScore[i][j] += 2100;
							}else if(computerWin[k] == 4){
								computerScore[i][j] += 20000;
							}
						}
					}
					if(myScore[i][j] > max){
						max = myScore[i][j];
						u = i;
						v = j;
					}else if(myScore[i][j] = max){
						if(computerScore[i][j] > computerScore[u][v]){
							u = i;
							v = j;
						}
					}

					if(computerScore[i][j] > max){
						max = computerScore[i][j];
						u = i;
						v = j;
					}else if(computerScore[i][j] = max){
						if(myScore[i][j] > myScore[u][v]){
							u = i;
							v = j;
						}
					}
				}
			}
		}
		//计算机落子
		oneStep(u,v,false);
		chessBoard[u][v] = 2;
		//更新嬴法统计数组
		for(var k=0;k<count;k++){
			if(wins[u][v][k]){
				computerWin[k]++;
				myWin[k] = 6;
				if(computerWin[k] == 5){
					window.alert("计算机赢了");
					over = true;

					// alert("测试开始");
					if(confirm("再来一局")){
						location.reload();
					}else{
						location.href="./index.html";
					}

				}
			}
		}

		if(!over){ //如果没有结束，调用函数computerAI
			me = !me; //如果没有结束就将下棋的权利交给计算机
		}
	}

	//6.鼠标变换为手型
	chess.onmousemove = function(e){
		chess.style.cursor = "default";
		var x = e.offsetX;
		var y = e.offsetY;
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				var a = x-(15+i*30);
				var b = y-(15+j*30);
				var distance=Math.hypot(a,b);
				var chessRange=Math.sqrt(50,2);
				if(distance < chessRange){
					chess.style.cursor = "pointer";
				}
			}
		}
	}

		} else if(nanyi === 'middle'){
      // 中级难度代码
					var chess = document.getElementById('chess');
					var reset = document.getElementById("reset");
					// var logo = new Image();
					// logo.src = 'image/logo.jpg';
					var context;
					var me; //谁先下
					var isAvailable; //记录棋子是否已经下过了
					var winTactics; //三维数组来统计所有的赢法
					var winCount; //共有多少种赢法
					var myWin; //所有赢法的统计
					var computerWin;
					var over; //游戏是否结束
					var tips; //弹窗的DOM元素

					function init(){  //初始化
						//location.reload();
						me = true;  //黑棋先下
						isAvailable = new Array(15);
						winTactics = [];
						winCount = 0;
						myWin = [];
						computerWin = [];
						over = false; //游戏开始

						context = chess.getContext('2d');
						context.clearRect(0,0,450,450);
						// context.drawImage(logo,0,0,450,450);
						drawChessBoard(); //绘制棋盘
						for(var i=0; i<15; i++){
							isAvailable[i] = new Array(15);
						}
						computeWinTactics();
					}

					function drawChessBoard(){
						context.strokeStyle = '#BFBFBF';
						for (var i = 0; i < 15; i++) {
							context.moveTo(15+30*i,15);
							context.lineTo(15+30*i,435);
							context.stroke();

							context.moveTo(15, 15+30*i);
							context.lineTo(435,15+30*i);
							context.stroke();
						};
					}

					function computeWinTactics() {
						var i, j, k;
						//初始化
						for(i=0;i<15;i++){
							winTactics[i] = [];
							for(j=0;j<15;j++){
								winTactics[i][j] = [];
							}
						}
						//横向
						for(i=0;i<15;i++){
							for(j=0;j<11;j++){
								for(k=0;k<5;k++){
									winTactics[i][j+k][winCount] = true; //第winCount中方法
								}
								winCount++;
							}
						}
						//纵向
						for(i=0;i<15;i++){
							for(j=0;j<11;j++){
								for(k=0;k<5;k++){
									winTactics[j+k][i][winCount] = true; //第winCount中方法
								}
								winCount++;
							}
						}
						//对角线
						for(i=0;i<11;i++){
							for(j=0;j<11;j++){
								for(k=0;k<5;k++){
									winTactics[i+k][j+k][winCount] = true; //第winCount中方法
								}
								winCount++;
							}
						}

						//反对角线
						for(i=0;i<11;i++){
							for(j=4;j<15;j++){
								for(k=0;k<5;k++){
									winTactics[i+k][j-k][winCount] = true; //第winCount中方法
								}
								winCount++;
							}
						}
						//初始化赢法的记录 如果等于5 就实现了 五连子
						for (i = 0; i < winCount; i++) {
							myWin[i] = 0;
							computerWin[i] = 0;
						};
					}

					function oneStep(i, j){
						var x = 15 + i * 30 ;
						var y = 15 + j * 30 ;
						context.lineWidth=0;
						context.beginPath();
						context.arc(x,y,13,0,2*Math.PI);
						context.closePath();
						var gradient = context.createRadialGradient(x+2,y-2,13,x+2,y-2,0);
						if(me){
							gradient.addColorStop(0,"#0A0A0A");
							gradient.addColorStop(1,"#636766");
							isAvailable[i][j] = 1;
						}
						else{
							gradient.addColorStop(0,"#D1D1D1");
							gradient.addColorStop(1,"#F9F9F9");
							isAvailable[i][j] = 2;
						}
						me = !me;
						context.fillStyle = gradient;
						context.fill();
					}

					// logo.onload = function(){
						init();
					// }

					reset.onclick = function(){
						init();
					}

					chess.onclick = function(event){
						if( over ){  //游戏结束，直接返回
							return;
						}
						var x = event.offsetX;
						var y = event.offsetY;
						var i = Math.round((x-15)/30);
						var j = Math.round((y-15)/30);
						if( isAvailable[i][j] ){ //如果这个位置下过了，直接返回
							//alert("下过棋的位置不能再下了，这么简单的规则你都不懂吗~~~~");
							tips = new Dialog();
							tips.open({
								title:"芬芬友情提示",
								content:"下过棋的位置不能再下了，这么简单的规则你都不懂吗~~~~",
								isShowCancel:false,
								okBtnTxt: "我记住啦"
							});
							return;
						}
						oneStep(i, j);
						for (var k = 0; k < winCount; k++) {
							if(winTactics[i][j][k]){
								myWin[k]++;
								computerWin[k] = 6;
								if(myWin[k]==5){
									setTimeout(function(){
										tips = new Dialog();
										tips.open({
											title:"芬芬友情提示",
											content:"你好厉害，你赢了！",
											isShowCancel:true,
											okBtnTxt: "再来一局",
											okBtnFunc:init,
											cancelBtnTxt:"不玩了",
											cancelBtnFunc: leave
										});
									},300);
									over = true;
								}
							}
						};
						if(!over){
							computerStep(); //计算机自动下棋
						}
					}

					function computerStep() {
						var u=0,v=0,maxScore=0;
						var myScore, computerScore;
						for (var i = 0; i < 15; i++) {
							for (var j = 0; j < 15; j++) {
								if( isAvailable[i][j] ){ //如果这个位置下过了，进入下一次循环
									continue;
								}
								myScore = 0;  //i j 黑棋的得分
								computerScore = 0;  //i j 计算机的得分

								for (var k = 0; k < winCount; k++) {
								 	if(winTactics[i][j][k]){
								 		if(myWin[k]==1){
								 			myScore += 200; //权重参数，调整参数可以让计算机是攻击性的还是防守型的。
								 		}
								 		else if(myWin[k]==2){
								 			myScore += 400; //参数只是经验值，并不是最优的值
								 		}
								 		else if(myWin[k]==3){ //分两种情况:如果有白棋存在，权重就小一些。
								 			if(computerWin[k]==1){
								 				myScore += 1500;
								 			}
								 			else{
								 				myScore += 4000;
								 			}
								 		}
								 		else if(myWin[k]==4){
								 			myScore += 6000;
								 		}

								 		if(computerWin[k]==1){
								 			computerScore += 220;
								 		}
								 		else if(computerWin[k]==2){
								 			computerScore += 1000;
								 		}
								 		else if(computerWin[k]==3){
								 			computerScore += 3000;
								 		}
								 		else if(computerWin[k]==4){
								 			computerScore += 20000;
								 		}

								 		if(myScore>maxScore){ //计算机挡住黑棋的去路比较重要
								 			u = i;
								 			v = j;
								 			maxScore = myScore;
								 		}

								 		if(computerScore>maxScore){ //计算机下自己的棋
								 			u = i;
								 			v = j;
								 			maxScore = computerScore;
								 		}
								 	}
								}
							}
						}
						oneStep(u,v);
						for (var k = 0; k < winCount; k++) {
							if(winTactics[u][v][k]){
								computerWin[k]++;
								myWin[k] = 6;
								if(computerWin[k]==5){
									setTimeout(function(){
										tips = new Dialog();
										tips.open({
											title:"友情提示",
											content:"哈哈，阿发家的狗赢了！",
											isShowCancel:true,
											okBtnTxt: "再来一局",
											okBtnFunc:init,
											cancelBtnTxt:"不玩了",
											cancelBtnFunc: leave
										});
									},300);
									over = true;
								}
							}
						};
					}

					//离开游戏
					function leave(){
						tips = new Dialog();
						tips.open({
							title:"友情提示",
							content:"觉得这个项目赞不赞？",
							isShowCancel:true,
							// okBtnTxt: "前往github",
							// okBtnFunc: function(){ location.href = "https://github.com/wufenfen/Five_in_A_Row"; },
							// cancelBtnTxt:"太差劲了",
							// cancelBtnFunc: function(){location.href = "http://qian.163.com/";}
						});
					}


		} else if(nanyi === 'diff'){

		}


	});
})
