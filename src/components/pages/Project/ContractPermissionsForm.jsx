import React from "react";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input/Input";
import FileInput from "../../ui/FileInput/FileInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContractPerrmission,
  updateContractPerrmission,
} from "../../../api/contractPerrmissionsAPI";
import toast from "react-hot-toast";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";

export default function ContractPermissionsForm({
  projectID,
  mode = "create",
  initialData = null,
  onClose,
}) {
  const queryClient = useQueryClient();
  const isUpdateMode = mode === "update";
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isUpdateMode
      ? {
          value: initialData?.value || "",
          date: new Date(initialData?.date).toISOString().split("T")[0] || "",
          file: [],
        }
      : {
          value: "",
          date: "",
          file: [],
        },
  });
  const handleClose = () => {
    reset();
    onClose();
  };
  /* mutation */
  const {
    mutate: createContractPermissionMutate,
    isPending: createContractPermissionIsPending,
  } = useMutation({
    mutationFn: createContractPerrmission,
    onSuccess: () => {
      toast.success("تم انشاء سماح بالتعاقد بنجاح");
      queryClient.invalidateQueries(["project", projectID]);
      handleClose();
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  const {
    mutate: updateContractPermissionMutate,
    isPending: updateContractPermissionIsPending,
  } = useMutation({
    mutationFn: updateContractPerrmission,
    onSuccess: () => {
      toast.success("تم تحديث سماح بالتعاقد بنجاح");
      queryClient.invalidateQueries(["project", projectID]);
      handleClose();
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("value", data.value);
    formData.append("date", data.date);
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }
    if (isUpdateMode) {
      updateContractPermissionMutate({
        projectID: projectID,
        contractID: initialData._id,
        formData,
      });
    } else {
      createContractPermissionMutate({ id: projectID, formData });
    }
  };
  const isLoading =
    createContractPermissionIsPending || updateContractPermissionIsPending;
  if (isLoading) {
    return <Loading />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          rules={{ required: "هذا الحقل مطلوب" }}
          label="قيمة التعاقد"
          {...register("value", {
            required: "هذا الحقل مطلوب",
            min: {
              value: 0,
              message: "لا يمكن ان يكون قيمة التعاقد اقل من صفر",
            },
            valueAsNumber: true,
          })}
          error={errors.value}
        />
        <Input
          type="date"
          rules={{ required: "هذا الحقل مطلوب" }}
          label="تاريخ التعاقد"
          {...register("date", {
            required: "هذا الحقل مطلوب",
          })}
          error={errors.date}
        />
        <div className="col-span-full">
          <FileInput label="ملف التعاقد" id="file" {...register("file")} />
        </div>
        <Button type="submit">{isUpdateMode ? "تعديل" : "اضافة"}</Button>
      </div>
    </form>
  );
}
