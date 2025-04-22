
interface JQuery {
  game: any;
  browser: {
    mobile: boolean;
  };
  editor: {
    enable: boolean;
  };
}

declare global {
  interface Window {
    $: JQuery & ((selector: string) => JQuery);
    jQuery: any;
    gameInitialized: boolean;
    initGameCanvas: (width: number, height: number) => void;
    buildGameCanvas: () => void;
    removeGameCanvas: () => void;
    resizeGameFunc: () => void;
    initMain: () => void;
    changeCanvasViewport: () => void;
    checkMobileOrientation: () => void;
  }
}

export {};
