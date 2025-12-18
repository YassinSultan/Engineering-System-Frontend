import React from "react";
import Modal from "../../ui/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { getUnitsTree } from "../../../api/organizationUnitsAPI";
import OrganizationalTree from "../../ui/OrganizationalTree/OrganizationalTree";
import Loading from "../Loading/Loading";

export default function OrganizationalTreeModal({ isOpen, onClose, onSelect }) {
  const { data: tree, isLoading } = useQuery({
    queryKey: ["organizationUnits"],
    queryFn: getUnitsTree,
    select: (res) => res.data,
  });

  if (isLoading) return <Loading />;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="اختر الوحدة" size="lg">
      <OrganizationalTree
        data={tree}
        onSelect={(node) => {
          onSelect(node);
          onClose();
        }}
      />
    </Modal>
  );
}
