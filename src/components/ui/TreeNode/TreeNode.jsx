// components/TreeNode.jsx
import { useState } from "react";
import { BiMinus, BiNavigation, BiPlus } from "react-icons/bi";

export default function TreeNode({ node, level = 0, onSelect }) {
  const [open, setOpen] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 cursor-pointer px-2 py-1 my-1 hover:text-primary-500"
        style={{ marginRight: `${level * 15}px` }}
        onClick={() => onSelect?.(node)}
      >
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="text-xs w-4 h-4 border border-gray-300 rounded flex items-center justify-center"
          >
            {open ? <BiMinus /> : <BiPlus />}
          </span>
        )}

        {!hasChildren && <span className="w-4" />}

        <span className="font-medium">{node.name}</span>

        <span className="text-xs text-gray-500">({node.type})</span>
      </div>

      {open &&
        hasChildren &&
        node.children.map((child) => (
          <TreeNode
            key={child._id}
            node={child}
            level={level + 1}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
