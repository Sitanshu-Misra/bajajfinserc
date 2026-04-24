import { motion } from 'framer-motion';
import { useState } from 'react';

function TreeNode({ name, children, depth = 0, isLast = false }) {
  const [expanded, setExpanded] = useState(true);
  const childKeys = Object.keys(children || {}).sort();
  const isLeaf = childKeys.length === 0;

  return (
    <div className={depth > 0 ? 'tree-node' : ''}>
      <div
        className="flex items-center gap-1.5 cursor-pointer group py-px"
        onClick={() => !isLeaf && setExpanded(!expanded)}
      >
        {!isLeaf ? (
          <span className={`text-[10px] text-slate-500 transition-transform duration-150 select-none ${expanded ? 'rotate-90' : ''}`}>
            ▸
          </span>
        ) : (
          <span className="text-[10px] text-slate-700 w-2.5 text-center">─</span>
        )}
        <span className={`font-mono text-[13px] px-1.5 py-px rounded transition-colors duration-100
          ${depth === 0
            ? 'font-semibold text-indigo-300 bg-indigo-500/10'
            : isLeaf
              ? 'text-slate-400'
              : 'text-slate-300 group-hover:text-white'
          }`}
        >
          {name}
        </span>
      </div>
      {expanded && childKeys.length > 0 && (
        <div>
          {childKeys.map((key, i) => (
            <TreeNode
              key={key}
              name={key}
              children={children[key]}
              depth={depth + 1}
              isLast={i === childKeys.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ hierarchies }) {
  if (!hierarchies || hierarchies.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-400 mb-3">
        Structures ({hierarchies.length})
      </h3>
      <div className="space-y-3">
        {hierarchies.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className={`card p-4 ${h.has_cycle ? 'border-l-2 border-l-amber-500/60' : 'border-l-2 border-l-emerald-500/40'}`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 rounded
                ${h.has_cycle
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {h.has_cycle ? 'cycle' : 'tree'}
              </span>
              <span className="font-mono text-sm text-slate-400">
                root: <span className="text-white">{h.root}</span>
              </span>
              {h.depth && (
                <span className="text-xs text-slate-600 ml-auto font-mono">depth {h.depth}</span>
              )}
            </div>

            {h.has_cycle ? (
              <p className="text-sm text-slate-500 py-2 pl-1">
                Hmm, there's a loop here — nodes circle back, so no tree to show.
              </p>
            ) : (
              <div className="pl-0.5 pt-1">
                {Object.keys(h.tree).map(root => (
                  <TreeNode key={root} name={root} children={h.tree[root]} depth={0} />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
