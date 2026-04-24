import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { postBfhl } from './api/bfhlApi';
import SummaryCards from './components/SummaryCards';
import TreeView from './components/TreeView';
import EntryLists from './components/EntryLists';

const SAMPLE_INPUT = 'A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, G->R, G->H, G->I, hello, 1->2, A->';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('You need to enter some edges first — try something like A->B, B->C');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setShowJson(false);

    const start = Date.now();

    try {
      const data = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      const res = await postBfhl(data);
      setResponseTime(Date.now() - start);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Something went wrong — check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  const edgeCount = input.trim() ? input.split(',').filter(s => s.trim()).length : 0;

  return (
    <div className="min-h-screen text-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            BFHL Graph Analyzer
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Paste comma-separated edges like <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">A-&gt;B</code> and hit analyze.
          </p>
        </header>

        <div className="card p-5 mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="edge-input" className="text-sm font-medium text-slate-300">
              Edges
            </label>
            {edgeCount > 0 && (
              <span className="text-xs text-slate-500">{edgeCount} edge{edgeCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          <textarea
            id="edge-input"
            rows={3}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="A->B, A->C, B->D, C->E ..."
            spellCheck={false}
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-md px-3.5 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none"
          />

          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <button
              id="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:bg-indigo-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze'}
            </button>

            <button
              onClick={() => setInput(SAMPLE_INPUT)}
              className="px-3.5 py-2 text-slate-400 hover:text-slate-200 text-sm rounded-md border border-slate-600/40 hover:border-slate-500/50 transition-colors duration-150"
            >
              Try example
            </button>

            <span className="text-xs text-slate-600 hidden sm:inline ml-1">Ctrl+Enter to run</span>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5 px-4 py-3 rounded-md bg-red-500/8 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">Results</h2>
                {responseTime && (
                  <span className="text-xs text-slate-500 font-mono">{responseTime}ms</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className={`text-xs px-2.5 py-1.5 rounded border transition-colors duration-150 ${
                    showJson
                      ? 'bg-slate-700 border-slate-600 text-slate-300'
                      : 'bg-transparent border-slate-700 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {showJson ? 'Hide' : 'Show'} JSON
                </button>
                <button
                  onClick={handleCopy}
                  className="text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-500 hover:text-slate-400 transition-colors duration-150"
                >
                  {copied ? '✓ Copied' : 'Copy output'}
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <SummaryCards summary={result.summary} />

              <TreeView hierarchies={result.hierarchies} />

              <EntryLists invalidEntries={result.invalid_entries} duplicateEdges={result.duplicate_edges} />

              <AnimatePresence>
                {showJson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="card p-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 font-medium">Response payload</span>
                      <span className="text-xs text-slate-600 font-mono">
                        {JSON.stringify(result).length} bytes
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-slate-400 bg-slate-900/50 rounded p-3 overflow-x-auto max-h-72 overflow-y-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <footer className="text-xs text-slate-700 mt-14 pt-4 border-t border-slate-800">
          Bajaj Finserv Health · SRM Full Stack Challenge
        </footer>
      </div>
    </div>
  );
}
