import React from "react";
import Modal from "../../ui/Modal/Modal";
import EstimatedCostForm from "./EstimatedCostForm";

export default function EstimatedCostModal({
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
      title={
        isUpdateMode ? "تعديل التكلفة التقديرية " : "إضافة تكلفة تقديرية جديدة"
      }
      size="xl"
      closeOnOverlayClick={false}
    >
      <EstimatedCostForm
        onClose={onClose}
        projectID={projectID}
        mode={mode}
        initialData={initialData}
      />
    </Modal>
  );
}
