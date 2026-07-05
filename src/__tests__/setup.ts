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
window.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(() => cb(Date.now()), 16) as unknown as number;
};
window.cancelAnimationFrame = (id: number) => clearTimeout(id);
