////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, instructionContainer, resultContainer, moveContainer, confirmContainer;
var guideline, bg, logo, buttonOk, result, shadowResult, buttonReplay, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.players = {};
$.icons = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	buttonPlayerContainer = new createjs.Container();
	buttonLocalContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	totalPlayersContainer = new createjs.Container();
	playersColorContainer = new createjs.Container();
	playersContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	statusContainer = new createjs.Container();
	boardContainer = new createjs.Container();
	editShapeContainer = new createjs.Container();
	boardShapeContainer = new createjs.Container();
	boardDesignContainer = new createjs.Container();
	boardIconContainer = new createjs.Container();
	boardArrowContainer = new createjs.Container();
	boardUIContainer = new createjs.Container();
	boardNameContainer = new createjs.Container();
	boardAdjustContainer = new createjs.Container();
	particlesContainer = new createjs.Container();
	pathContainer = new createjs.Container();
	pathPlayerContainer = new createjs.Container();
	positionContainer = new createjs.Container();
	homePathContainer = new createjs.Container();
	editContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	bgP = new createjs.Bitmap(loader.getResult('backgroundP'));
	
	logo = new createjs.Bitmap(loader.getResult('logo'));
	logoP = new createjs.Bitmap(loader.getResult('logoP'));

	buttonPlay = new createjs.Bitmap(loader.getResult('buttonPlay'));
	centerReg(buttonPlay);

	buttonLocal = new createjs.Bitmap(loader.getResult('buttonLocal'));
	centerReg(buttonLocal);

	buttonOnline = new createjs.Bitmap(loader.getResult('buttonOnline'));
	centerReg(buttonOnline);

	//players
	itemPlayers = new createjs.Bitmap(loader.getResult('itemPop'));
	itemPlayersP = new createjs.Bitmap(loader.getResult('itemPopP'));

	playersTitleTxt = new createjs.Text();
	playersTitleTxt.font = "60px bpreplaybold";
	playersTitleTxt.color = '#fff';
	playersTitleTxt.textAlign = "center";
	playersTitleTxt.textBaseline='alphabetic';
	playersTitleTxt.text = textDisplay.playersTitle;

	colorPlayerDescTxt = new createjs.Text();
	colorPlayerDescTxt.font = "23px bpreplaybold";
	colorPlayerDescTxt.color = '#fff';
	colorPlayerDescTxt.textAlign = "center";
	colorPlayerDescTxt.textBaseline='alphabetic';
	colorPlayerDescTxt.text = textDisplay.colorPlayersDesc;

	itemColors = new createjs.Bitmap(loader.getResult('itemColors'));
	centerReg(itemColors);

	buttonPlayersL = new createjs.Bitmap(loader.getResult('buttonMinus'));
	centerReg(buttonPlayersL);
	buttonPlayersR = new createjs.Bitmap(loader.getResult('buttonPlus'));
	centerReg(buttonPlayersR);

	buttonVsComputer = new createjs.Bitmap(loader.getResult('buttonVsComputer'));
	centerReg(buttonVsComputer);

	buttonVsPlayers = new createjs.Bitmap(loader.getResult('buttonVsPlayers'));
	centerReg(buttonVsPlayers);

	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);

	//game
	itemStatus = new createjs.Bitmap(loader.getResult('itemStatus'));
	centerReg(itemStatus);

	statusTxt = new createjs.Text();
	statusTxt.font = "30px bpreplaybold";
	statusTxt.color = '#fff';
	statusTxt.textAlign = "center";
	statusTxt.textBaseline='alphabetic';
	statusTxt.y = 11;

	statusContainer.addChild(itemStatus, statusTxt);

	var _frameW = 55;
	var _frameH = 55;
	var _frame = {"regX": _frameW/2, "regY": _frameW/2, "height": _frameH, "count": 6, "width": _frameW};
	var _animations = {animate:{frames: [0,1,2,3,4,5], speed:1}};
						
	diceData = new createjs.SpriteSheet({
		"images": [loader.getResult('itemDice').src],
		"frames": _frame,
		"animations": _animations
	});
	
	diceAnimate = new createjs.Sprite(diceData, "animate");
	diceAnimate.framerate = 20;
	diceAnimate.gotoAndStop(0);

	itemDiceArrow = new createjs.Bitmap(loader.getResult('itemArrow'));
	centerReg(itemDiceArrow);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemPop'));
	itemResultP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "25px bpreplaybold";
	resultShareTxt.color = '#fff';
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "60px bpreplaybold";
	resultTitleTxt.color = '#fff';
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	
	resultDescTxt = new createjs.Text();
	resultDescTxt.font = "75px bpreplaybold";
	resultDescTxt.lineHeight = 35;
	resultDescTxt.color = '#f4e871';
	resultDescTxt.textAlign = "center";
	resultDescTxt.textBaseline='alphabetic';
	resultDescTxt.text = '';
	
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemPop'));
	itemExitP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	
	popTitleTxt = new createjs.Text();
	popTitleTxt.font = "60px bpreplaybold";
	popTitleTxt.color = "#fff";
	popTitleTxt.textAlign = "center";
	popTitleTxt.textBaseline='alphabetic';
	popTitleTxt.text = textDisplay.exitTitle;
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "40px bpreplaybold";
	popDescTxt.lineHeight = 50;
	popDescTxt.color = "#fff";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = textDisplay.exitMessage;
	
	confirmContainer.addChild(itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel);
	confirmContainer.visible = false;

	//room
	roomContainer = new createjs.Container();
	nameContainer = new createjs.Container();

	gameLogsTxt = new createjs.Text();
	gameLogsTxt.font = "20px bpreplaybold";
	gameLogsTxt.color = "#ccc";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.textBaseline='alphabetic';
	gameLogsTxt.text = '';
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	buttonLocalContainer.addChild(buttonLocal, buttonOnline);
	mainContainer.addChild(logo, logoP, buttonPlay, buttonLocalContainer);
	totalPlayersContainer.addChild(itemPlayers, itemPlayersP, playersTitleTxt, itemColors, playersColorContainer, colorPlayerDescTxt, buttonVsComputer, buttonVsPlayers, buttonPlayersL, buttonPlayersR, buttonStart);
	boardUIContainer.addChild(diceAnimate);
	editContainer.addChild(pathContainer, pathPlayerContainer, positionContainer, homePathContainer, editShapeContainer);
	boardAdjustContainer.addChild(boardShapeContainer, boardDesignContainer, boardNameContainer, boardUIContainer, editContainer, boardIconContainer, particlesContainer, boardArrowContainer, itemDiceArrow, statusContainer);
	boardContainer.addChild(boardAdjustContainer);
	gameContainer.addChild(boardContainer);
	
	resultContainer.addChild(itemResult, itemResultP, buttonContinue, resultTitleTxt, resultDescTxt);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, bgP, mainContainer, nameContainer, roomContainer, totalPlayersContainer, playersContainer, gameContainer, gameLogsTxt, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
}

function changeViewport(isLandscape){
	if(isLandscape){
		//landscape
		stageW=landscapeSize.w;
		stageH=landscapeSize.h;
		contentW = landscapeSize.cW;
		contentH = landscapeSize.cH;
	}else{
		//portrait
		stageW=portraitSize.w;
		stageH=portraitSize.h;
		contentW = portraitSize.cW;
		contentH = portraitSize.cH;
	}
	
	gameCanvas.width = stageW;
	gameCanvas.height = stageH;
	
	canvasW=stageW;
	canvasH=stageH;
	
	changeCanvasViewport();
}

function changeCanvasViewport(){
	if(canvasContainer!=undefined){
		boardContainer.x = canvasW/2;
		boardContainer.y = canvasH/2;

		if(viewport.isLandscape){
			bg.visible = true;
			bgP.visible = false;

			logo.visible = true;
			logoP.visible = false;

			buttonPlay.x = (canvasW/2);
			buttonPlay.y = canvasH/100 * 75;

			buttonLocal.x = canvasW/2 - 140;
			buttonLocal.y = canvasH/100 * 75;

			buttonOnline.x = canvasW/2 + 140;
			buttonOnline.y = canvasH/100 * 75;

			//players
			itemPlayers.visible = true;
			itemPlayersP.visible = false;

			playersTitleTxt.x = canvasW/2;
			playersTitleTxt.y = canvasH/100 * 37;
			
			buttonPlayersL.x = canvasW/2 - 200;
			buttonPlayersR.x = canvasW/2 + 200;
			buttonPlayersL.y = buttonPlayersR.y = canvasH/100 * 50;

			playersColorContainer.x = canvasW/2;
			playersColorContainer.y = canvasH/100 * 51;
			itemColors.x = playersColorContainer.x;
			itemColors.y = playersColorContainer.y - 5;

			colorPlayerDescTxt.x = playersColorContainer.x;
			colorPlayerDescTxt.y = playersColorContainer.y + 43;

			buttonVsComputer.x = canvasW/2 - 140;
			buttonVsComputer.y = canvasH/100 * 68;

			buttonVsPlayers.x = canvasW/2 + 140;
			buttonVsPlayers.y = canvasH/100 * 68;

			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 68;

			//game
			
			//result
			itemResult.visible = true;
			itemResultP.visible = false;
			
			buttonFacebook.x = canvasW/100*43;
			buttonFacebook.y = canvasH/100*58;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*58;
			buttonWhatsapp.x = canvasW/100*57;
			buttonWhatsapp.y = canvasH/100*58;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 68;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 53;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 37;

			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 48;
			
			//exit
			itemExit.visible = true;
			itemExitP.visible = false;

			buttonConfirm.x = (canvasW/2) - 140;
			buttonConfirm.y = (canvasH/100 * 68);
			
			buttonCancel.x = (canvasW/2) + 140;
			buttonCancel.y = (canvasH/100 * 68);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 37;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 45;

			//room
			$('#roomWrapper').removeClass('forPortrait');
			$('#notificationHolder').removeClass('forPortrait');
			$('#roomlists').attr('size', 10);
			$('#namelists').attr('size', 10);
			$('#roomLogs').attr('rows', 10);
		}else{
			boardContainer.x = canvasW/2;
			boardContainer.y = canvasH/100 * 50;

			bg.visible = false;
			bgP.visible = true;

			logo.visible = false;
			logoP.visible = true;

			buttonPlay.x = (canvasW/2);
			buttonPlay.y = canvasH/100 * 73;
			
			buttonLocal.x = canvasW/2;
			buttonLocal.y = canvasH/100 * 73;

			buttonOnline.x = canvasW/2;
			buttonOnline.y = canvasH/100 * 85;

			//players
			itemPlayers.visible = false;
			itemPlayersP.visible = true;

			playersTitleTxt.x = canvasW/2;
			playersTitleTxt.y = canvasH/100 * 40;

			buttonVsComputer.x = canvasW/2 - 140;
			buttonVsComputer.y = canvasH/100 * 64;

			buttonVsPlayers.x = canvasW/2 + 140;
			buttonVsPlayers.y = canvasH/100 * 64;

			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 64;
			
			buttonPlayersL.x = canvasW/2 - 200;
			buttonPlayersR.x = canvasW/2 + 200;
			buttonPlayersL.y = buttonPlayersR.y = canvasH/100 * 50;

			playersColorContainer.x = canvasW/2;
			playersColorContainer.y = canvasH/100 * 51;
			itemColors.x = playersColorContainer.x;
			itemColors.y = playersColorContainer.y - 5;

			colorPlayerDescTxt.x = playersColorContainer.x;
			colorPlayerDescTxt.y = playersColorContainer.y + 43;

			//game
			
			//result
			itemResult.visible = false;
			itemResultP.visible = true;
			
			buttonFacebook.x = canvasW/100*39;
			buttonFacebook.y = canvasH/100*56;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*56;
			buttonWhatsapp.x = canvasW/100*61;
			buttonWhatsapp.y = canvasH/100*56;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 64;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 52;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 40;

			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 48;
			
			//exit
			itemExit.visible = false;
			itemExitP.visible = true;

			buttonConfirm.x = (canvasW/2) - 130;
			buttonConfirm.y = (canvasH/100 * 64);
			
			buttonCancel.x = (canvasW/2) + 130;
			buttonCancel.y = (canvasH/100 * 64);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 40;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 48;

			//room
			$('#roomWrapper').addClass('forPortrait');
			$('#notificationHolder').addClass('forPortrait');
			$('#roomlists').attr('size', 8);
			$('#namelists').attr('size', 8);
			$('#roomLogs').attr('rows', 6);
		}
	}
}



/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 65;
		var nextCount = 0;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}

		resizeSocketLog()
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}