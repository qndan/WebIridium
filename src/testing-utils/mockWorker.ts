let minDelay = 0;
let maxDelay = 0;

export const setWorkerResponseDelay = (min: number, max?: number) => {
  minDelay = min;
  maxDelay = max ?? min;
};

export const resetWorkerResponseDelay = () => {
  minDelay = 0;
  maxDelay = 0;
};

const getDelay = () => {
  return minDelay + (maxDelay - minDelay) * Math.random();
};

export class MockWorkerPort extends EventTarget {
  worker: MockWorker;

  constructor(worker: MockWorker) {
    super();
    this.worker = worker;
  }

  emitMessageEvent(data: unknown) {
    if (this.worker.terminated) return;
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  postMessage(data: unknown) {
    const delay = getDelay();
    if (delay === 0) {
      this.worker.emitMessageEvent(data);
    } else {
      setTimeout(() => this.worker.emitMessageEvent(data), delay);
    }
  }
}

export class MockWorker extends EventTarget {
  port: MockWorkerPort;
  terminated: boolean;

  constructor() {
    super();
    this.port = new MockWorkerPort(this);
    this.terminated = false;
  }

  emitMessageEvent(data: unknown) {
    if (this.terminated) return;
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  postMessage(data: unknown) {
    this.port.emitMessageEvent(data);
  }

  terminate() {
    this.terminated = true;
  }
}
