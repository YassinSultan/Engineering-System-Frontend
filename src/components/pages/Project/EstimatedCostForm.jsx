import React from "react";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input/Input";
import FileInput from "../../ui/FileInput/FileInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../ui/Button/Button";
import Loading from "../../common/Loading/Loading";
import {
  createEstimatedCost,
  updateEstimatedCost,
} from "../../../api/estimatedCostAPI";

export default function EstimatedCostForm({
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
    mutate: createEstimatedCostMutate,
    isPending: createEstimatedCostIsPending,
  } = useMutation({
    mutationFn: createEstimatedCost,
    onSuccess: () => {
      toast.success("تم انشاء تخصص مالي بنجاح");
      queryClient.invalidateQueries(["project", projectID]);
      handleClose();
    },
    onError: () => {
      toast.error("حدث خطأ");
    },
  });

  const {
    mutate: updateEstimatedCostMutate,
    isPending: updateEstimatedCostIsPending,
  } = useMutation({
    mutationFn: updateEstimatedCost,
    onSuccess: () => {
      toast.success("تم تحديث التخصص المالي بنجاح");
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
      updateEstimatedCostMutate({
        projectID: projectID,
        estimatedCostId: initialData._id,
        formData,
      });
    } else {
      createEstimatedCostMutate({ id: projectID, formData });
    }
  };
  const isLoading =
    createEstimatedCostIsPending || updateEstimatedCostIsPending;
  if (isLoading) {
    return <Loading />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          rules={{ required: "هذا الحقل مطلوب" }}
          label="قيمة التكلفة التقديرية "
          {...register("value", {
            required: "هذا الحقل مطلوب",
            min: {
              value: 0,
              message: "لا يمكن ان يكون قيمة التخصص المالي اقل من صفر",
            },
            valueAsNumber: true,
          })}
          error={errors.value}
        />
        <Input
          type="date"
          rules={{ required: "هذا الحقل مطلوب" }}
          label="تاريخ التكلفة التقديرية"
          {...register("date", {
            required: "هذا الحقل مطلوب",
          })}
          error={errors.date}
        />
        <div className="col-span-full">
          <FileInput
            label="ملف التكلفة التقديرية"
            id="file"
            {...register("file")}
          />
        </div>
        <Button type="submit">{isUpdateMode ? "تعديل" : "اضافة"}</Button>
      </div>
    </form>
  );
}
