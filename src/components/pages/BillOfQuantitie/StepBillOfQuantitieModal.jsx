import React from "react";
import Modal from "../../ui/Modal/Modal";
import StepBillOfQuantitieForm from "./StepBillOfQuantitieForm";

export default function StepBillOfQuantitieModal({
  billID,
  isOpen,
  onClose,
  step = "next", // "next" | "prev"
  initialData = null,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === "next" ? "رفع المقايسة" : "استيفاء المقايسة"}
      size="xl"
      closeOnOverlayClick={false}
    >
      <StepBillOfQuantitieForm
        onClose={onClose}
        billID={billID}
        step={step}
        initialData={initialData}
      />
    </Modal>
  );
}
