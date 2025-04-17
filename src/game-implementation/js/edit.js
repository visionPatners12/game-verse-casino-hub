////////////////////////////////////////////////////////////
// EDIT TRACKS
////////////////////////////////////////////////////////////
var editData = {
					show:true,
					pathNum:0,
					homePathNum:0,
					shapePathNum:0,
					actionNum:0,
					editPath:null,
					editPathShape:null, 
					editPathShapeColour:'#00D9D9', 
					editPathColour:'yellow', 
					editPathWidth:15, 
					pathColour:'#80FF00', 
					pathWidth:6,
					playerNum:0,
					positionNum:0,
					editShapeAlpha:.5,
					editShapeStroke:2,
					editShapeLine:"#333",
					editShapeFill:"#ccff00",
					editShapeDotWidth:8,
					editShapeDotColor:"#e87f05",
					editShapeDotFocusColor:"#ccff00",
					editShapeStart:"#c23825",
					editShapeEnd:"#e64595",
					editShapeDotAlpha:.5
				};

var editDot, editShape, editShapeAll;

$.pathDots = {};
var boardLoader, boardFileFest;

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	$.editor.enable = true;
});

function loadEditPage(){
	$.get('editTools.html', function(data){
		$('body').prepend(data);
		$('#editWrapper').show();
		toggleEditOption();
		buildEditButtons();
		buttonExit.visible = false;
	});		
}

/*!
 * 
 * BUILD EDIT BUTTONS - This is the function that runs to build edit buttons
 * 
 */
function buildEditButtons(){
	//boards list
	gameData.boardIndex = 0;
	buildBoardDropdown();
	
	$('#toggleShowOption').click(function(){
		toggleShowOption();
	});
	
	$("#boardslist").change(function() {
		if($(this).val() != ''){
			gameData.boardIndex = $(this).val();
			toggleEditOption();
			loadBoardData();
		}
	});
	
	$('#prevBoard').click(function(){
		toggleBoard(false);
	});
	
	$('#nextBoard').click(function(){
		toggleBoard(true);
	});
	
	$('#addBoard').click(function(){
		actionBoard('new');
	});
	
	$('#removeBoard').click(function(){
		actionBoard('remove');
	});
	
	$('#moveBoardUp').click(function(){
		actionBoard('moveup');
	});
	
	$('#moveBoardDown').click(function(){
		actionBoard('movedown');
	});
	
	$('#editBoard').click(function(){
		toggleEditOption('board', true);
	});

	$('#editPlayers').click(function(){
		toggleEditOption('players');
	});
	
	$('#boardBack').click(function(){
		toggleEditOption();
	});
	
	$('#updateImage').click(function(){
		boards_arr[gameData.boardIndex].image = $('#image').val();
		boards_arr[gameData.boardIndex].scale = Number($('#boardScale').val());
		boards_arr[gameData.boardIndex].dice.x = Number($('#diceX').val());
		boards_arr[gameData.boardIndex].dice.y = Number($('#diceY').val());
		
		preparePlayers();
		loadBoardAssets();
	});
	
	$('#editPath').click(function(){
		toggleEditOption('path', true);
	});
	
	//paths
	$('#prevPath').click(function(){
		togglePath(false);
	});
	
	$('#nextPath').click(function(){
		togglePath(true);
	});
	
	editData.pathNum = 0;
	buildPathDropdown();
	$("#pathlist").change(function() {
		if($(this).val() != ''){
			editData.pathNum = $(this).val();
			loadPathData();
		}
	});
	
	$('#removePath').click(function(){
		actionPath('remove');
	});
	
	$('#movePathUp').click(function(){
		actionPath('moveup');
	});
	
	$('#movePathDown').click(function(){
		actionPath('movedown');
	});
	
	$('#updatePath').click(function(){
		updatePathDot();
	});
	
	$('#pathBack').click(function(){
		toggleEditOption();
	});

	//players
	$("#playerslist").change(function() {
		if($(this).val() != ''){
			editData.playerNum = $(this).val();
			loadPlayerData();
		}
	});
	
	$('#prevPlayer').click(function(){
		togglePlayers(false);
	});
	
	$('#nextPlayer').click(function(){
		togglePlayers(true);
	});
	
	$('#addPlayer').click(function(){
		actionPlayer('new');
	});
	
	$('#removePlayer').click(function(){
		actionPlayer('remove');
	});

	$("#pathindexlist").change(function() {
		loadPlayerData();
	});

	$('#editStartHomePosition').click(function(){
		toggleEditOption('position');
	});

	$('#editHomePath').click(function(){
		toggleEditOption('homepath');
	});

	$('#editPlayerName').click(function(){
		toggleEditOption('font');
	});

	$('#editPlayerShape').click(function(){
		toggleEditOption('shape');
	});

	$('#updatePlayer').click(function(){
		updatePlayerData();
	});

	$('#playerBack').click(function(){
		toggleEditOption();
	});

	//position
	$("#positiontypelist").change(function() {
		if($(this).val() != ''){
			editData.positionNum = 0;
			buildPositionDropdown();
		}
	});

	$("#positionlist").change(function() {
		if($(this).val() != ''){
			editData.positionNum = $(this).val();
			loadPositionData();
		}
	});

	$('#prevPos').click(function(){
		togglePosition(false);
	});
	
	$('#nextPos').click(function(){
		togglePosition(true);
	});

	$('#removePosition').click(function(){
		actionPosition('remove');
	});
	
	$('#updatePosition').click(function(){
		updatePositionDot();
	});
	
	$('#positionBack').click(function(){
		toggleEditOption('players');
	});

	//homepath
	editData.homePathNum = 0;
	buildHomePathDropdown();
	$("#homepathlist").change(function() {
		if($(this).val() != ''){
			editData.homePathNum = $(this).val();
			loadHomePathData();
		}
	});

	$('#prevHomePath').click(function(){
		toggleHomePath(false);
	});
	
	$('#nextHomePath').click(function(){
		toggleHomePath(true);
	});
	
	$('#removeHomePath').click(function(){
		actionHomePath('remove');
	});

	$('#updateHomePath').click(function(){
		updateHomePathDot();
	});
	
	$('#homePathBack').click(function(){
		toggleEditOption('players');
	});

	//font
	$("#nametypelist").change(function() {
		if($(this).val() != ''){
			loadFontData();
		}
	});

	$('#updateFont').click(function(){
		updateFontData();
	});
	
	$('#fontBack').click(function(){
		toggleEditOption('players');
	});

	//shape
	$('#removePoint').click(function(){
		actionDrawingPoint('remove');
	});

	$('#shapeBack').click(function(){
		buildBoard();
		toggleEditOption('players');
	});
	
	//generate
	$('#generateArray').click(function(){
		generateArray();
	});
	
	stage.addEventListener("dblclick", function(evt) {
		if(editData.option == 'path'){
			actionPath('new');
		}else if(editData.option == 'position'){
			actionPosition('new');
		}else if(editData.option == 'homepath'){
			actionHomePath('new');
		}else if(editData.option == 'shape'){
			actionDrawingPoint('new');
		}
	});
}

/*!
 * 
 * TOGGLE DISPLAY OPTION - This is the function that runs to toggle display option
 * 
 */
 
function toggleShowOption(){
	if(editData.show){
		editData.show = false;
		$('#editOption').hide();
		$('#toggleShowOption').val('Show Edit Option');
	}else{
		editData.show = true;
		$('#editOption').show();
		$('#toggleShowOption').val('Hide Edit Option');
	}
}

/*!
 * 
 * TOGGLE EDIT OPTION - This is the function that runs to toggle edit option
 * 
 */
function toggleEditOption(con, update){
	editData.option = con;
	
	$('#editBoardWrapper').hide();
	$('#boardEditWrapper').hide();
	$('#pathEditWrapper').hide();
	$('#playersEditWrapper').hide();
	$('#playersDetailsEditWrapper').hide();
	$('#positionEditWrapper').hide();
	$('#homePathEditWrapper').hide();
	$('#nameEditWrapper').hide();
	$('#shapeEditWrapper').hide();

	pathContainer.visible = false;
	pathPlayerContainer.visible = false;
	positionContainer.visible = false;
	homePathContainer.visible = false;
	boardIconContainer.visible = true;

	boardShapeContainer.visible = true;
	editShapeContainer.visible = false;
	
	if(editData.editPathShape != null){
		editData.editPathShape.graphics.clear();	
	}
	
	if(con == 'board'){
		$('#boardEditWrapper').show();
	}else if(con == 'path'){
		$('#pathEditWrapper').show();
		pathContainer.visible = true;
		boardIconContainer.visible = false;

		if(update){
			editData.pathNum = 0;
			buildPathDropdown();
		}else{
			buildPathDots();
			loadPathData();
			drawPathEdit();
		}
	}else if(con == 'players'){
		$('#playersEditWrapper').show();
		$('#playersDetailsEditWrapper').show();
		pathContainer.visible = true;
		
		//path
		buildPathDots();
		loadPathData();
		drawPathEdit();

		//players
		loadPlayerData();
	}else if(con == 'position'){
		$('#playersEditWrapper').show();
		$('#positionEditWrapper').show();
		positionContainer.visible = true;
		boardIconContainer.visible = false;

		editData.positionNum = 0;
		buildPositionDropdown();
	}else if(con == 'homepath'){
		$('#playersEditWrapper').show();
		$('#homePathEditWrapper').show();
		homePathContainer.visible = true;
		
		if(update){
			editData.homePathNum = 0;
			buildHomePathDropdown();
		}else{
			buildHomePathDots();
			loadHomePathData();
			drawHomePathEdit();	
		}
	}else if(con == 'font'){
		$('#playersEditWrapper').show();
		$('#nameEditWrapper').show();
		loadFontData();
	}else if(con == 'shape'){
		$('#playersEditWrapper').show();
		$('#shapeEditWrapper').show();

		boardShapeContainer.visible = false;
		editShapeContainer.visible = true;
		buildShapeData();
	}else{
		$('#editBoardWrapper').show();
	}
}

/*!
 * 
 * BUILD BOARD DROPDOWN - This is the function that runs to build board dropdown
 * 
 */
function buildBoardDropdown(){
	$('#boardslist').empty();
	for(n=0;n<boards_arr.length;n++){
		$('#boardslist').append($("<option/>", {
			value: n,
			text: 'Board '+(n+1)
		}));
	}
	$('#boardslist').val(gameData.boardIndex);
	
	loadBoardData();
}

/*!
 * 
 * BUILD PATH DROPDOWN - This is the function that runs to build path dropdown
 * 
 */
function buildPathDropdown(){
	$('#pathlist').empty();
	for(n=0;n<boards_arr[gameData.boardIndex].paths.length;n++){
		$('#pathlist').append($("<option/>", {
			value: n,
			text: 'Path '+(n+1)
		}));
	}
	$('#pathlist').val(editData.pathNum);
	
	buildPathDots();
	loadPathData();
	drawPathEdit();
}

/*!
 * 
 * BUILD PLAYERS DROPDOWN - This is the function that runs to build players dropdown
 * 
 */
function buildPlayersDropdown(){
	$('#playerslist').empty();
	for(n=0;n<boards_arr[gameData.boardIndex].players.length;n++){
		$('#playerslist').append($("<option/>", {
			value: n,
			text: 'Player '+(n+1)
		}));
	}

	$('#playerslist').val(editData.playerNum);
	loadPlayerData();
}

/*!
 * 
 * BUILD POSITION DROPDOWN - This is the function that runs to build position dropdown
 * 
 */
function buildPositionDropdown(){
	$('#positionlist').empty();

	var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
	for(n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length;n++){
		$('#positionlist').append($("<option/>", {
			value: n,
			text: 'Position '+(n+1)
		}));
	}
	$('#positionlist').val(editData.positionNum);
	
	buildPositionDots();
	loadPositionData();
}

/*!
 * 
 * BUILD END PATH DROPDOWN - This is the function that runs to build end path dropdown
 * 
 */
function buildHomePathDropdown(){
	$('#homepathlist').empty();
	for(n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length;n++){
		$('#homepathlist').append($("<option/>", {
			value: n,
			text: 'Path '+(n+1)
		}));
	}
	$('#homepathlist').val(editData.homePathNum);
	
	buildHomePathDots();
	loadHomePathData();
	drawHomePathEdit();
}

/*!
 * 
 * TOGGLE BOARDS - This is the function that runs to toggle boards
 * 
 */
function toggleBoard(con){
	if(con){
		gameData.boardIndex++;
		gameData.boardIndex = gameData.boardIndex > boards_arr.length - 1 ? 0 : gameData.boardIndex;
	}else{
		gameData.boardIndex--;
		gameData.boardIndex = gameData.boardIndex < 0 ? boards_arr.length - 1 : gameData.boardIndex;
	}
	
	$('#boardslist').prop("selectedIndex", gameData.boardIndex);
	toggleEditOption();
	loadBoardData();
}

/*!
 * 
 * TOGGLE PATHS - This is the function that runs to toggle paths
 * 
 */
function togglePath(con){
	if(con){
		editData.pathNum++;
		editData.pathNum = editData.pathNum > boards_arr[gameData.boardIndex].paths.length - 1 ? 0 : editData.pathNum;
	}else{
		editData.pathNum--;
		editData.pathNum = editData.pathNum < 0 ? boards_arr[gameData.boardIndex].paths.length - 1 : editData.pathNum;
	}
	
	$('#pathlist').prop("selectedIndex", editData.pathNum);
	
	loadPathData();
}

/*!
 * 
 * TOGGLE PLAYERS - This is the function that runs to toggle players
 * 
 */
function togglePlayers(con){
	if(con){
		editData.playerNum++;
		editData.playerNum = editData.playerNum > boards_arr[gameData.boardIndex].players.length - 1 ? 0 : editData.playerNum;
	}else{
		editData.playerNum--;
		editData.playerNum = editData.playerNum < 0 ? boards_arr[gameData.boardIndex].players.length - 1 : editData.playerNum;
	}
	
	$('#playerslist').prop("selectedIndex", editData.playerNum);
	loadPlayerData();
}

/*!
 * 
 * TOGGLE POSITION - This is the function that runs to toggle position
 * 
 */
function togglePosition(con){
	var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
	if(con){
		editData.positionNum++;
		editData.positionNum = editData.positionNum > boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length - 1 ? 0 : editData.positionNum;
	}else{
		editData.positionNum--;
		editData.positionNum = editData.positionNum < 0 ? boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length - 1 : editData.positionNum;
	}
	
	$('#positionlist').prop("selectedIndex", editData.positionNum);
	
	loadPositionData();
}

/*!
 * 
 * TOGGLE END PATHS - This is the function that runs to toggle paths
 * 
 */
function toggleHomePath(con){
	if(con){
		editData.homePathNum++;
		editData.homePathNum = editData.homePathNum > boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length - 1 ? 0 : editData.homePathNum;
	}else{
		editData.homePathNum--;
		editData.homePathNum = editData.homePathNum < 0 ? boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length - 1 : editData.homePathNum;
	}
	
	$('#homepathlist').prop("selectedIndex", editData.homePathNum);
	
	loadHomePathData();
}

/*!
 * 
 * LOAD EDITOR DAT - This is the function that runs to load editor data
 * 
 */
function loadBoardData(){
	toggleEditOption();
	
	$('#image').val(boards_arr[gameData.boardIndex].image);
	$('#boardScale').val(boards_arr[gameData.boardIndex].scale);
	$('#diceX').val(boards_arr[gameData.boardIndex].dice.x);
	$('#diceY').val(boards_arr[gameData.boardIndex].dice.y);
	
	loadBoardAssets();

	editData.playerNum = 0;
	buildPlayersDropdown();
}

function loadPathData(){
	if(boards_arr[gameData.boardIndex].paths.length == 0){
		return;	
	}
	
	$('#pathX').val(boards_arr[gameData.boardIndex].paths[editData.pathNum].x);
	$('#pathY').val(boards_arr[gameData.boardIndex].paths[editData.pathNum].y);
	
	if(pathContainer.visible){
		editData.editPath.x = Number($('#pathX').val());
		editData.editPath.y = Number($('#pathY').val());
	}
}

function loadPlayerData(){
	if(editData.option == "position"){
		toggleEditOption('position');
	}else if(editData.option == "homepath"){
		toggleEditOption('homepath');
	}else if(editData.option == "font"){
		toggleEditOption('font');	
	}else if(editData.option == "shape"){
		toggleEditOption('shape');	
	}
	
	if(boards_arr[gameData.boardIndex].players.length == 0){
		return;	
	}

	if($('#pathindexlist').val() == 0){
		$('#pathIndex').val(boards_arr[gameData.boardIndex].players[editData.playerNum].startIndex);
	}else if($('#pathindexlist').val() == 1){
		$('#pathIndex').val(boards_arr[gameData.boardIndex].players[editData.playerNum].homdeIndex);
	}else if($('#pathindexlist').val() == 2){
		$('#pathIndex').val(boards_arr[gameData.boardIndex].players[editData.playerNum].saveIndex);
	}

	if(pathContainer.visible){
		editData.editPath.x = $.pathDots['path'+Number($('#pathIndex').val())].x;
		editData.editPath.y = $.pathDots['path'+Number($('#pathIndex').val())].y;
	}
}

function loadPositionData(){
	var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
	if(boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length == 0){
		return;	
	}
	
	$('#positionX').val(boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].x);
	$('#positionY').val(boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].y);
	$('#positionScale').val(boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].scale);
	
	if(positionContainer.visible){
		editData.editPos.x = Number($('#positionX').val());
		editData.editPos.y = Number($('#positionY').val());
	}
}

function loadHomePathData(){
	if(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length == 0){
		return;	
	}
	
	$('#homePathX').val(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].x);
	$('#homePathY').val(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].y);
	
	if(homePathContainer.visible){
		editData.editHomePath.x = Number($('#homePathX').val());
		editData.editHomePath.y = Number($('#homePathY').val());
	}
}

function loadFontData(){
	var fontType = $('#nametypelist').val();
	
	$('#fontX').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].x);
	$('#fontY').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].y);
	$('#fontSize').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].fontSize);
	$('#fontColor').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].color);
	$('#fontRotation').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].rotation);
	$('#fontalign').val(boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].align);
}

/*!
 * 
 * EDITOR ACTION - This is the function that runs to for editor action
 * 
 */
function actionBoard(action){
	switch(action){
		case 'new':
			boards_arr.push({
				image:'assets/board1.png',
				dice:{
					x:290,
					y:288,
				},
				paths:[],
				players:[]
			});
			gameData.boardIndex = boards_arr.length - 1;
			buildBoardDropdown();
		break;
		
		case 'remove':
			if(boards_arr.length > 1){
				boards_arr.splice(gameData.boardIndex, 1);
				gameData.boardIndex = 0;
				buildBoardDropdown();
			}
		break;
		
		case 'moveup':
			if(gameData.boardIndex-1 >= 0){
				swapArray(boards_arr, gameData.boardIndex-1, gameData.boardIndex);
				gameData.boardIndex--;
				buildBoardDropdown();
			}
		break;
		
		case 'movedown':
			if(gameData.boardIndex+1 < boards_arr.length){
				swapArray(boards_arr, gameData.boardIndex+1, gameData.boardIndex);
				gameData.boardIndex++;
				buildBoardDropdown();
			}
		break;
	}
}

function actionPath(action){
	switch(action){
		case 'new':
			var point = boardDesignContainer.globalToLocal(stage.mouseX, stage.mouseY);
			if(boards_arr[gameData.boardIndex].paths.length == 0){
				boards_arr[gameData.boardIndex].paths.push({x:Math.round(point.x), y:Math.round(point.y), action:[], aOpt:{type:0, speed:1}});
				editData.pathNum = boards_arr[gameData.boardIndex].paths.length - 1;
			}else{
				var pointNum = editData.pathNum;
				pointNum++;
				boards_arr[gameData.boardIndex].paths.splice(pointNum, 0, {x:Math.round(point.x), y:Math.round(point.y), action:[], aOpt:{type:0, speed:1}});
				editData.pathNum = pointNum;
			}
			
			buildPathDropdown();
		break;
		
		case 'remove':
			if(boards_arr[gameData.boardIndex].paths.length > 1){
				boards_arr[gameData.boardIndex].paths.splice(editData.pathNum, 1);
				editData.pathNum--;
				buildPathDropdown();
			}
		break;
		
		case 'moveup':
			if(editData.pathNum-1 >= 0){
				swapArray(boards_arr[gameData.boardIndex].paths, editData.pathNum-1, editData.pathNum);
				editData.pathNum--;
				buildPathDropdown();
			}
		break;
		
		case 'movedown':
			if(gameData.boardIndex+1 < boards_arr[gameData.boardIndex].paths.length){
				swapArray(boards_arr[gameData.boardIndex].paths, editData.pathNum+1, editData.pathNum);
				editData.pathNum++;
				buildPathDropdown();
			}
		break;
	}
}

function actionPlayer(action){
	switch(action){
		case 'new':
			boards_arr[gameData.boardIndex].players.push(
				{
					startIndex:0,
					homdeIndex:0,
					saveIndex:0,
					startPos:[],
					homePos:[],
					homePath:[],
					name:{
						x:130,
						y:550,
						fontSize:25,
						align:"center",
						color:"#000",
						rotation:0
					},
					status:{
						x:130,
						y:370,
						fontSize:18,
						align:"center",
						color:"#000",
						rotation:0
					},
					shapes:[]
				}
			);

			editData.playerNum = boards_arr[gameData.boardIndex].players.length - 1;
			buildPlayersDropdown();
			preparePlayers();
			buildBoard();
		break;
		
		case 'remove':
			if(boards_arr[gameData.boardIndex].players.length > 1){
				boards_arr[gameData.boardIndex].players.splice(editData.playerNum, 1);
				editData.playerNum = 0;
				buildPlayersDropdown();
				preparePlayers();
				buildBoard();
			}
		break;
	}
}

function actionPosition(action){
	switch(action){
		case 'new':
			var point = boardDesignContainer.globalToLocal(stage.mouseX, stage.mouseY);
			var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";

			boards_arr[gameData.boardIndex].players[editData.playerNum][posType].push({x:Math.round(point.x), y:Math.round(point.y), scale:1});
			editData.positionNum = boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length - 1;
			console.log("here", editData.positionNum)
			
			buildPositionDropdown();
		break;

		case 'remove':
			var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
			if(boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length > 1){
				boards_arr[gameData.boardIndex].players[editData.playerNum][posType].splice(editData.positionNum, 1);
				editData.positionNum--;
				buildPositionDropdown();
			}
		break;
	}
}

function actionHomePath(action){
	switch(action){
		case 'new':
			var point = boardDesignContainer.globalToLocal(stage.mouseX, stage.mouseY);
			if(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length == 0){
				boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.push({x:Math.round(point.x), y:Math.round(point.y)});
				editData.homePathNum = boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length - 1;
			}else{
				var pointNum = editData.homePathNum;
				pointNum++;
				boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.splice(pointNum, 0, {x:Math.round(point.x), y:Math.round(point.y)});
				editData.homePathNum = pointNum;
			}
			
			buildHomePathDropdown();
		break;
		
		case 'remove':
			if(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length > 1){
				boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.splice(editData.homePathNum, 1);
				editData.homePathNum--;
				buildHomePathDropdown();
			}
		break;
	}
}

/*!
 * 
 * BUILD DOTS - This is the function that runs to build dots
 * 
 */
function buildPathDots(){
	pathContainer.removeAllChildren();
	
	editData.editPath = new createjs.Shape();
	editData.editPath.alpha = .7;
	editData.editPath.graphics.beginFill(editData.editPathColour).drawCircle(0, 0, editData.editPathWidth);
	editData.editPath.visible = true;
	editData.editPath.x = canvasW/2;
	editData.editPath.y = canvasH/2;
	
	editData.editPathShape = new createjs.Shape();
	pathContainer.addChild(editData.editPathShape, editData.editPath);
	
	for(var n=0;n<boards_arr[gameData.boardIndex].paths.length;n++){
		createDot(n, boards_arr[gameData.boardIndex].paths[n].x, boards_arr[gameData.boardIndex].paths[n].y, 'path');
	}
}

function buildPositionDots(){
	positionContainer.removeAllChildren();
	
	editData.editPos = new createjs.Shape();
	editData.editPos.alpha = .7;
	editData.editPos.graphics.beginFill(editData.editPathColour).drawCircle(0, 0, editData.editPathWidth);
	editData.editPos.visible = true;
	editData.editPos.x = canvasW/2;
	editData.editPos.y = canvasH/2;
	
	editData.editPosShape = new createjs.Shape();
	positionContainer.addChild(editData.editPosShape, editData.editPos);
	
	var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
	for(var n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum][posType].length;n++){
		createDot(n, boards_arr[gameData.boardIndex].players[editData.playerNum][posType][n].x, boards_arr[gameData.boardIndex].players[editData.playerNum][posType][n].y, 'position');
	}
}

function buildHomePathDots(){
	homePathContainer.removeAllChildren();
	
	editData.editHomePath = new createjs.Shape();
	editData.editHomePath.alpha = .7;
	editData.editHomePath.graphics.beginFill(editData.editPathColour).drawCircle(0, 0, editData.editPathWidth);
	editData.editHomePath.visible = true;
	editData.editHomePath.x = canvasW/2;
	editData.editHomePath.y = canvasH/2;
	
	editData.editHomePathShape = new createjs.Shape();
	homePathContainer.addChild(editData.editHomePathShape, editData.editHomePath);
	
	for(var n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length;n++){
		createDot(n, boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[n].x, boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[n].y, 'homepath');
	}
}

function createDot(n,x,y,type){
	$.pathDots[type+n] = new createjs.Shape();
	
	var colourCheckDot = editData.pathColour;
	
	$.pathDots[type+n].graphics.beginFill(colourCheckDot).drawCircle(0, 0, editData.pathWidth);
	$.pathDots[type+n].x = x;
	$.pathDots[type+n].y = y;
	
	if(type == 'position'){
		positionContainer.addChild($.pathDots[type+n]);
	}else if(type == 'homepath'){
		homePathContainer.addChild($.pathDots[type+n]);
	}else{
		pathContainer.addChild($.pathDots[type+n]);	
	}
	
	var draggable = true;
	if(draggable){
		$.pathDots[type+n].cursor = "pointer";
		$.pathDots[type+n].name = n;
		$.pathDots[type+n].addEventListener("mousedown", function(evt) {
			toggleDotDragEvent(evt, 'drag')
		});
		$.pathDots[type+n].addEventListener("pressmove", function(evt) {
			toggleDotDragEvent(evt, 'move')
		});
		$.pathDots[type+n].addEventListener("pressup", function(evt) {
			toggleDotDragEvent(evt, 'drop')
		});
	}
}

/*!
 * 
 * DRAW PATH SHAPE - This is the function that runs to draw path shape
 * 
 */
function drawPathEdit(){
	editData.editPathShape.graphics.clear();
	editData.editPathShape.graphics.beginStroke(editData.editPathShapeColour).setStrokeStyle(2);
	
	for(var n=0;n<boards_arr[gameData.boardIndex].paths.length;n++){
		editData.editPathShape.graphics.lineTo(boards_arr[gameData.boardIndex].paths[n].x, boards_arr[gameData.boardIndex].paths[n].y);
	}
}

function drawHomePathEdit(){
	editData.editHomePathShape.graphics.clear();
	editData.editHomePathShape.graphics.beginStroke(editData.editPathShapeColour).setStrokeStyle(2);
	
	for(var n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum].homePath.length;n++){
		editData.editHomePathShape.graphics.lineTo(boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[n].x, boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[n].y);
	}
}

/*!
 * 
 * POINT EVENT - This is the function that runs to for point event handler
 * 
 */
function toggleDotDragEvent(obj, con){
	switch(con){
		case 'drag':
			if(editData.option == "players"){
				$('#pathIndex').val(Number(obj.target.name));

				editData.editPath.visible = true;
				editData.editPath.x = obj.target.x;
				editData.editPath.y = obj.target.y;
			}else{
				obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y-(obj.stageY)};
				obj.target.alpha = .5;
				
				if(pathContainer.visible){
					editData.editPath.visible = true;
					editData.editPath.x = obj.target.x;
					editData.editPath.y = obj.target.y;
					
					editData.pathNum = Number(obj.target.name);
					$('#pathlist').val(editData.pathNum);
					loadPathData();
				}else if(homePathContainer.visible){
					editData.editHomePath.visible = true;
					editData.editHomePath.x = obj.target.x;
					editData.editHomePath.y = obj.target.y;
					
					editData.homePathNum = Number(obj.target.name);
					$('#homepathlist').val(editData.homePathNum);
					loadHomePathData();
				}else{
					editData.positionNum = Number(obj.target.name);	
					loadPositionData();
				}
			}
		break;
		
		case 'move':
			if(editData.option == "players"){

			}else{
				obj.target.alpha = .5;
				obj.target.x = (obj.stageX) + obj.target.offset.x;
				obj.target.y = (obj.stageY) + obj.target.offset.y;
				
				var newPathX = Math.floor(obj.target.x);
				var newPathY = Math.floor(obj.target.y);
					
				if(pathContainer.visible){
					editData.editPath.x = obj.target.x;
					editData.editPath.y = obj.target.y;

					$('#pathX').val(newPathX);
					$('#pathY').val(newPathY);
					
					boards_arr[gameData.boardIndex].paths[editData.pathNum].x = newPathX;
					boards_arr[gameData.boardIndex].paths[editData.pathNum].y = newPathY;

					drawPathEdit();
				}else if(homePathContainer.visible){
					editData.editHomePath.x = obj.target.x;
					editData.editHomePath.y = obj.target.y;

					$('#homePathX').val(newPathX);
					$('#homePathY').val(newPathY);
					
					boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].x = newPathX;
					boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].y = newPathY;

					drawHomePathEdit();
				}else{
					editData.editPos.x = obj.target.x;
					editData.editPos.y = obj.target.y;

					$('#positionX').val(newPathX);
					$('#positionY').val(newPathY);
					
					var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
					boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].x = newPathX;
					boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].y = newPathY;	
				}
			}
		break;
		
		case 'drop':
			obj.target.alpha = 1;
		break;
	}
}

/*!
 * 
 * UPDATE DOTS - This is the function that runs to update dots
 * 
 */
function updatePathDot(){
	$.pathDots['path'+editData.pathNum].x = Number($('#pathX').val());
	$.pathDots['path'+editData.pathNum].y = Number($('#pathY').val());
	
	boards_arr[gameData.boardIndex].paths[editData.pathNum].x = Number($('#pathX').val());
	boards_arr[gameData.boardIndex].paths[editData.pathNum].y = Number($('#pathY').val());
			
	editData.editPath.x = Number($('#pathX').val());
	editData.editPath.y = Number($('#pathY').val());
	
	drawPathEdit();
}

function updatePlayerData(){
	if($('#pathindexlist').val() == 0){
		boards_arr[gameData.boardIndex].players[editData.playerNum].startIndex = Number($('#pathIndex').val());
	}else if($('#pathindexlist').val() == 1){
		boards_arr[gameData.boardIndex].players[editData.playerNum].homdeIndex = Number($('#pathIndex').val());
	}else if($('#pathindexlist').val() == 2){
		boards_arr[gameData.boardIndex].players[editData.playerNum].saveIndex = Number($('#pathIndex').val());
	}

	buildBoard();
}

function updatePositionDot(){
	$.pathDots['position'+editData.positionNum].x = Number($('#positionX').val());
	$.pathDots['position'+editData.positionNum].y = Number($('#positionY').val());
	
	var posType = $('#positiontypelist').val() == "start" ? "startPos" : "homePos";
	boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].x = Number($('#positionX').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].y = Number($('#positionY').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][posType][editData.positionNum].scale = Number($('#positionScale').val());
			
	editData.editPos.x = Number($('#positionX').val());
	editData.editPos.y = Number($('#positionY').val());
}

function updateHomePathDot(){
	$.pathDots['homepath'+editData.homePathNum].x = Number($('#homePathX').val());
	$.pathDots['homepath'+editData.homePathNum].y = Number($('#homePathY').val());
	
	boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].x = Number($('#homePathX').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum].homePath[editData.homePathNum].y = Number($('#homePathY').val());
			
	editData.editHomePath.x = Number($('#homePathX').val());
	editData.editHomePath.y = Number($('#homePathY').val());
	
	drawHomePathEdit();
}

function updateFontData(){
	var fontType = $('#nametypelist').val();
	
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].x = Number($('#fontX').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].y = Number($('#fontY').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].fontSize = Number($('#fontSize').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].color = $('#fontColor').val();
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].rotation = Number($('#fontRotation').val());
	boards_arr[gameData.boardIndex].players[editData.playerNum][fontType].align = $('#fontalign').val();

	buildBoard();
}

/*!
 * 
 * BUILD DRAWING DATA - This is the function that runs to build drawing data
 * 
 */
function buildShapeData(){
	editDot = new createjs.Shape();
	editDot.alpha = .5;
	editDot.graphics.beginFill(editData.editShapeDotFocusColor).drawCircle(0, 0, editData.editShapeDotWidth+5);
	editDot.visible = false;
	editShape = new createjs.Shape();
	
	editShapeContainer.removeAllChildren();
	editShapeContainer.addChild(editDot, editShape);
	
	editShape.graphics.clear();
	editDot.visible = false;

	if(editData.option == 'shape'){
		if(boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length > 0){
			drawShapeDots();
			drawEditLines();
		}
	}
}

/*!
 * 
 * EDITOR ACTION - This is the function that runs to for editor action
 * 
 */
function actionDrawingPoint(action){
	switch(action){
		case 'new':
			var local = editShapeContainer.globalToLocal(stage.mouseX, stage.mouseY);
			var currentX = Math.round(local.x);
			var currentY = Math.round(local.y);

			if(boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length == 0){
				boards_arr[gameData.boardIndex].players[editData.playerNum].shape.push({x:currentX, y:currentY});
				editData.shapePathNum = 0;
			}else{
				var pointNum = editData.shapePathNum;
				pointNum++;
				boards_arr[gameData.boardIndex].players[editData.playerNum].shape.push({x:currentX, y:currentY});
				editData.shapePathNum = pointNum;
			}
			
			buildShapeData();
		break;
		
		case 'remove':
			var pointNum = editData.shapePathNum;
			boards_arr[gameData.boardIndex].players[editData.playerNum].shape.splice(pointNum, 1);
			editData.shapePathNum = boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length-1;
			editData.shapePathNum = editData.shapePathNum < 0 ? 0 : editData.shapePathNum;
			editDot.visible = false;

			buildShapeData();
		break;
	}
}

/*!
 * 
 * REDRAW POINT - This is the function that runs to redraw point
 * 
 */
function drawEditLines(){
	editShape.graphics.clear();
	editShape.alpha = editData.editShapeAlpha;
	
	if(boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length > 0){
		editShape.graphics.setStrokeStyle(editData.editShapeStroke).beginStroke(editData.editShapeLine).beginFill(editData.editShapeFill).moveTo(boards_arr[gameData.boardIndex].players[editData.playerNum].shape[0].x, boards_arr[gameData.boardIndex].players[editData.playerNum].shape[0].y);
		for(var n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length;n++){
			editShape.graphics.lineTo(boards_arr[gameData.boardIndex].players[editData.playerNum].shape[n].x, boards_arr[gameData.boardIndex].players[editData.playerNum].shape[n].y);
		}
	}
}

/*!
 * 
 * DRAW ALL POINTS - This is the function that runs to draw all points
 * 
 */
function drawShapeDots(){
	for(var n=0;n<boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length;n++){
		drawShapeDot(n, boards_arr[gameData.boardIndex].players[editData.playerNum].shape[n].x, boards_arr[gameData.boardIndex].players[editData.playerNum].shape[n].y);
	}
}

/*!
 * 
 * DRAW SINGLE POINT - This is the function that runs to draw single point
 * 
 */
function drawShapeDot(n,x,y){
	var circle = new createjs.Shape();
	var dotWidth = editData.editShapeDotWidth;
	var colourCheckDot = editData.editShapeDotColor;
	colourCheckDot = n == 0 ? editData.editShapeStart : colourCheckDot;
	colourCheckDot = n == boards_arr[gameData.boardIndex].players[editData.playerNum].shape.length-1 ? editData.editShapeEnd : colourCheckDot;

	circle.graphics.setStrokeStyle(2).beginStroke(editData.editShapeLine);
	circle.graphics.beginFill(colourCheckDot).drawCircle(0, 0, dotWidth);
	circle.x = x;
	circle.y = y;
	circle.alpha = editData.editShapeDotAlpha;
	editShapeContainer.addChild(circle);
	
	circle.cursor = "pointer";
	circle.name = n;
	circle.addEventListener("mousedown", function(evt) {
		toggleDragEvent(evt, 'drag')
	});
	circle.addEventListener("pressmove", function(evt) {
		toggleDragEvent(evt, 'move')
	});
	circle.addEventListener("pressup", function(evt) {
		toggleDragEvent(evt, 'drop')
	});
}

/*!
 * 
 * POINT EVENT - This is the function that runs to for point event handler
 * 
 */
function toggleDragEvent(obj, con){
	switch(con){
		case 'drag':
			obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y-(obj.stageY)};
			obj.target.alpha = .5;
			
			editData.shapePathNum = obj.target.name;
			toggleEditDot(obj.target.x, obj.target.y, obj.target.name);
		break;
		
		case 'move':
			obj.target.alpha = .5;
			obj.target.x = (obj.stageX) + obj.target.offset.x;
			obj.target.y = (obj.stageY) + obj.target.offset.y;

			boards_arr[gameData.boardIndex].players[editData.playerNum].shape[obj.target.name].x = Math.round(obj.target.x);
			boards_arr[gameData.boardIndex].players[editData.playerNum].shape[obj.target.name].y = Math.round(obj.target.y);

			toggleEditDot(obj.target.x, obj.target.y, obj.target.name);
			drawEditLines();
		break;
		
		case 'drop':
			obj.target.alpha = 1;
		break;
	}
}

/*!
 * 
 * TOGGLE EDIT POINT - This is the function that runs to toggle edit point
 * 
 */
function toggleEditDot(x, y, name){
	editDot.x = x;
	editDot.y = y;
	editDot.visible = true;
}

/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */
function generateArray(){
	var outputArray = '';
	var space = '					';
	var space2 = '						';
	var space3 = '							';
	var space4 = '								';
	var space5 = '									';
	
	outputArray += "[\n";
	for(e=0;e<boards_arr.length;e++){
		var pathArray = '';
		var playersArray = '';
		for(var l=0; l < boards_arr[e].paths.length; l++){
			pathArray += space3+"{x:"+boards_arr[e].paths[l].x+", y:"+boards_arr[e].paths[l].y+"},\n";
		}

		for(var l=0; l < boards_arr[e].players.length; l++){
			var playerStartPos = '';
			var playerhomePos = '';
			var playerHomePath = '';
			var playerShape = '';

			for(var a=0; a < boards_arr[e].players[l].startPos.length; a++){
				playerStartPos += space5+"{x:"+boards_arr[e].players[l].startPos[a].x+", y:"+boards_arr[e].players[l].startPos[a].y+", scale:"+boards_arr[e].players[l].startPos[a].scale+"},\n";
			}

			for(var a=0; a < boards_arr[e].players[l].homePos.length; a++){
				playerhomePos += space5+"{x:"+boards_arr[e].players[l].homePos[a].x+", y:"+boards_arr[e].players[l].homePos[a].y+", scale:"+boards_arr[e].players[l].homePos[a].scale+"},\n";
			}

			for(var a=0; a < boards_arr[e].players[l].homePath.length; a++){
				playerHomePath += space5+"{x:"+boards_arr[e].players[l].homePath[a].x+", y:"+boards_arr[e].players[l].homePath[a].y+"},\n";
			}

			for(var a=0; a < boards_arr[e].players[l].shape.length; a++){
				playerShape += space5+"{x:"+boards_arr[e].players[l].shape[a].x+", y:"+boards_arr[e].players[l].shape[a].y+"},\n";
			}

			playersArray += space3+"{\n";
			playersArray += space4+"startIndex:"+boards_arr[e].players[l].startIndex+",\n";
			playersArray += space4+"homdeIndex:"+boards_arr[e].players[l].homdeIndex+",\n";
			playersArray += space4+"saveIndex:"+boards_arr[e].players[l].saveIndex+",\n";
			playersArray += space4+"startPos:[\n";
			playersArray += playerStartPos+"\n";
			playersArray += space4+"],\n";
			playersArray += space4+"homePos:[\n";
			playersArray += playerhomePos+"\n";
			playersArray += space4+"],\n";
			playersArray += space4+"homePath:[\n";
			playersArray += playerHomePath+"\n";
			playersArray += space4+"],\n";
			playersArray += space4+"name:{\n";
			playersArray += space5+"x:"+boards_arr[e].players[l].name.x+",\n";
			playersArray += space5+"y:"+boards_arr[e].players[l].name.y+",\n";
			playersArray += space5+"fontSize:"+boards_arr[e].players[l].name.fontSize+",\n";
			playersArray += space5+"align:'"+boards_arr[e].players[l].name.align+"',\n";
			playersArray += space5+"color:'"+boards_arr[e].players[l].name.color+"',\n";
			playersArray += space5+"rotation:"+boards_arr[e].players[l].name.rotation+",\n";
			playersArray += space4+"},\n";
			playersArray += space4+"status:{\n";
			playersArray += space5+"x:"+boards_arr[e].players[l].status.x+",\n";
			playersArray += space5+"y:"+boards_arr[e].players[l].status.y+",\n";
			playersArray += space5+"fontSize:"+boards_arr[e].players[l].status.fontSize+",\n";
			playersArray += space5+"align:'"+boards_arr[e].players[l].status.align+"',\n";
			playersArray += space5+"color:'"+boards_arr[e].players[l].status.color+"',\n";
			playersArray += space5+"rotation:"+boards_arr[e].players[l].status.rotation+",\n";
			playersArray += space4+"},\n";
			playersArray += space4+"shape:[\n";
			playersArray += playerShape+"\n";
			playersArray += space4+"],\n";
			playersArray += space3+"},\n\n";
		}
		
		outputArray += space+"{\n";
		outputArray += space2+"image:'"+boards_arr[e].image+"',\n";
		outputArray += space2+"scale:'"+boards_arr[e].scale+"',\n";
		outputArray += space2+"dice:{\n";
		outputArray += space3+"x:"+boards_arr[e].dice.x+",\n";
		outputArray += space3+"y:"+boards_arr[e].dice.y+",\n";
		outputArray += space2+"},\n";
		outputArray += space2+"paths:[\n";
		outputArray += pathArray+"\n";
		outputArray += space2+"],\n";
		outputArray += space2+"players:[\n";
		outputArray += playersArray+"\n";
		outputArray += space2+"],\n";
		outputArray += space+"},\n\n";
	}
	outputArray += space+'];';
	outputArray = outputArray.replace(/undefined/g,0);
	$('#outputArray').val(outputArray);	
}

/*!
 * 
 * LOAD BOARD ASSETS - This is the function that runs to load board assets
 * 
 */
function loadBoardAssets(){
	boardFileFest = [];
	boardFileFest = [{src:boards_arr[gameData.boardIndex].image, id:'boardImage'}];
	
	boardLoader = new createjs.LoadQueue(false);
	boardLoader.addEventListener("complete", handleBoardComplete);
	boardLoader.loadManifest(boardFileFest);
}

function handleBoardComplete() {
	preparePlayers();
	buildBoard();
};