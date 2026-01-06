import React from "react";
import ContractPermissionsForm from "./ContractPermissionsForm";
import Modal from "../../ui/Modal/Modal";

export default function ContractPermissionModal({
  projectID,
  isOpen,
  onClose,
  mode = "create", // "create" | "update"
  initialData = null,
}) {
  const isUpdateMode = mode === "update";
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdateMode ? "تعديل سماح تعاقد" : "إضافة سماح تعاقد جديد"}
      size="xl"
      closeOnOverlayClick={false}
    >
      <ContractPermissionsForm
        onClose={onClose}
        projectID={projectID}
        mode={mode}
        initialData={initialData}
      />
    </Modal>
  );
}
