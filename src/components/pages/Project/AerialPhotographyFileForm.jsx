import React from "react";
import { useForm } from "react-hook-form";
import FileInput from "../../ui/FileInput/FileInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import { updateAerialPhotographyFile } from "../../../api/projectApi";

export default function AerialPhotographyFileForm({ projectID, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      file: [],
    },
  });
  const handleClose = () => {
    reset();
    onClose();
  };
  /* mutation */
  const {
    mutate: updateAerialPhotographyFileMutate,
    isPending: updateAerialPhotographyFileIsPending,
  } = useMutation({
    mutationFn: updateAerialPhotographyFile,
    onSuccess: () => {
      toast.success("تم تحديث ملف التصوير الجوي بنجاح");
      queryClient.invalidateQueries(["project", projectID]);
      handleClose();
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }
    updateAerialPhotographyFileMutate({ id: projectID, formData });
  };
  const isLoading = updateAerialPhotographyFileIsPending;
  if (isLoading) {
    return <Loading />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <FileInput
            label="ملف التصوير الجوي"
            id="file"
            {...register("file")}
          />
        </div>
        <Button type="submit">اضافة</Button>
      </div>
    </form>
  );
}
