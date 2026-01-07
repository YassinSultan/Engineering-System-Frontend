import React from "react";
import Modal from "../../ui/Modal/Modal";
import FinancialAllocationForm from "./FinancialAllocationForm";

export default function FinancialAllocationModal({
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
      title={isUpdateMode ? "تعديل التخصص المالي" : "إضافة تخصص مالي جديد"}
      size="xl"
      closeOnOverlayClick={false}
    >
      <FinancialAllocationForm
        onClose={onClose}
        projectID={projectID}
        mode={mode}
        initialData={initialData}
      />
    </Modal>
  );
}
