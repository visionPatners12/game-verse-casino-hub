////////////////////////////////////////////////////////////
// GAME v1.0
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//players
var players_arr = [
	{src:"assets/player1.png", regX:13, regY:33, dice:"assets/player1_dice.png", color:"#0489B9"},
	{src:"assets/player2.png", regX:13, regY:33, dice:"assets/player2_dice.png", color:"#DA1F29"},
	{src:"assets/player3.png", regX:13, regY:33, dice:"assets/player3_dice.png", color:"#0CA756"},
	{src:"assets/player4.png", regX:13, regY:33, dice:"assets/player4_dice.png", color:"#F5C610"},
	{src:"assets/player5.png", regX:13, regY:33, dice:"assets/player5_dice.png", color:"#F29419"},
	{src:"assets/player6.png", regX:13, regY:33, dice:"assets/player6_dice.png", color:"#C11EB2"},
];

//game settings
var gameSettings = {
	pathBlock:true, //path block rule
	pathSave:true, //path save rule
	pathKick:true, //path kick rule
	autoMove:true, //auto move single piece
	autoRollDice:true, //auto roll dice
	dicePercent:[0,1,2,3,4,5,5,5,5], //dice numbers percent
	maxRoll:3, //total roll turn for dice 6
	instantWin:true, //true to end game when one player won, false for end game when all players won
	moveSpeed:.2, //move speed
	moveScale:1.3, //move jump scale
	kickSpeed:.1, //kick speed
	sortSpeed:.2, //sort speed
	kickFollowPath:false, //true for follow path animation, false for jump animation
	score:[ //final scores
		1000,
		800,
		500,
		200,
		100,
		50
	],
	arrow:{ //icon arrow position
		x:0,
		y:-50,
	},
	stackPos:[ //icon stack position
		{
			scale:.7,
			pos:[
				{x:-8, y:-8},
				{x:8, y:8},
			]
		},
		{
			scale:.7,
			pos:[
				{x:-10, y:-8},
				{x:10, y:-8},
				{x:0, y:8},
			]
		},
		{
			scale:.7,
			pos:[
				{x:-10, y:-8},
				{x:10, y:-8},
				{x:-10, y:8},
				{x:10, y:8},
			]
		},
		{
			scale:.7,
			pos:[
				{x:-10, y:-8},
				{x:10, y:-8},
				{x:-10, y:8},
				{x:10, y:8},
				{x:0, y:0},
			]
		},
		{
			scale:.7,
			pos:[
				{x:-10, y:-8},
				{x:10, y:-8},
				{x:-10, y:8},
				{x:10, y:8},
				{x:0, y:-8},
				{x:0, y:8},
			]
		}
	]
};

//game text display
var textDisplay = {
					playersTitle:'TOTAL PLAYERS',
					colorPlayers:'P[NUMBER]',
					colorPlayersDesc:"*Drag icons to switch colors",
					playerName:'PLAYER [NUMBER]',
					userTurn:'YOUR TURN',
					playerTurn:'[NAME] TURN',
					gameComplete:'GAME COMPLETE',
					playerComplete:'PLAYER [NUMBER] WON!',
					exitTitle:'EXIT GAME',
					exitMessage:'Are you sure you want\nto quit game?',
					share:'SHARE YOUR SCORE:',
					resultSeq:["1ST","2ND","3RD","4TH","5TH","6TH"],
					resultTitle:"GAME OVER",
					resultFinished:"FINISHED [NUMBER]",
					resultPlayer:"PLAYER [NUMBER] WON!",
					resultDesc:'[NUMBER]PTS',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Play Ludo is [SCORE]PTS';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Play Ludo game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, list:[]};
var gameData = {paused:true, moving:false, rolling:false, players:0, playerIndex:0, sequence:[], boardIndex:0, ai:false, aiMove:false, complete:false, arrow:{y:0}, names:[]};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0, playerTimer:0, opponentTimer:0, playerAccumulate:0, opponentAccumulate:0};
var tweenData = {score:0, tweenScore:0};
var protonData = {proton:null, emitter:[]};
var testData = {status:false, dice:[1,5,4,4,4,5,3,1,5,5,5,5,5,5,5,5,5,5,5,5], diceIndex:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	buttonPlay.cursor = "pointer";
	buttonPlay.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			goPage("players");
		}
	});
	

	buttonVsComputer.cursor = "pointer";
	buttonVsComputer.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameVs(true);
	});

	buttonVsPlayers.cursor = "pointer";
	buttonVsPlayers.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameVs(false);
	});

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		goPage("players");
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonPlayersL.cursor = "pointer";
	buttonPlayersL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTotalPlayers(false);
	});

	buttonPlayersR.cursor = "pointer";
	buttonPlayersR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTotalPlayers(true);
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		postSocketUpdate('start');
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	diceAnimate.cursor = "pointer";
	diceAnimate.addEventListener("click", function(evt) {
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(gameData.seqIndex == socketData.gameIndex){
				postSocketUpdate('animatedice');
			}
		}else{
			animateDice();
		}
	});

	gameData.maxPlayers = 0;
	gameData.minPlayers = 2;
	gameData.minColors = players_arr.length;

	for(var n=0; n<boards_arr.length; n++){
		if(gameData.maxPlayers < boards_arr[n].players.length){
			gameData.maxPlayers = boards_arr[n].players.length;
		}
	}

	gameData.players = gameData.minPlayers;
	displayTotalPlayers();
}

/*!
 * 
 * TOGGLE GAME TYPE - This is the function that runs to toggle game type
 * 
 */
function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonPlay.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'default'){
		buttonPlay.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}
}

function checkGameVs(con){
	gameData.ai = con;
	goPage('game');
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonPlay.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

function toggleTotalPlayers(con){
	if(con){
		gameData.players++;
		gameData.players = gameData.players > gameData.maxPlayers ? gameData.maxPlayers : gameData.players;
	}else{
		gameData.players--;
		gameData.players = gameData.players < gameData.minPlayers ? gameData.minPlayers : gameData.players;
	}

	displayTotalPlayers();
}

function displayTotalPlayers(){
	var totalColours = gameData.minColors;
	totalColours = gameData.players > totalColours ? gameData.players : totalColours;

	var draggable = true;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		gameData.players = gameData.totalPlayers;
		if(!socketData.host){
			draggable = false;
		}
	}

	playersColorContainer.removeAllChildren();
	var posData = {x:0, textY:-42, nameY:[40,64], width:0, space:50};
	posData.width = ((totalColours-1) * posData.space)/2;
	posData.x = -(posData.width);

	gameData.colorDrag = {
		minX:posData.x,
		maxX:posData.x + (posData.width * 2),
		array:[]
	}

	for(var n=0; n<totalColours; n++){
		var newIcon = new createjs.Bitmap(loader.getResult('iconPlayer' + n));
		newIcon.regX = players_arr[n].regX;
		newIcon.regY = players_arr[n].regY;
		newIcon.x = newIcon.oriX = posData.x;
		newIcon.colorIndex = n;
		newIcon.moving = false;

		gameData.colorDrag.array.push(newIcon);

		if(draggable){
			newIcon.cursor = "pointer";
			newIcon.addEventListener("mousedown", function(evt) {
				toggleIconDragEvent(evt, 'drag')
			});
			newIcon.addEventListener("pressmove", function(evt) {
				toggleIconDragEvent(evt, 'move')
			});
			newIcon.addEventListener("pressup", function(evt) {
				toggleIconDragEvent(evt, 'drop')
			});
		}

		var newIconPlayer = new createjs.Text();
		var newIconName = new createjs.Text();
		
		if(n<gameData.players){
			newIconPlayer.font = "25px bpreplaybold";
			newIconPlayer.color = "#fff";
			newIconPlayer.textAlign = "center";
			newIconPlayer.textBaseline='alphabetic';
			newIconPlayer.text = textDisplay.colorPlayers.replace("[NUMBER]", n+1);
			newIconPlayer.x = posData.x;
			newIconPlayer.y = posData.textY;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				newIconName.font = "18px bpreplaybold";
				newIconName.color = "#fff";
				newIconName.textAlign = "center";
				newIconName.textBaseline='alphabetic';
				newIconName.text = gameData.names[n];
				newIconName.x = posData.x;
				newIconName.y = posData.nameY[1];
				if(isEven(n)){
					newIconName.y = posData.nameY[0];
				}
			}
		}

		posData.x += posData.space;
		playersColorContainer.addChild(newIcon, newIconPlayer, newIconName);
	}
}

function toggleIconDragEvent(obj, con){
	switch(con){
		case 'drag':
			var global = playersColorContainer.localToGlobal(obj.target.x, obj.target.y);
			obj.target.offset = {x:global.x-(obj.stageX), y:global.y-(obj.stageY)};
			playersColorContainer.setChildIndex(obj.target, playersColorContainer.numChildren-1);
		break;
		
		case 'move':
			var local = playersColorContainer.globalToLocal(obj.stageX, obj.stageY);
			var moveX = ((local.x) + obj.target.offset.x);
			obj.target.x = moveX;
			obj.target.x = obj.target.x <= gameData.colorDrag.minX ? gameData.colorDrag.minX : obj.target.x;
			obj.target.x = obj.target.x >= gameData.colorDrag.maxX ? gameData.colorDrag.maxX : obj.target.x;

			if(!obj.target.moving){
				for(var n=0; n<gameData.colorDrag.array.length; n++){
					var checkIcon = gameData.colorDrag.array[n];
					if(checkIcon != obj.target){
						var thisIconDis = getDistance(obj.target.x, obj.target.y, checkIcon.x, checkIcon.y);
						if(thisIconDis <= 25){
							playSound("soundFlip");
							obj.target.moving = true;
							var lastX = checkIcon.oriX;
							checkIcon.oriX = obj.target.oriX;
							TweenMax.to(checkIcon, .2, {x:checkIcon.oriX, overwrite:true, onComplete:changeIconComplete, onCompleteParams:[obj.target]});
							obj.target.oriX = lastX;

							if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
								if(socketData.host){
									var colorPos = [];
									for(var c=0; c<gameData.colorDrag.array.length; c++){
										var thisIcon = gameData.colorDrag.array[c];
										colorPos.push({x:thisIcon.oriX});
									}
									postSocketUpdate('updateplayers', colorPos, true);
								}
							}
						}
					}
				}
			}
		break;
		
		case 'drop':
			obj.target.x = obj.target.oriX;
		break;
	}
}

function changeIconComplete(icon){
	icon.moving = false;
}

function resizeSocketLog(){
	gameLogsTxt.font = "30px bpreplaybold";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.color = "#ccc";

	if(curPage == 'main'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}
	}else if(curPage == 'players'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 67;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 65;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;

	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	totalPlayersContainer.visible = false;
	playersContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
				socketData.online = false;
			}
			toggleMainButton('default');
			playMusicLoop("musicMain");
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;

		case 'players':
			targetContainer = totalPlayersContainer;

			buttonVsComputer.visible = true;
			buttonVsPlayers.visible = true;
			buttonPlayersL.visible = true;
			buttonPlayersR.visible = true;
			buttonStart.visible = false;
			colorPlayerDescTxt.visible = true;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonVsComputer.visible = false;
				buttonVsPlayers.visible = false;
				buttonPlayersL.visible = false;
				buttonPlayersR.visible = false;
				colorPlayerDescTxt.visible = false;

				if(socketData.host){
					buttonStart.visible = true;
				}
			}

			displayTotalPlayers();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			if(!$.editor.enable){
				playMusicLoop("musicGame");
				stopMusicLoop("musicMain");
			}
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			
			playMusicLoop("musicMain");
			stopMusicLoop("musicGame");
			playSound('soundResult');
			tweenData.tweenScore = 0;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				var showFirstWinner = false;
				var seqIndex = playerData.list.indexOf(gameData.playerIndex);
				var numberSeq = textDisplay.resultSeq[seqIndex];
				resultTitleTxt.text = textDisplay.resultFinished.replace("[NUMBER]",numberSeq);
				playerData.score = gameSettings.score[seqIndex];

				if(gameSettings.instantWin){
					showFirstWinner = true;
				}

				if(showFirstWinner){
					var playerSeq = gameData.sequence.indexOf(playerData.list[0]);
					var numberSeq = textDisplay.resultSeq[seqIndex];
					resultTitleTxt.text = textDisplay.resultPlayer.replace("[NUMBER]",gameData.names[playerSeq]);
					playerData.score = gameSettings.score[0];
				}
				
				if(socketData.host){
					postSocketCloseRoom();
				}
			}else{
				var showFirstWinner = false;
				var seqIndex = playerData.list.indexOf(gameData.playerIndex);
				var numberSeq = textDisplay.resultSeq[seqIndex];
				resultTitleTxt.text = textDisplay.resultFinished.replace("[NUMBER]",numberSeq);
				playerData.score = gameSettings.score[seqIndex];

				if(gameSettings.instantWin){
					if(gameData.ai){
						if(seqIndex == -1){
							resultTitleTxt.text = textDisplay.resultTitle;
							playerData.score = 0;
						}
					}else{
						showFirstWinner = true;
					}
				}else{
					if(!gameData.ai){
						showFirstWinner = true;
					}
				}

				if(showFirstWinner){
					var playerSeq = gameData.sequence.indexOf(playerData.list[0]);
					var numberSeq = textDisplay.resultSeq[seqIndex];
					resultTitleTxt.text = textDisplay.resultPlayer.replace("[NUMBER]",playerSeq+1);
					playerData.score = gameSettings.score[0];
				}
			}

			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', addCommas(Math.floor(tweenData.tweenScore)));
			}});

			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.complete = false;
	gameData.rolling = false;
	gameData.moving = false;

	playerData.score = 0;
	playerData.list = [];

	if(!$.editor.enable){
		playSound("soundStart");
		preparePlayers();
		buildBoard();
	}
}

/*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
	destoryProton();
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * PREPARE PLAYERS - This is the function that runs to prepare players
 * 
 */
function preparePlayers(){
	gameData.seqIndex = 0;
	gameData.sequence = [];
	gameData.paths = [];

	var colorIcons = [];
	for(var n=0; n<gameData.colorDrag.array.length; n++){
		colorIcons.push({icon:gameData.colorDrag.array[n], x:gameData.colorDrag.array[n].x})
	}
	sortOnObject(colorIcons, "x");

	if(!$.editor.enable){
		for(var n=0; n<boards_arr.length; n++){
			if(gameData.players <= boards_arr[n].players.length){
				gameData.boardIndex = n;
				n = boards_arr.length;
			}
		}
	}

	gameData.boards = [];
	for(var n=0; n<boards_arr[gameData.boardIndex].players.length; n++){
		boards_arr[gameData.boardIndex].players[n].index = colorIcons[n].icon.colorIndex;
		gameData.boards.push(-1);
	}

	for(var n=0; n<gameData.players; n++){
		gameData.boards[n] = 1;
		gameData.sequence.push(colorIcons[n].icon.colorIndex);
	}

	if($.editor.enable){
		gameData.boards = [];
		gameData.sequence = []
		for(var n=0; n<boards_arr[gameData.boardIndex].players.length; n++){
			gameData.boards.push(1);
			gameData.sequence.push(colorIcons[n].icon.colorIndex);
		}
	}

	//testing
	//gameData.sequence = [2,0];
	//gameData.boards = [1,-1,1,-1];
}

/*!
 * 
 * BUILD BOARD - This is the function that runs to build board
 * 
 */
function buildBoard(){
	boardShapeContainer.removeAllChildren();
	boardDesignContainer.removeAllChildren();
	boardIconContainer.removeAllChildren();
	boardNameContainer.removeAllChildren();
	boardArrowContainer.removeAllChildren();
	boardUIContainer.removeAllChildren();

	if($.editor.enable){
		var newBoardDesign = new createjs.Bitmap(boardLoader.getResult('boardImage'));
	}else{
		var newBoardDesign = new createjs.Bitmap(loader.getResult('board'+gameData.boardIndex));
	}
	boardDesignContainer.addChild(newBoardDesign);

	boardContainer.scaleX = boardContainer.scaleY = boards_arr[gameData.boardIndex].scale;
	boardAdjustContainer.x = 0 - (newBoardDesign.image.naturalWidth/2);
	boardAdjustContainer.y = 0 - (newBoardDesign.image.naturalHeight/2);
	boardUIContainer.x = boardUIContainer.oriX = boards_arr[gameData.boardIndex].dice.x;
	boardUIContainer.y = boardUIContainer.oriY = boards_arr[gameData.boardIndex].dice.y;

	itemDiceArrow.x = itemDiceArrow.oriX = boardUIContainer.x;
	itemDiceArrow.y = itemDiceArrow.oriY = boardUIContainer.y-40;
	
	statusContainer.x = (newBoardDesign.image.naturalWidth/2);
	statusContainer.y = (newBoardDesign.image.naturalHeight/2);
	statusContainer.alpha = 0;

	//icons
	gameData.icons = [];
	gameData.save = [];

	for(var n=0; n<boards_arr[gameData.boardIndex].players.length; n++){
		var homePos = [];
		for(var p=0; p<boards_arr[gameData.boardIndex].players[n].homePos.length; p++){
			homePos.push(p);
		}
		shuffle(homePos);
		gameData.save.push(boards_arr[gameData.boardIndex].players[n].startIndex);
		gameData.save.push(boards_arr[gameData.boardIndex].players[n].saveIndex);
		
		if(gameData.boards[n] == 1){
			var playerIndex = boards_arr[gameData.boardIndex].players[n].index;
			var playerSeq = gameData.sequence.indexOf(playerIndex);

			var playerName = textDisplay.playerName.replace("[NUMBER]",playerSeq+1);
			$.players["name"+n] = new createjs.Text();
			$.players["name"+n].font = boards_arr[gameData.boardIndex].players[n].name.fontSize+"px bpreplaybold";
			$.players["name"+n].color = boards_arr[gameData.boardIndex].players[n].name.color;
			$.players["name"+n].textAlign = boards_arr[gameData.boardIndex].players[n].name.align;
			$.players["name"+n].textBaseline = 'alphabetic';
			$.players["name"+n].x = boards_arr[gameData.boardIndex].players[n].name.x;
			$.players["name"+n].y = boards_arr[gameData.boardIndex].players[n].name.y;
			$.players["name"+n].rotation = boards_arr[gameData.boardIndex].players[n].name.rotation;
			$.players["name"+n].text = playerName;

			$.players["status"+n] = new createjs.Text();
			$.players["status"+n].font = boards_arr[gameData.boardIndex].players[n].status.fontSize+"px bpreplaybold";
			$.players["status"+n].color = boards_arr[gameData.boardIndex].players[n].status.color;
			$.players["status"+n].textAlign = boards_arr[gameData.boardIndex].players[n].status.align;
			$.players["status"+n].textBaseline = 'alphabetic';
			$.players["status"+n].x = boards_arr[gameData.boardIndex].players[n].status.x;
			$.players["status"+n].y = boards_arr[gameData.boardIndex].players[n].status.y;
			$.players["status"+n].rotation = boards_arr[gameData.boardIndex].players[n].status.rotation;
			$.players["status"+n].visible = false;
			$.players["status"+n].text = textDisplay.playerTurn.replace("[NAME]", playerName);

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				$.players["name"+n].text = gameData.names[playerSeq];
				if(playerSeq == socketData.gameIndex){
					$.players["status"+n].text = textDisplay.userTurn;
				}else{
					$.players["status"+n].text = textDisplay.playerTurn.replace("[NAME]", $.players["name"+n].text);
				}
			}else{
				if(gameData.ai){
					if(playerSeq == 0){
						gameData.playerIndex = playerIndex;
						$.players["status"+n].text = textDisplay.userTurn;
					}	
				}
	
				if($.editor.enable){
					$.players["status"+n].visible = true;
				}
			}
			
			boardNameContainer.addChild($.players["name"+n], $.players["status"+n]);

			gameData.icons.push({index:n, playerIndex:playerIndex, array:[], homePos:homePos, homePosIndex:0});

			$.players["dice"+n] = new createjs.Bitmap(loader.getResult('iconDice'+playerIndex));
			centerReg($.players["dice"+n]);
			$.players["dice"+n].y = 3;
			$.players["dice"+n].visible = false;
			if(playerSeq == 1){
				$.players["dice"+n].visible = true;
			}
			boardUIContainer.addChild($.players["dice"+n]);

			for(var p=0; p<boards_arr[gameData.boardIndex].players[n].startPos.length; p++){
				var newIconArrow = new createjs.Bitmap(loader.getResult('itemArrow'));
				centerReg(newIconArrow);

				var newIcon = new createjs.Bitmap(loader.getResult('iconPlayer' + playerIndex));
				newIcon.regX = players_arr[playerIndex].regX;
				newIcon.regY = players_arr[playerIndex].regY;
				newIcon.x = newIcon.startX = newIcon.oriX = boards_arr[gameData.boardIndex].players[n].startPos[p].x;
				newIcon.y = newIcon.startY = newIcon.oriY =  boards_arr[gameData.boardIndex].players[n].startPos[p].y;
				newIcon.scaleX = newIcon.scaleY =  boards_arr[gameData.boardIndex].players[n].startPos[p].scale;
				newIcon.playerIndex = n;

				newIcon.arrow = newIconArrow;
				newIcon.data = {
					start:true,
					fromStart:false,
					enterHome:false,
					end:false,
					startIndex:boards_arr[gameData.boardIndex].players[n].startIndex,
					homdeIndex:boards_arr[gameData.boardIndex].players[n].homdeIndex,
					pathIndex:boards_arr[gameData.boardIndex].players[n].startIndex,
					homePathIndex:-1
				}
				
				newIcon.cursor = "pointer";
				newIcon.addEventListener("click", function(evt) {
					if(gameData.moving || gameData.rolling){
						return;	
					}

					if(gameData.state != 1){
						return;
					}

					if(!evt.target.arrow.visible){
						return;
					}

					playSound('soundButton');
					if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
						postSocketUpdate('moveicon', {playerIndex:evt.target.playerIndex, iconIndex:evt.target.iconIndex});
					}else{
						moveIcon(evt.target);
					}
				});
				
				positionIconArrow(newIcon);

				boardIconContainer.addChild(newIcon);
				boardArrowContainer.addChild(newIconArrow);
				gameData.icons[n].array.push(newIcon);
				newIcon.iconIndex = gameData.icons[n].array.length-1;
			}
		}else{
			gameData.icons.push({index:n, playerIndex:-1, array:[], homePos:homePos, homePosIndex:0});
		}

		if(boards_arr[gameData.boardIndex].players[n].shape.length > 0){
			var bgShape = new createjs.Shape();
			var bgShapeColor = players_arr[boards_arr[gameData.boardIndex].players[n].index].color;
			bgShape.graphics.beginFill(bgShapeColor).moveTo(boards_arr[gameData.boardIndex].players[n].shape[0].x, boards_arr[gameData.boardIndex].players[n].shape[0].y);
			for(var p=0;p<boards_arr[gameData.boardIndex].players[n].shape.length;p++){
				bgShape.graphics.lineTo(boards_arr[gameData.boardIndex].players[n].shape[p].x, boards_arr[gameData.boardIndex].players[n].shape[p].y);
			}
			boardShapeContainer.addChild(bgShape);
		}
	}

	boardUIContainer.addChild(diceAnimate);

	resetIconArrow();
	animateArrow();
	sortIconsIndex();
	resetPlayerTurn();

	gameData.diceIndex = 0;
	shuffle(gameSettings.dicePercent);

	if(!$.editor.enable){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				postSocketUpdate('ready', gameSettings.dicePercent);
			}
		}else{
			TweenMax.to(boardUIContainer, 1, {overwrite:true, onComplete:buildBoardReady});
		}
	}

	//testing
	if(testData.status){
		for(var n=0; n<gameData.icons.length; n++){
			for(var i=0; i<gameData.icons[n].array.length; i++){
				var thisIcon = gameData.icons[n].array[i];
				if(n == 0){
					if(i == 0){
						thisIcon.data.pathIndex = 0;
						thisIcon.x = thisIcon.oriX = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].x;
						thisIcon.y = thisIcon.oriY = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].y;
						thisIcon.data.start = false;
						updateGamePath(thisIcon);
					}else{
						thisIcon.data.pathIndex = 5;
						thisIcon.x = thisIcon.oriX = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].x;
						thisIcon.y = thisIcon.oriY = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].y;
						thisIcon.data.start = false;
						thisIcon.data.home = false;
						updateGamePath(thisIcon);
					}
				}else if(n == 2){
					if(i == 0){
						thisIcon.data.pathIndex = 2;
						thisIcon.x = thisIcon.oriX = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].x;
						thisIcon.y = thisIcon.oriY = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].y;
						thisIcon.data.start = false;
						updateGamePath(thisIcon);
					}else{
						thisIcon.data.pathIndex = 21;
						thisIcon.x = thisIcon.oriX = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].x;
						thisIcon.y = thisIcon.oriY = boards_arr[gameData.boardIndex].paths[thisIcon.data.pathIndex].y;
						thisIcon.data.start = false;
						thisIcon.data.home = true;
						updateGamePath(thisIcon);
					}
				}
			}
		}
		sortIconsIndex();
	}
}

function buildBoardReady(){
	displayPlayerTurn();
}

/*!
 * 
 * ANIMATE ARROW - This is the function that runs to animate arrow
 * 
 */
function positionIconArrow(icon){
	var thisArrow = icon.arrow;
	thisArrow.x = thisArrow.oriX = icon.x + gameSettings.arrow.x;
	thisArrow.y = thisArrow.oriY = icon.y + gameSettings.arrow.y;
	thisArrow.visible = true;
}

function animateArrow(){
	TweenMax.to(gameData.arrow, .3, {y:0-10, overwrite:true, onComplete:function(){
		TweenMax.to(gameData.arrow, .3, {y:0, overwrite:true, onComplete:function(){
			animateArrow();
		}});	
	}});
}

function loopIconArrow(){
	if($.editor.enable){
		return;
	}

	itemDiceArrow.y = itemDiceArrow.oriY + gameData.arrow.y;
	
	for(var n=0; n<gameData.icons.length; n++){
		for(var i=0; i<gameData.icons[n].array.length; i++){
			var thisIcon = gameData.icons[n].array[i];
			thisIcon.arrow.y = thisIcon.arrow.oriY + gameData.arrow.y;
		}
	}
}

function resetIconArrow(){
	itemDiceArrow.visible = false;

	for(var n=0; n<gameData.icons.length; n++){
		for(var i=0; i<gameData.icons[n].array.length; i++){
			var thisIcon = gameData.icons[n].array[i];
			thisIcon.arrow.x = thisIcon.arrow.oriX;
			thisIcon.arrow.y = thisIcon.arrow.oriY;
			thisIcon.arrow.visible = false;
		}
	}
}

/*!
 * 
 * ANIMATE STATUS - This is the function that runs to animate player status
 * 
 */
function animatePlayerStatus(obj){
	TweenMax.to(obj, .3, {alpha:.3, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .3, {alpha:1, overwrite:true, onComplete:function(){
			animatePlayerStatus(obj);
		}});	
	}});
}

/*!
 * 
 * ANIMATE DICE - This is the function that runs to animate dice
 * 
 */
function animateDice(){
	if(gameData.moving || gameData.rolling){
		return;	
	}

	if(gameData.state != 0){
		return;
	}

	if(testData.status){
		gameData.diceNum = testData.dice[testData.diceIndex];
		testData.diceIndex++;
	}else{
		gameData.diceNum = gameSettings.dicePercent[gameData.diceIndex];
		gameData.diceIndex++;
		if(gameData.diceIndex > gameSettings.dicePercent.length-1){
			gameData.diceIndex = 0;
			shuffle(gameSettings.dicePercent);
		}
	}
	
	playSound('soundDice');
	gameData.rolling = true;
	gameData.totalRoll++;
	resetIconArrow();
	TweenMax.to(diceAnimate, 1, {overwrite:true, onUpdate:runRandomNumber, onComplete:animateDiceComplete});
}

function runRandomNumber(){
	var range = 2;
	var randomX = randomIntFromInterval(-range, range);
	var randomY = randomIntFromInterval(-range, range);
	
	boardUIContainer.x = boardUIContainer.oriX + randomX;
	boardUIContainer.y = boardUIContainer.oriY + randomY;

	var randomNumber = Math.floor(Math.random()*6);
	diceAnimate.gotoAndStop(randomNumber);
}

function animateDiceComplete(){
	boardUIContainer.x = boardUIContainer.oriX;
	boardUIContainer.y = boardUIContainer.oriY;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('animatedicecomplete', socketData.gameIndex);
	}else{
		updateAnimateDiceComplete();
	}
}

function updateAnimateDiceComplete(){
	diceAnimate.gotoAndStop(gameData.diceNum);
	gameData.rolling = false;

	var possibleArr = [];
	var playerIndex = gameData.sequence[gameData.seqIndex];
	var iconIndex = -1;
	
	for(var n=0; n<gameData.icons.length; n++){
		if(gameData.icons[n].playerIndex == playerIndex){
			iconIndex = n;
			for(var i=0; i<gameData.icons[n].array.length; i++){
				var thisIcon = gameData.icons[n].array[i];
				if(thisIcon.data.start){
					if((gameData.diceNum+1) == 6){
						possibleArr.push(thisIcon);
					}
				}else if(thisIcon.data.enterHome){
					if((thisIcon.data.homePathIndex + gameData.diceNum) < boards_arr[gameData.boardIndex].players[thisIcon.playerIndex].homePath.length){
						possibleArr.push(thisIcon);
					}
				}else if(!thisIcon.data.home){
					if(!checkBlocks(thisIcon)){
						possibleArr.push(thisIcon);
					}
				}
			}
		}
	}
	
	var displayArrow = true;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(gameData.seqIndex != socketData.gameIndex){
			displayArrow = false;
		}
	}

	if(displayArrow){
		for(var n=0; n<possibleArr.length; n++){
			var thisIcon = possibleArr[n];
			positionIconArrow(thisIcon);
		}
	}

	if(possibleArr.length == 0){
		playSound("soundError");
		nextPlayer();
	}else{
		$.players["status"+iconIndex].visible = true;
		animatePlayerStatus($.players["status"+iconIndex]);

		gameData.state = 1;
		gameData.moveCount = 0;
		gameData.moveFirst = true;

		if((gameData.diceNum+1) == 6){
			playSound("soundExtra");
		}

		if(gameData.ai && gameData.playerIndex != playerIndex){
			shuffle(possibleArr);
			moveIcon(possibleArr[0]);
		}else{
			if(possibleArr.length == 1 && gameSettings.autoMove){
				moveIcon(possibleArr[0]);
			}
		}
	}
}

/*!
 * 
 * CHECK BLOCK PATH - This is the function that runs to check block path
 * 
 */
function checkBlocks(icon){
	var isBlock = false;
	if(gameSettings.pathBlock){
		for(var n=0; n<gameData.paths.length; n++){
			var iconIndex = gameData.paths[n].icons.indexOf(icon);
			if(iconIndex == -1){
				if(!gameData.paths[n].enterHome && gameData.paths[n].icons.length > 1){
					var isSamePlayer = true;
					var lastPlayerIndex = -1;
					for(var i=gameData.paths[n].icons.length-1; i>=0; i--){
						var thisIcon = gameData.paths[n].icons[i];
						if(lastPlayerIndex == -1){
							lastPlayerIndex = thisIcon.playerIndex;
						}else if(lastPlayerIndex != thisIcon.playerIndex){
							isSamePlayer = false;
						}
					}

					if(isSamePlayer && thisIcon.playerIndex != icon.playerIndex){
						var pathIndex = gameData.paths[n].index;
						var iconPathIndex = icon.data.pathIndex;

						var diceNum = gameData.diceNum;
						for(var d=0; d<=diceNum; d++){
							iconPathIndex++;
							iconPathIndex = iconPathIndex > boards_arr[gameData.boardIndex].paths.length-1 ? 0 : iconPathIndex;

							if(iconPathIndex == pathIndex){
								isBlock = true;
							}
						}
					}
				}
			}
		}
	}

	return isBlock;
}

/*!
 * 
 * NEXT PLAYER - This is the function that runs to change player
 * 
 */
function nextPlayer(){
	gameData.seqIndex++;
	if(gameData.seqIndex > gameData.sequence.length-1){
		gameData.seqIndex = 0;
	}

	hidePlayerTurn();
	if(gameData.sequence.length - playerData.list.length == 1){
		proceedNextPlayer();
	}else{
		TweenMax.to(boardUIContainer, 1, {overwrite:true, onComplete:proceedNextPlayer});
	}
}

function proceedNextPlayer(){
	resetPlayerTurn();
	displayPlayerTurn();
}

/*!
 * 
 * SORT PATH ICONS - This is the function that runs to sort path icons
 * 
 */
function sortPathIcons(pathIndex, enterHome){
	for(var n=0; n<gameData.paths.length; n++){
		var proceedCheck = false;
		if(pathIndex == undefined){
			proceedCheck = true;
		}else{
			if(pathIndex == gameData.paths[n].index && enterHome == gameData.paths[n].enterHome){
				proceedCheck = true;
			}
		}

		if(proceedCheck){
			var sortCon = false;
			if(gameData.paths[n].icons.length != 1){
				var proceedPos = false;
				for(var p=0; p<gameSettings.stackPos.length; p++){
					if(gameSettings.stackPos[p].pos.length == gameData.paths[n].icons.length){
						proceedPos = true;
					}else if(p == gameSettings.stackPos.length-1 && !proceedPos){
						proceedPos = true;
					}

					if(proceedPos){
						var stackPosCount = 0;
						for(var i=0; i<gameData.paths[n].icons.length; i++){

							var thisIcon = gameData.paths[n].icons[i];
							var moveX = thisIcon.oriX + gameSettings.stackPos[p].pos[stackPosCount].x;
							var moveY = thisIcon.oriY + gameSettings.stackPos[p].pos[stackPosCount].y;
							var scale = gameSettings.stackPos[p].scale;

							stackPosCount++;
							stackPosCount = stackPosCount > gameSettings.stackPos[p].pos.length-1 ? 0 : stackPosCount;

							TweenMax.to(thisIcon, gameSettings.sortSpeed, {x:moveX, y:moveY, scaleX:scale, scaleY:scale, overwrite:true, onComplete:function(){
								sortIconsIndex();
							}});
							sortCon = true;
						}

						p = gameSettings.stackPos.length;
					}
				}
			}

			if(!sortCon){
				var thisIcon = gameData.paths[n].icons[0];
				var moveX = thisIcon.oriX;
				var moveY = thisIcon.oriY;
				var scale = 1;

				TweenMax.to(thisIcon, gameSettings.sortSpeed, {x:moveX, y:moveY, scaleX:scale, scaleY:scale, overwrite:true, onComplete:function(){
					sortIconsIndex();
				}});
				sortCon = true;
			}
		}
	}
}

/*!
 * 
 * CHECK KICK PLAYER - This is the function that runs to check kick player
 * 
 */
function checkKickPlayer(icon){
	var isKick = false;
	if(gameSettings.pathKick){
		for(var n=0; n<gameData.paths.length; n++){
			var iconIndex = gameData.paths[n].icons.indexOf(icon);
			if(iconIndex != -1){
				var saveIndex = -1;
				if(gameSettings.pathSave){
					saveIndex = gameData.save.indexOf(icon.data.pathIndex);
				}

				if(saveIndex == -1 && gameData.paths[n].icons.length == 2 && !gameData.paths[n].enterHome){
					var lastPlayerIndex = -1;
					for(var i=gameData.paths[n].icons.length-1; i>=0; i--){
						var thisIcon = gameData.paths[n].icons[i];
						if(lastPlayerIndex == -1){
							lastPlayerIndex = thisIcon.playerIndex;
						}else if(lastPlayerIndex != thisIcon.playerIndex){
							kickPlayer(thisIcon);
							isKick = true;
						}
					}
				}
			}
		}
	}

	return isKick;
}

function kickPlayer(icon){
	playSound("soundKick");
	playSound("soundKickAlert");

	icon.data.start = true;
	updateGamePath(icon);

	if(gameSettings.kickFollowPath){
		var pathArray = [];
		var currentPathIndex = icon.data.pathIndex;
		for(var n=0; n<boards_arr[gameData.boardIndex].paths.length; n++){
			currentPathIndex--;
			currentPathIndex = currentPathIndex < 0 ? boards_arr[gameData.boardIndex].paths.length-1 : currentPathIndex;
			pathArray.push({x:boards_arr[gameData.boardIndex].paths[currentPathIndex].x, y:boards_arr[gameData.boardIndex].paths[currentPathIndex].y});
			if(currentPathIndex == icon.data.startIndex){
				n = boards_arr[gameData.boardIndex].paths.length;
			}
		}
		pathArray.push({x:icon.startX, y:icon.startY});

		var tweenSpeed = pathArray.length * gameSettings.kickSpeed;
		TweenMax.to(icon, tweenSpeed, {bezier:{type:"thru", values:pathArray, curviness:0, autoRotate:false}, ease:Linear.easeNone, repeat:0, overwrite:true, onStart:function(){
				boardIconContainer.setChildIndex(icon, boardIconContainer.numChildren-1);
			}, onComplete:function(){
				moveIconComplete();
		}});

	}else{
		var centerPos = getCenterPosition(icon.x, icon.y, icon.startX, icon.startY);
		var jumpTweenSpeed = gameSettings.kickSpeed;

		icon.scaleX = icon.scaleY = 1;
		var oriScaleX = icon.scaleX;
		var oriScaleY = icon.scaleY;
		var jumpScaleX = icon.scaleX < 0 ? -gameSettings.moveScale : gameSettings.moveScale;
		var jumpScaleY = icon.scaleY < 0 ? -gameSettings.moveScale : gameSettings.moveScale;
		var moveX = icon.startX;
		var moveY = icon.startY;

		TweenMax.to(icon, jumpTweenSpeed, {x:centerPos.x, y:centerPos.y, scaleX:jumpScaleX, scaleY:jumpScaleY, ease:Sine.easeIn, overwrite:true, onComplete:function(){
			TweenMax.to(icon, jumpTweenSpeed, {x:moveX, y:moveY, scaleX:oriScaleX, scaleY:oriScaleY, overwrite:true, ease:Sine.easeOut, onStart:function(){
				boardIconContainer.setChildIndex(icon, boardIconContainer.numChildren-1);
			}, onComplete:function(){
				moveIconComplete();
			}});
		}});
	}
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display player turn
 * 
 */
function displayPlayerTurn(){
	//reset
	hidePlayerTurn();

	var playerIndex = gameData.sequence[gameData.seqIndex];
	var canRoll = false;
	var iconCompleteTotal = 0;
	var iconCompleteCount = 0;

	for(var n=0; n<gameData.icons.length; n++){
		if(gameData.icons[n].playerIndex != -1){
			var totalPlayerIconComplete = 0;
			for(var i=0; i<gameData.icons[n].array.length; i++){
				var thisIcon = gameData.icons[n].array[i];
				if(thisIcon.data.home){
					totalPlayerIconComplete++;
					iconCompleteCount++;
				}
				iconCompleteTotal++;
			}

			if(totalPlayerIconComplete == gameData.icons[n].array.length){
				if(playerData.list.indexOf(gameData.icons[n].playerIndex) == -1){
					playerData.list.push(gameData.icons[n].playerIndex);
				}
			}
		}
	}

	if(gameSettings.instantWin && playerData.list.length == 1){
		endGame();
	}else if(iconCompleteCount == iconCompleteTotal){
		endGame();
	}else{
		var iconIndex = -1;
		for(var n=0; n<gameData.icons.length; n++){
			if(gameData.icons[n].playerIndex == playerIndex){
				iconIndex = n;
				for(var i=0; i<gameData.icons[n].array.length; i++){
					var thisIcon = gameData.icons[n].array[i];
					if(thisIcon.data.start || thisIcon.data.enterHome){
						canRoll = true;
					}else if(!thisIcon.data.home){
						canRoll = true;
					}
				}
			}
		}
		
		if(canRoll){
			for(var n=0; n<gameData.icons.length; n++){
				if(gameData.icons[n].playerIndex != -1){
					$.players["dice"+n].visible = false;
				}
			}

			gameData.state = 0;
			$.players["status"+iconIndex].visible = true;
			$.players["dice"+iconIndex].visible = true;

			animatePlayerStatus($.players["status"+iconIndex]);
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(gameSettings.autoRollDice){
					postSocketUpdate('autoanimatedice', socketData.gameIndex);
				}else{
					if(gameData.seqIndex == socketData.gameIndex){
						itemDiceArrow.visible = true;
					}
				}
			}else{
				itemDiceArrow.visible = true;
				if(gameData.ai && gameData.playerIndex != playerIndex){
					animateDice();
				}else if(gameSettings.autoRollDice){
					animateDice();
				}
			}
		}else{
			nextPlayer();
		}
	}
}

function hidePlayerTurn(){
	for(var n=0; n<gameData.sequence.length; n++){
		var playerIndex = n;
		$.players["status"+playerIndex].visible = false;
		TweenMax.killTweensOf($.players["status"+playerIndex]);
	}
}

function resetPlayerTurn(){
	gameData.totalRoll = 0;
}

/*!
 * 
 * MOVE ICON - This is the function that runs to move icon
 * 
 */
function moveIcon(icon){
	resetIconArrow();
	gameData.moving = true;

	var moveX, moveY, endScale;
	var moveCount = 0;
	var thisPathIndex = icon.data.pathIndex;
	if(icon.data.start){
		var startIndex = icon.data.startIndex;
		moveX = boards_arr[gameData.boardIndex].paths[startIndex].x;
		moveY = boards_arr[gameData.boardIndex].paths[startIndex].y;
		moveCount = 1;
		icon.oriX = moveX;
		icon.oriY = moveY;
		icon.data.pathIndex = startIndex;
		icon.data.start = false;
		icon.data.fromStart = true;
		updateGamePath(icon);
	}else if(icon.data.pathIndex == icon.data.homdeIndex || icon.data.enterHome){
		icon.data.enterHome = true;
		var homePathIndex = icon.data.homePathIndex;
		thisPathIndex = icon.data.homePathIndex;

		homePathIndex++;
		if(homePathIndex < boards_arr[gameData.boardIndex].players[icon.playerIndex].homePath.length){
			moveX = boards_arr[gameData.boardIndex].players[icon.playerIndex].homePath[homePathIndex].x;
			moveY = boards_arr[gameData.boardIndex].players[icon.playerIndex].homePath[homePathIndex].y;
		}else{
			var homePosIndex = gameData.icons[icon.playerIndex].homePos[gameData.icons[icon.playerIndex].homePosIndex];
			gameData.icons[icon.playerIndex].homePosIndex++;

			moveX = boards_arr[gameData.boardIndex].players[icon.playerIndex].homePos[homePosIndex].x;
			moveY = boards_arr[gameData.boardIndex].players[icon.playerIndex].homePos[homePosIndex].y;
			endScale = boards_arr[gameData.boardIndex].players[icon.playerIndex].homePos[homePosIndex].scale;

			icon.data.enterHome = false;
			icon.data.home = true;
		}

		moveCount = gameData.diceNum+1;
		icon.oriX = moveX;
		icon.oriY = moveY;
		icon.data.homePathIndex = homePathIndex;
		updateGamePath(icon);
	}else{
		var pathIndex = icon.data.pathIndex;
		pathIndex++;
		pathIndex = pathIndex > boards_arr[gameData.boardIndex].paths.length-1 ? 0 : pathIndex;
		moveX = boards_arr[gameData.boardIndex].paths[pathIndex].x;
		moveY = boards_arr[gameData.boardIndex].paths[pathIndex].y;
		moveCount = gameData.diceNum+1;
		icon.oriX = moveX;
		icon.oriY = moveY;
		icon.data.pathIndex = pathIndex;
		icon.data.fromStart = false;
		updateGamePath(icon);
	}

	if(gameData.moveFirst){
		gameData.moveFirst = false;
		gameData.moveCount = moveCount;
	}

	var centerPos = getCenterPosition(icon.x, icon.y, moveX, moveY);
	var jumpTweenSpeed = gameSettings.moveSpeed;

	icon.scaleX = icon.scaleY = 1;
	var oriScaleX = icon.scaleX;
	var oriScaleY = icon.scaleY;
	var jumpScaleX = icon.scaleX < 0 ? -gameSettings.moveScale : gameSettings.moveScale;
	var jumpScaleY = icon.scaleY < 0 ? -gameSettings.moveScale : gameSettings.moveScale;
	if(endScale != undefined){
		oriScaleX = endScale;
		oriScaleY = endScale;
	}

	TweenMax.to(icon, jumpTweenSpeed, {x:centerPos.x, y:centerPos.y, scaleX:jumpScaleX, scaleY:jumpScaleY, ease:Sine.easeIn, overwrite:true, onComplete:function(){
		TweenMax.to(icon, jumpTweenSpeed, {x:moveX, y:moveY, scaleX:oriScaleX, scaleY:oriScaleY, overwrite:true, ease:Sine.easeOut, onStart:function(){
			boardIconContainer.setChildIndex(icon, boardIconContainer.numChildren-1);
			if(!icon.data.fromStart){
				sortPathIcons(thisPathIndex, icon.data.enterHome);
			}
		}, onComplete:function(){
			if(icon.data.home){
				playSound("soundEnd");
				createParticles(icon);
			}

			sortIconsIndex();
			gameData.moveCount--;
			
			if(gameData.moveCount > 0){
				playSound("soundDrop");
				moveIcon(icon);
			}else{
				if(gameData.save.indexOf(icon.data.pathIndex) != -1 && !icon.data.fromStart && gameSettings.pathSave){
					playSound("soundSafe");
				}

				if(!checkKickPlayer(icon)){
					moveIconComplete();
				}
			}
		}});
	}});
}

function moveIconComplete(){
	gameData.moving = false;
	playSound("soundDrop");
	sortPathIcons();

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('movecomplete', socketData.gameIndex);
	}else{
		prepareNextPlayer();
	}
}

function prepareNextPlayer(){
	if(gameData.totalRoll < gameSettings.maxRoll && (gameData.diceNum+1) == 6){
		displayPlayerTurn();
	}else{
		nextPlayer();
	}
}

/*!
 * 
 * UPDATE GAME PATH - This is the function that runs to update game path
 * 
 */
function updateGamePath(icon){
	//remove
	for(var n=0; n<gameData.paths.length; n++){
		var iconIndex = gameData.paths[n].icons.indexOf(icon);
		if(iconIndex != -1){
			gameData.paths[n].icons.splice(iconIndex,1);
			if(gameData.paths[n].icons.length == 0){
				gameData.paths.splice(n,1);
			}
		}
	}

	//insert
	var isNew = true;
	var thisPathIndex;
	for(var n=0; n<gameData.paths.length; n++){
		var iconPathIndex = icon.data.enterHome == true ? icon.data.homePathIndex : icon.data.pathIndex;
		if(gameData.paths[n].index == iconPathIndex && gameData.paths[n].enterHome == icon.data.enterHome){
			isNew = false;
			thisPathIndex = n;
		}
	}

	if(!icon.data.start && !icon.data.home){
		if(isNew){
			var iconPathIndex = icon.data.enterHome == true ? icon.data.homePathIndex : icon.data.pathIndex;
			gameData.paths.push({index:iconPathIndex, enterHome:icon.data.enterHome, icons:[]});
			thisPathIndex = gameData.paths.length-1;
			gameData.paths[thisPathIndex].icons.push(icon);
		}else{
			gameData.paths[thisPathIndex].icons.push(icon);
		}
	}
}

/*!
 * 
 * CREATE PROTON - This is the function that runs to create proton particles
 * 
 */
function createParticles(icon) {
	if(protonData.proton == null){
		protonData.proton = new Proton();

		var renderer = new Proton.EaselRenderer(particlesContainer);
		protonData.proton.addRenderer(renderer);
	}

	var newProton = new Proton.Emitter();
	newProton.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.01, .015));
	
	var textures = new createjs.Shape();
	textures.graphics.beginFill("#fff").drawCircle(0, 0, 5);
	var textures = [];
	for(var p = 0; p<6; p++){
		var newParticle = new createjs.Bitmap(loader.getResult('itemShine'+(p+1)));
		centerReg(newParticle);
		textures.push(newParticle);
	}

	newProton.addInitialize(new Proton.Mass(1));
	newProton.addInitialize(new Proton.Life(0, 1));
	newProton.addInitialize(new Proton.Body(textures));
	newProton.addInitialize(new Proton.Velocity(new Proton.Span(1, 2), new Proton.Span(0, 20, true), 'polar'));
	
	newProton.addBehaviour(new Proton.Alpha(1, 0));
	newProton.addBehaviour(new Proton.Scale(.5, 1));
	newProton.addBehaviour(new Proton.RandomDrift(5, 0, .15));
	newProton.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span([-10, -5, 5, 15, 10]), 'add'));

	newProton.emit(5);
	protonData.proton.addEmitter(newProton);

	var thisEmitter = newProton.p;
	thisEmitter.x = icon.x;
	thisEmitter.y = icon.y;

	var destroySpeed = 2;
	var size = 30 * 1.3;
	var path = [
		{x:icon.x, y:icon.y-size},
		{x:icon.x+size, y:icon.y},
		{x:icon.x, y:icon.y+size},
		{x:icon.x-size, y:icon.y},
		{x:icon.x, y:icon.y-size},
	];

	thisEmitter.x = path[0].x;
	thisEmitter.y = path[0].y;
	TweenMax.to(thisEmitter, .3, {bezier:{curviness:1.5, values:path}, ease:Linear.easeNone, overwrite:true, onComplete:function(){
		thisEmitter.x = icon.x;
		thisEmitter.y = icon.y;
		TweenMax.to(thisEmitter, .2, {x:icon.x, y:icon.y, overwrite:true, onComplete:function(){
			newProton.addInitialize(new Proton.Life(0, 0));
			TweenMax.to(thisEmitter, destroySpeed, {overwrite:true, onComplete:function(){
				newProton.destroy();
			}})
		}})
	}})
}

function destoryProton(){
	if(protonData.proton){
		protonData.proton.destroy();
	}
	particlesContainer.removeAllChildren();
}

function loopParticles(){
	if (protonData.proton) {
		protonData.proton.update();
	}
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		loopIconArrow();
		loopParticles();
	}
}

function sortIconsIndex(){
	boardIconContainer.sortChildren(sortFunction);
}

var sortFunction = function(obj1, obj2, options) {
	if (obj1.y > obj2.y) { return 1; }
	if (obj1.y < obj2.y) { return -1; }
	return 0;
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	var delay = 2;
	if(con == 'gamecomplete'){
		statusTxt.text = textDisplay.gameComplete;
	}else if(con == 'playercomplete'){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			var playerSeq = gameData.sequence.indexOf(playerData.list[0]);
			statusTxt.text = textDisplay.playerComplete.replace("[NUMBER]", gameData.names[playerSeq]);
		}else{
			var playerSeq = gameData.sequence.indexOf(playerData.list[0]);
			statusTxt.text = textDisplay.playerComplete.replace("[NUMBER]", Number(playerSeq+1));
		}
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(statusContainer, .5, {delay:delay, alpha:0, overwrite:true});
	}});
}

/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	TweenMax.to(gameContainer, 1, {overwrite:true, onComplete:function(){
		if(gameSettings.instantWin){
			showGameStatus("playercomplete");
		}else{
			showGameStatus("gamecomplete");
		}
		playSound("soundComplete");

		TweenMax.to(gameContainer, 3, {overwrite:true, onComplete:function(){
			gameData.paused = true;
			goPage('result')
		}});
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}