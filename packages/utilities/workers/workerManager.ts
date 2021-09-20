import { EventEmitter } from 'events';
import { cpus } from 'os';
import * as path from 'path';
import { Worker as WorkerThread } from 'worker_threads';
import type { DesignData } from '../design';
import { getDesignData } from '../design';
import { Image } from '../Image';
import { readKey } from '../readKey';
import type { ResultLike } from '../Result';
import { Result } from '../Result';
import { ProgressStates } from './ProgressStates';

const CPU_CORE_COUNT = cpus().length;

enum WorkerTypes {
  compile = 'compile',
  extract = 'extract',
  generate = 'generate',
}

type WorkerOutputMessage = {
  progressState: ProgressStates;
  payload?: ResultLike[];
};

export class WorkerManager extends EventEmitter {
  data: ResultLike[] = [];
  workers: WorkerThread[] = [];
  finishedWorkers = 0;
  total = 0;
  finished = 0;

  constructor() {
    super();
  }

  getClonedData(): Result[] {
    return this.data.map((d) => Object.assign(new Result(), d));
  }

  createWorkers(count: number, type: WorkerTypes): WorkerManager {
    this.stop();

    for (let i = 0; i < count; i += 1) {
      const workerThread = new WorkerThread(
        path.join(__dirname, './worker.js'),
        {
          workerData: {
            type,
          },
        },
      )
        .on(ProgressStates.Exit, (code) => {
          this.emit(ProgressStates.Exit, code);
        })
        .on(ProgressStates.Error, (error) => {
          this.emit(ProgressStates.Error, error);
        })
        .on(ProgressStates.Message, (message: WorkerOutputMessage) => {
          const { progressState, payload } = message;

          if (progressState === ProgressStates.Progress) {
            this.finished += 1;
            this.emit(ProgressStates.Progress);
          }

          if (progressState === ProgressStates.Complete) {
            this.finishedWorkers += 1;

            if (payload) {
              this.data.push(...payload);
            }

            if (this.finishedWorkers === this.workers.length) {
              this.emit(ProgressStates.Complete);
            }
          }
        });

      workerThread.stdout?.on('data', (msg) => {
        this.emit(ProgressStates.Log, msg.toString());
        if (
          process &&
          (process.env.NODE_END === 'test' ||
            process.env.NODE_END === 'development')
        ) {
          console.log(msg.toString());
        }
      });

      workerThread.stderr?.on('data', (msg) => {
        this.emit(ProgressStates.Error, msg.toString());
        if (
          process &&
          (process.env.NODE_END === 'test' ||
            process.env.NODE_END === 'development')
        ) {
          console.error(msg.toString());
        }
      });

      this.workers.push(workerThread);
    }

    return this;
  }

  async extract(directory: string, designPath: string): Promise<Result[]> {
    const totalImages = Image.readDirectory(directory);
    const designData: DesignData = await getDesignData(designPath);

    const totalWorkers = Math.min(totalImages.length, CPU_CORE_COUNT);
    const step = Math.floor(totalImages.length / totalWorkers);
    this.total = totalImages.length;

    return new Promise((resolve, reject) => {
      this.createWorkers(totalWorkers, WorkerTypes.extract)
        .on(ProgressStates.Error, reject)
        .on(ProgressStates.Complete, () => {
          resolve(this.getClonedData());
        })
        .workers.forEach((worker, index) => {
          const startIndex = index * step;
          const endIndex =
            index === totalWorkers - 1
              ? totalImages.length
              : (index + 1) * step;

          worker.postMessage({
            designData,
            imagePaths: totalImages.slice(startIndex, endIndex),
          });
        });
    });
  }

  async compile(
    resultPath: string,
    keyPath: string,
    correctMarks?: number,
    incorrectMarks?: number,
  ): Promise<Result[]> {
    const keys: Result[] | undefined = await readKey(keyPath);
    this.total = 1;

    return new Promise((resolve, reject) => {
      this.createWorkers(1, WorkerTypes.compile)
        .on(ProgressStates.Error, reject)
        .on(ProgressStates.Complete, () => {
          resolve(this.getClonedData());
        })
        .workers.forEach((worker) => {
          worker.postMessage({
            resultPath,
            keys,
            correctMarks,
            incorrectMarks,
          });
        });
    });
  }

  async generate(): Promise<WorkerManager> {
    return new Promise((resolve, reject) => {
      this.createWorkers(CPU_CORE_COUNT, WorkerTypes.generate)
        .on(ProgressStates.Error, reject)
        .on(ProgressStates.Complete, resolve);
    });
  }

  async stop(): Promise<void> {
    this.workers.forEach((w) => {
      w.unref();
      w.removeAllListeners();
      w.terminate();
    });

    this.data.length = 0;
    this.workers.length = 0;
    this.finishedWorkers = 0;
    this.total = 0;
    this.finished = 0;
  }
}
