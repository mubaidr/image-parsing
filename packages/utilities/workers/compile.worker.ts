import 'v8-compile-cache';
import { CompiledResult } from '../CompiledResult';
import type { Result } from '../Result';
import { ProgressStates } from './ProgressStates';

export type WorkerCompileInputMessage = {
  resultPath: string;
  keys: Result[];
  correctMarks?: number;
  incorrectMarks?: number;
};

export type WorkerCompileOutputMessage = {
  progressState: ProgressStates;
  payload?: Result[];
};

function sendMessage(message: WorkerCompileOutputMessage): void {
  if (process && process.send) {
    process.send(message);
  }
}

export async function start(
  message: WorkerCompileInputMessage,
  isWorker = true,
): Promise<CompiledResult | undefined> {
  const { resultPath, keys, correctMarks, incorrectMarks } = message;
  const compiledResult = CompiledResult.loadFromExcel(resultPath).addKeys(keys);

  if (correctMarks && incorrectMarks) {
    compiledResult.compile(correctMarks, incorrectMarks);
  }

  // report progress status
  if (isWorker) {
    sendMessage({
      progressState: ProgressStates.Progress,
    });

    sendMessage({
      progressState: ProgressStates.Complete,
      payload: compiledResult.getKeysAndResults(),
    });
  } else {
    return compiledResult;
  }
}

if (process && process.send) {
  process.on('message', (payload: WorkerCompileInputMessage) => {
    start(payload);
  });
}
