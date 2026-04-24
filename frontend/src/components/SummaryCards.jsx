import { motion } from 'framer-motion';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card px-4 py-3.5"
      >
        <p className="text-xs text-slate-500 mb-1">Trees found</p>
        <p className="text-xl font-semibold text-emerald-400 tabular-nums">
          {summary.total_trees}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.3 }}
        className="card px-4 py-3.5"
      >
        <p className="text-xs text-slate-500 mb-1">Cycles</p>
        <p className={`text-xl font-semibold tabular-nums ${summary.total_cycles > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
          {summary.total_cycles}
        </p>
        {summary.total_cycles > 0 && (
          <p className="text-[10px] text-amber-600 mt-0.5">loops detected</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="card px-4 py-3.5"
      >
        <p className="text-xs text-slate-500 mb-1">Deepest tree</p>
        <p className="text-xl font-semibold text-white tabular-nums">
          {summary.largest_tree_root || '—'}
        </p>
        {summary.largest_tree_root && (
          <p className="text-[10px] text-slate-600 mt-0.5">root node</p>
        )}
      </motion.div>
    </div>
  );
}
