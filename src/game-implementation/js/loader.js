////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkMobileOrientation, 1000);
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/background_p.png', id:'backgroundP'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/logo_p.png', id:'logoP'},
			{src:'assets/button_play.png', id:'buttonPlay'},
			{src:'assets/button_vscomputer.png', id:'buttonVsComputer'},
			{src:'assets/button_vsplayers.png', id:'buttonVsPlayers'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/button_online.png', id:'buttonOnline'},
			{src:'assets/button_local.png', id:'buttonLocal'},

			{src:'assets/button_arrow_left.png', id:'buttonArrowLeft'},
			{src:'assets/button_arrow_right.png', id:'buttonArrowRight'},
			{src:'assets/button_plus.png', id:'buttonPlus'},
			{src:'assets/button_minus.png', id:'buttonMinus'},
			{src:'assets/item_number.png', id:'itemNumber'},
			{src:'assets/item_colors.png', id:'itemColors'},
			{src:'assets/item_status.png', id:'itemStatus'},
			{src:'assets/item_arrow.png', id:'itemArrow'},
			{src:'assets/item_dice.png', id:'itemDice'},
			{src:'assets/item_dice_bg.png', id:'itemDiceBg'},

			{src:'assets/item_shine_1.png', id:'itemShine1'},
			{src:'assets/item_shine_2.png', id:'itemShine2'},
			{src:'assets/item_shine_3.png', id:'itemShine3'},
			{src:'assets/item_shine_4.png', id:'itemShine4'},
			{src:'assets/item_shine_5.png', id:'itemShine5'},
			{src:'assets/item_shine_6.png', id:'itemShine6'},
		
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/item_pop.png', id:'itemPop'},
			{src:'assets/item_pop_p.png', id:'itemPopP'},
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];

	for(var n=0; n<players_arr.length; n++){
		manifest.push({src:players_arr[n].src, id:'iconPlayer'+n});
		manifest.push({src:players_arr[n].dice, id:'iconDice'+n});
	}

	for(var n=0; n<boards_arr.length; n++){
		manifest.push({src:boards_arr[n].image, id:'board'+n});
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/sound_click.ogg', id:'soundButton'});
		manifest.push({src:'assets/sounds/sound_error.ogg', id:'soundError'});
		manifest.push({src:'assets/sounds/sound_extra.ogg', id:'soundExtra'});
		manifest.push({src:'assets/sounds/sound_kick.ogg', id:'soundKick'});
		manifest.push({src:'assets/sounds/sound_kick_alert.ogg', id:'soundKickAlert'});
		manifest.push({src:'assets/sounds/sound_safe.ogg', id:'soundSafe'});
		manifest.push({src:'assets/sounds/sound_dice.ogg', id:'soundDice'});
		manifest.push({src:'assets/sounds/sound_end.ogg', id:'soundEnd'});
		manifest.push({src:'assets/sounds/sound_flip.ogg', id:'soundFlip'});
		manifest.push({src:'assets/sounds/sound_complete.ogg', id:'soundComplete'});
		manifest.push({src:'assets/sounds/sound_result.ogg', id:'soundResult'});
		manifest.push({src:'assets/sounds/sound_start.ogg', id:'soundStart'});
		manifest.push({src:'assets/sounds/sound_drop.ogg', id:'soundDrop'});
		manifest.push({src:'assets/sounds/music_game.ogg', id:'musicGame'});
		manifest.push({src:'assets/sounds/music_main.ogg', id:'musicMain'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}