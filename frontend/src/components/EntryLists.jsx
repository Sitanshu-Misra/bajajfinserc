import { motion } from 'framer-motion';

export default function EntryLists({ invalidEntries, duplicateEdges }) {
  const hasInvalid = invalidEntries && invalidEntries.length > 0;
  const hasDuplicates = duplicateEdges && duplicateEdges.length > 0;

  if (!hasInvalid && !hasDuplicates) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {hasInvalid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <h4 className="text-sm font-medium text-red-400">Rejected</h4>
            <span className="text-[10px] text-slate-600">{invalidEntries.length} bad input{invalidEntries.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {invalidEntries.map((item, i) => (
              <span
                key={i}
                className="font-mono text-xs text-red-400/80 bg-red-500/8 px-2 py-1 rounded border border-red-500/15"
                title="Didn't match the X->Y format"
              >
                {item || '""'}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Only single uppercase letters with -&gt; are valid</p>
        </motion.div>
      )}

      {hasDuplicates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <h4 className="text-sm font-medium text-yellow-500">Duplicates</h4>
            <span className="text-[10px] text-slate-600">seen more than once</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {duplicateEdges.map((item, i) => (
              <span
                key={i}
                className="font-mono text-xs text-yellow-500/80 bg-yellow-500/8 px-2 py-1 rounded border border-yellow-500/15"
                title="First occurrence was used, rest ignored"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-2">First occurrence kept, rest skipped</p>
        </motion.div>
      )}
    </div>
  );
}
