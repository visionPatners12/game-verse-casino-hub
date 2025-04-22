
////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW=1280;
var stageH=768;
var contentW = 1024;
var contentH = 576;

var viewport = {isLandscape:true};
var landscapeSize = {w:stageW, h:stageH, cW:contentW, cH:contentH};
var portraitSize = {w:768, h:1024, cW:576, cH:900};

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain(){
  if(!$.browser.mobile || !isTablet){
    $('#canvasHolder').show();	
  }
  
  buildGameCanvas();
  buildGameButton();

  if ( typeof buildScoreBoardCanvas == 'function' ) { 
    buildScoreBoardCanvas();
  }

  if($.editor && $.editor.enable){
    loadEditPage();
    goPage('game');
  }else{
    goPage('main');
    if ( typeof initSocket == 'function' && multiplayerSettings && multiplayerSettings.enable) {
      initSocket("playludo");
    }
  }
  
  checkMobileOrientation();
  resizeCanvas();
}

/**
 * Initialize game canvas with specific dimensions
 * @param {number} w - Canvas width
 * @param {number} h - Canvas height
 */
function initGameCanvas(w, h) {
  console.log("Initializing game canvas with dimensions:", w, h);
  stageW = w || stageW;
  stageH = h || stageH;
  
  if(!$.browser) {
    $.browser = { mobile: false };
  }
  
  if(typeof isTablet === 'undefined') {
    isTablet = false;
  }
  
  // Make sure we have the global $ object ready
  if(!$) {
    console.warn("jQuery not available for game canvas");
    return;
  }
  
  // Initialize editor if not already set
  if(!$.editor) {
    $.editor = { enable: false };
  }
  
  // Initialize game object if needed
  if(!$.game) {
    $.game = {};
  }
  
  console.log("Game canvas initialized successfully");
}

var windowW=windowH=0;
var scalePercent=0;
var offset = {x:0, y:0, left:0, top:0};

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc(){
  setTimeout(function() {
    if(typeof $('.mobileRotate') !== 'undefined'){
      $('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
      $('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));
    }
    
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    
    scalePercent = windowW/contentW;
    if((contentH*scalePercent)>windowH){
      scalePercent = windowH/contentH;
    }
    
    scalePercent = scalePercent > 1 ? 1 : scalePercent;
    
    if(windowW > stageW && windowH > stageH){
      if(windowW > stageW){
        scalePercent = windowW/stageW;
        if((stageH*scalePercent)>windowH){
          scalePercent = windowH/stageH;
        }	
      }
    }
    
    var newCanvasW = ((stageW)*scalePercent);
    var newCanvasH = ((stageH)*scalePercent);
    
    offset.left = 0;
    offset.top = 0;
    
    if(newCanvasW > windowW){
      offset.left = -((newCanvasW) - windowW);
    }else{
      offset.left = windowW - (newCanvasW);
    }
    
    if(newCanvasH > windowH){
      offset.top = -((newCanvasH) - windowH);
    }else{
      offset.top = windowH - (newCanvasH);	
    }
    
    offset.x = 0;
    offset.y = 0;
    
    if(offset.left < 0){
      offset.x = Math.abs((offset.left/scalePercent)/2);
    }
    if(offset.top < 0){
      offset.y = Math.abs((offset.top/scalePercent)/2);
    }

    try {
      $('canvas').css({
        width: newCanvasW,
        height: newCanvasH,
        left: offset.left/2,
        top: offset.top/2,
        position: 'relative'
      });

      if ( typeof initSocket == 'function' && multiplayerSettings && multiplayerSettings.enable) {
        $('.resizeFont').each(function(index, element) {
          $(this).css('font-size', Math.round(Number($(this).attr('data-fontsize'))*scalePercent));
        });
  
        $('#roomWrapper').css('width', newCanvasW);
        $('#roomWrapper').css('height', newCanvasH);
  
        $('#roomWrapper').css('left', (offset.left/2));
        $('#roomWrapper').css('top', (offset.top/2));

        $('#notificationHolder').css('width', newCanvasW);
        $('#notificationHolder').css('height', newCanvasH);
  
        $('#notificationHolder').css('left', (offset.left/2));
        $('#notificationHolder').css('top', (offset.top/2));
      }
      $(window).scrollTop(0);
    
      resizeCanvas();
      if ( typeof resizeScore == 'function' ) { 
        resizeScore();
      }
    } catch (e) {
      console.error("Error during game resize:", e);
    }
  }, 100);	
}

// Export functions to window for access from React components
window.initGameCanvas = initGameCanvas;
window.buildGameCanvas = buildGameCanvas;
window.resizeGameFunc = resizeGameFunc;
window.removeGameCanvas = function() {
  console.log("Removing game canvas");
  
  try {
    // Find and remove the canvas element
    var canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(function(canvas) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    });
    
    console.log("Game canvas removed successfully");
  } catch (e) {
    console.error("Error removing game canvas:", e);
  }
};
