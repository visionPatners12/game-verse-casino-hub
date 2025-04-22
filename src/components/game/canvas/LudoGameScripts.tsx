
import { useEffect, useState } from 'react';

export const LudoGameScripts = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    if (scriptsLoaded) return;

    // Define loadGameScripts function before using it
    const loadGameScripts = () => {
      const scripts = [
        '/src/game-implementation/Ludo/js/vendor/createjs.min.js',
        '/src/game-implementation/Ludo/js/vendor/TweenMax.min.js',
        '/src/game-implementation/Ludo/js/vendor/detectmobilebrowser.js',
        '/src/game-implementation/Ludo/js/vendor/proton.min.js',
        '/src/game-implementation/Ludo/js/plugins.js',
        '/src/game-implementation/Ludo/js/boards.js',
        '/src/game-implementation/Ludo/js/init.js',
        '/src/game-implementation/Ludo/js/canvas.js',
        '/src/game-implementation/Ludo/js/game.js',
        '/src/game-implementation/Ludo/js/loader.js',
        '/src/game-implementation/Ludo/js/sound.js',
        '/src/game-implementation/Ludo/js/mobile.js',
        '/src/game-implementation/Ludo/js/main.js'
      ];

      const loadScriptSequentially = (index = 0) => {
        if (index >= scripts.length) {
          console.log("All game scripts loaded successfully");
          setScriptsLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = scripts[index];
        script.async = false;
        
        script.onload = () => {
          console.log(`Loaded script: ${scripts[index]}`);
          loadScriptSequentially(index + 1);
        };
        
        script.onerror = (e) => {
          console.error(`Error loading script: ${scripts[index]}`, e);
          // Continue loading other scripts even if one fails
          loadScriptSequentially(index + 1);
        };
        
        document.body.appendChild(script);
      };

      loadScriptSequentially();
    };

    // Check if jQuery is already loaded
    if (window.jQuery || window.$) {
      console.log("jQuery already loaded, skipping jQuery loading");
      loadGameScripts();
      return;
    }

    // Load jQuery first, then other scripts
    console.log("Loading jQuery...");
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.async = false;
    
    jqueryScript.onload = () => {
      console.log("jQuery loaded successfully");
      loadGameScripts();
    };
    
    jqueryScript.onerror = (e) => {
      console.error("Error loading jQuery", e);
      // Try to continue with game scripts even if jQuery fails
      loadGameScripts();
    };
    
    document.body.appendChild(jqueryScript);

    return () => {
      // We don't remove the scripts on unmount because they need to persist
      // for the game to function across component re-renders
    };
  }, [scriptsLoaded]);

  return null;
};
