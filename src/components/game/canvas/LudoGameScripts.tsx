
import { useEffect } from 'react';

export const LudoGameScripts = () => {
  useEffect(() => {
    // Function to load scripts in sequence
    const loadScripts = (scripts: string[], index = 0) => {
      if (index >= scripts.length) return;

      const script = document.createElement('script');
      script.src = scripts[index];
      script.async = false;
      script.onload = () => loadScripts(scripts, index + 1);
      document.body.appendChild(script);
    };

    // Load jQuery first, then other scripts
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.async = false;
    jqueryScript.onload = () => {
      // After jQuery is loaded, load the rest of the scripts in order
      loadScripts([
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
      ]);
    };
    document.body.appendChild(jqueryScript);

    return () => {
      // Clean up scripts when component unmounts
      const scripts = document.querySelectorAll('script[src*="Ludo/js"]');
      scripts.forEach(script => {
        document.body.removeChild(script);
      });
      
      const jqueryScripts = document.querySelectorAll('script[src*="jquery"]');
      jqueryScripts.forEach(script => {
        document.body.removeChild(script);
      });
    };
  }, []);

  return null;
};
