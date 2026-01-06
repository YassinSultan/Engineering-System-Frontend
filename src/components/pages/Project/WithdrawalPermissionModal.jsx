import React from "react";
import Modal from "../../ui/Modal/Modal";
import WithdrawalPermissionForm from "./WithdrawalPermissionForm";

export default function WithdrawalPermissionModal({
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
      title={isUpdateMode ? "تعديل سماح بالصرف" : "إضافة سماح بالصرف جديد"}
      size="xl"
      closeOnOverlayClick={false}
    >
      <WithdrawalPermissionForm
        onClose={onClose}
        projectID={projectID}
        mode={mode}
        initialData={initialData}
      />
    </Modal>
  );
}
