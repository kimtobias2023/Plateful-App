// secureStoreQueue.ts
type Operation<T> = () => Promise<T>;

const queue: Operation<unknown>[] = [];
let isProcessing = false;

/**
 * Add an operation to the queue. Returns a Promise that resolves with the operation’s result.
 */
export function addSecureStoreOperation<T>(op: Operation<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    // We wrap the operation so we can resolve/reject the caller's promise
    const wrappedOp = async () => {
      try {
        const result = await op();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    queue.push(wrappedOp);
    processQueue(); // Start processing if not already
  });
}

/** Serially process the queue one operation at a time. */
async function processQueue() {
  if (isProcessing) return; // Another operation is already in progress
  isProcessing = true;

  while (queue.length > 0) {
    const currentOp = queue.shift()!; // definitely not undefined
    try {
      await currentOp();
    } catch (error) {
      // We already handled reject in the addSecureStoreOperation wrapper
      console.error('[SecureStoreQueue] Operation error:', error);
    }
  }

  isProcessing = false;
}
