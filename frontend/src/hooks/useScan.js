import { useState, useCallback } from 'react';

export function useScan(scanFn) {
  const [state, setState] = useState({
    status: 'idle', // idle | scanning | done | error
    result: null,
    error: null,
    progress: 0,
  });

  const run = useCallback(async (...args) => {
    setState({ status: 'scanning', result: null, error: null, progress: 0 });

    // Simulate staged progress
    const stages = [15, 35, 60, 80, 95];
    let i = 0;
    const ticker = setInterval(() => {
      if (i < stages.length) {
        setState(s => ({ ...s, progress: stages[i++] }));
      }
    }, 300);

    try {
      const result = await scanFn(...args);
      clearInterval(ticker);
      setState({ status: 'done', result, error: null, progress: 100 });
      return result;
    } catch (err) {
      clearInterval(ticker);
      setState({ status: 'error', result: null, error: err.message, progress: 0 });
      throw err;
    }
  }, [scanFn]);

  const reset = useCallback(() => {
    setState({ status: 'idle', result: null, error: null, progress: 0 });
  }, []);

  return { ...state, run, reset };
}
