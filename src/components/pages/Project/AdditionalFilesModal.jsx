import React from "react";
import ContractPermissionsForm from "./ContractPermissionsForm";
import Modal from "../../ui/Modal/Modal";
import PresentationFileForm from "./PresentationFileForm";
import AerialPhotographyFileForm from "./AerialPhotographyFileForm";

export default function AdditionalFilesModal({
  projectID,
  isOpen,
  onClose,
  modalFor = "presentationFile", //"presentationFile" |"aerialPhotographyFile"
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        modalFor === "presentationFile" ? "ملف العرض" : "ملف التصوير الجوي"
      }
      size="xl"
      closeOnOverlayClick={false}
    >
      {modalFor === "presentationFile" && (
        <PresentationFileForm onClose={onClose} projectID={projectID} />
      )}
      {modalFor === "aerialPhotographyFile" && (
        <AerialPhotographyFileForm onClose={onClose} projectID={projectID} />
      )}
    </Modal>
  );
}
