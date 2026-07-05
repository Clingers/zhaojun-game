import '@testing-library/jest-dom';

// Mock localStorage (before any imports that use it)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock phaser module for test environment
vi.mock('phaser', () => {
  class MockScene {
    events: any;
    input: any;
    tweens: any;
    add: any;
    load: any;
    key: string;
    constructor(config: any) {
      this.key = config?.key || '';
      this.events = { emit: vi.fn(), on: vi.fn() };
      this.input = { once: vi.fn(), on: vi.fn() };
      this.tweens = { add: vi.fn() };
      this.load = { image: vi.fn(), audio: vi.fn(), setBaseURL: vi.fn() };
      this.add = {
        image: vi.fn(() => ({ setOrigin: vi.fn() })),
        text: vi.fn(() => ({ setOrigin: vi.fn(), setAlpha: vi.fn(), setText: vi.fn(), destroy: vi.fn() })),
        rectangle: vi.fn(),
      };
    }
  }
  class MockGame {
    scene: any;
    constructor(config: any) {
      this.scene = { getScene: vi.fn(), scenes: [], add: vi.fn(), switch: vi.fn() };
    }
    destroy() {}
  }
  return {
    default: {
      Game: MockGame,
      Scene: MockScene,
      AUTO: 0,
      Scale: { FIT: 0, CENTER_BOTH: 0 },
    },
    Scene: MockScene,
    Game: MockGame,
    AUTO: 0,
    Scale: { FIT: 0, CENTER_BOTH: 0 },
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock AudioContext
class MockAudioContext {
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  decodeAudioData() {
    return Promise.resolve({});
  }
  close() {
    return Promise.resolve();
  }
  get destination() {
    return {};
  }
  get currentTime() {
    return 0;
  }
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});

// Mock requestAnimationFrame for Phaser
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(() => cb(Date.now()), 16) as unknown as number;
};
global.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Mock WebGLRenderingContext for Phaser
class MockWebGLContext {
  canvas = { width: 1280, height: 720 };
  drawingBufferWidth = 1280;
  drawingBufferHeight = 720;
  getExtension() { return null; }
  getShaderPrecisionFormat() { return { precision: 23, rangeMin: 127, rangeMax: 127 }; }
  createShader() { return {}; }
  createProgram() { return {}; }
  shaderSource() {}
  compileShader() {}
  attachShader() {}
  linkProgram() {}
  getProgramParameter() { return true; }
  getShaderParameter() { return true; }
  useProgram() {}
  getAttribLocation() { return 0; }
  getUniformLocation() { return {}; }
  uniform1f() {}
  uniform2f() {}
  uniform3f() {}
  uniform4f() {}
  uniform1i() {}
  uniformMatrix4fv() {}
  enableVertexAttribArray() {}
  vertexAttribPointer() {}
  bindBuffer() {}
  bufferData() {}
  bindTexture() {}
  texImage2D() {}
  texParameteri() {}
  drawArrays() {}
  drawElements() {}
  clear() {}
  clearColor() {}
  viewport() {}
  enable() {}
  disable() {}
  blendFunc() {}
  createTexture() { return {}; }
  createBuffer() { return {}; }
  getParameter() { return ''; }
  getSupportedExtensions() { return []; }
  isContextLost() { return false; }
  VERTEX_SHADER: 0;
  FRAGMENT_SHADER: 0;
  COMPILE_STATUS: 0;
  LINK_STATUS: 0;
  ARRAY_BUFFER: 0;
  STATIC_DRAW: 0;
  FLOAT: 0;
  TRIANGLES: 0;
  TEXTURE_2D: 0;
  TEXTURE_MIN_FILTER: 0;
  TEXTURE_MAG_FILTER: 0;
  LINEAR: 0;
  CLAMP_TO_EDGE: 0;
  RGBA: 0;
  UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0;
  COLOR_BUFFER_BIT: 0;
  DEPTH_BUFFER_BIT: 0;
  BLEND: 0;
  ONE: 0;
  ONE_MINUS_SRC_ALPHA: 0;
  SRC_ALPHA: 0;
  DEPTH_TEST: 0;
  LEQUAL: 0;
  SCISSOR_TEST: 0;
  STENCIL_TEST: 0;
  DITHER: 0;
}

const mockWebgl = new MockWebGLContext();
const originalGetContext = HTMLCanvasElement.prototype.getContext;

// Mock HTMLCanvasElement for Phaser
HTMLCanvasElement.prototype.getContext = function(contextId: string, ...args: any[]) {
  if (contextId === 'webgl' || contextId === 'webgl2' || contextId === 'experimental-webgl') {
    return mockWebgl as any;
  }
  if (contextId === '2d') {
    return {
      fillStyle: '',
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      canvas: { width: 1280, height: 720 },
    } as any;
  }
  return null;
};
