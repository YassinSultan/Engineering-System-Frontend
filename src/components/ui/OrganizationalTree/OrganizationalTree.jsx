// components/OrganizationalTree.jsx

import TreeNode from "../TreeNode/TreeNode";

export default function OrganizationalTree({ data, onSelect }) {
  return (
    <div className="p-3">
      {data.map((node) => (
        <TreeNode key={node._id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
}
