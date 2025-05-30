// TODO: add tests for multiple workers, one abort signal
//       and `internalState`

import { afterEach, it, expect } from "vitest";
import { WorkerPool, WorkerTermination } from "../workerPool";
import {
  createCountingWorker,
  resetCountingWorkerCount,
} from "@/testing-utils/countingWorker";
import {
  MockWorker,
  resetWorkerResponseDelay,
  setWorkerResponseDelay,
} from "@/testing-utils/mockWorker";

afterEach(() => {
  resetCountingWorkerCount();
  resetWorkerResponseDelay();
});

it("should return result of queued task", async () => {
  const pool = new WorkerPool(createCountingWorker);
  const result = await pool.queueTask("count", 0, null);
  expect(result).toBe(0);
});

it("should return result of multiple queued tasks", async () => {
  const pool = new WorkerPool(createCountingWorker);
  const results = Promise.all([
    pool.queueTask("count", 0, null),
    pool.queueTask("count", 0, null),
    pool.queueTask("count", 0, null),
    pool.queueTask("count", 0, null),
    pool.queueTask("count", 0, null),
    pool.queueTask("count", 0, null),
  ]);

  expect(await results).toEqual([0, 1, 2, 3, 4, 5]);
});

it("should terminate tasks and worker", async () => {
  setWorkerResponseDelay(1);

  let worker: MockWorker;
  const pool = new WorkerPool(() => {
    worker = createCountingWorker() as unknown as MockWorker;
    return worker as unknown as Worker;
  });

  const abortController = new AbortController();
  const expectPromise = expect(
    pool.queueTask("count", 0, null, abortController.signal),
  ).rejects.toThrowError(new WorkerTermination());

  abortController.abort();

  await expectPromise;
  expect(worker!.terminated).toBeTruthy();
});

it("should not run terminated tasks", async () => {
  setWorkerResponseDelay(5);

  const pool = new WorkerPool(createCountingWorker, {
    maxWorkers: 1,
  });

  void pool.queueTask("count", 0, null);

  // This one should not run
  const abortController = new AbortController();
  const expectPromise = expect(
    pool.queueTask("count", 0, null, abortController.signal),
  ).rejects.toThrowError();
  abortController.abort();

  expect(await pool.queueTask("count", 0, null)).toBe(1);
  await expectPromise;
});

it("should fail with worker termination when abort signal already aborted on task start", async () => {
  const pool = new WorkerPool(createCountingWorker);
  const abortController = new AbortController();
  abortController.abort();

  await expect(() =>
    pool.queueTask("count", 0, null, abortController.signal),
  ).rejects.toThrowError(new WorkerTermination());
});

it(
  "should return result of 25 queued tasks with randomized delays",
  { timeout: 5000 },
  async () => {
    setWorkerResponseDelay(25, 500);
    const pool = new WorkerPool(createCountingWorker, { maxWorkers: 10 });
    const promises = Array.from({ length: 25 }).map((_) =>
      pool.queueTask("count", 0, null),
    );
    const results = Promise.all(promises);
    const expected = Array.from({ length: 25 }).map((_, index) => index);

    expect(await results).toEqual(expected);
  },
);

it(
  "should return result of 48 queued tasks with randomized delays with every odd task terminated",
  { timeout: 1000 },
  async () => {
    setWorkerResponseDelay(5, 250);

    const pool = new WorkerPool(createCountingWorker, { maxWorkers: 10 });
    const promises: Promise<unknown>[] = [];
    for (let i = 0; i < 48; i++) {
      const abortController = i % 2 === 0 ? null : new AbortController();
      promises.push(pool.queueTask("count", 0, null, abortController?.signal));
      abortController?.abort();
    }

    const r = await Promise.allSettled(promises);
    for (const [i, result] of r.entries()) {
      if (i % 2 === 0) {
        expect(result.status).toEqual("fulfilled");
      } else {
        expect(result.status).toBe("rejected");
      }
    }
  },
);
