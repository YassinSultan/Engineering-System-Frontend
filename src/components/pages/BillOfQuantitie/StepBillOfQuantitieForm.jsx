import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { updateStepOfBillOfQuantitie } from "../../../api/billOfQuantitieAPI";
import toast from "react-hot-toast";
import Button from "../../ui/Button/Button";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import FileInput from "../../ui/FileInput/FileInput";

export default function StepBillOfQuantitieForm({
  billID,
  step = "next",
  onClose,
}) {
  const queryClient = useQueryClient();
  const isNextStep = step === "next";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "notes",
  });
  const handleClose = () => {
    reset();
    onClose();
  };
  const { mutate, isPending } = useMutation({
    mutationFn: updateStepOfBillOfQuantitie,
    onSuccess: () => {
      toast.success("تم تحديث المقايسة بنجاح");
      queryClient.invalidateQueries(["bill-of-quantitie", billID]);
      handleClose();
    },
    onError: (e) => {
      console.log(e);
      toast.error(e.response?.data?.message || "حدث خطأ اثناء تحديث المقايسة");
    },
  });
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("boqPdf", data.boqPdf[0]);
    data.notes.forEach((note) => formData.append("notes", note.note));
    // print key value pairs
    console.log("data", formData);
    formData.forEach((value, key) => console.log(key, value));
    mutate({
      id: billID,
      stepName: isNextStep ? "next" : "prev",
      formData: formData,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="col-span-full">
        <FileInput
          label="تسجيل خطاب المقايسة"
          id="boqPdf"
          {...register("boqPdf", {
            required: "تسجيل خطاب المقايسة مطلوب",
          })}
        />
        {errors?.boqPdf && (
          <p className="text-red-500 text-sm mt-2">{errors?.boqPdf.message}</p>
        )}
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-4">
          <label
            htmlFor={`notes.${index}.note`}
            className="block mb-2 text-sm font-medium"
          >
            ملاحظة {index + 1}
          </label>

          <div className="flex gap-2">
            <textarea
              id={`notes.${index}.note`}
              {...register(`notes.${index}.note`, {
                required: "ملاحظة مطلوبة",
              })}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded resize-none"
              placeholder="اكتب الملاحظة هنا..."
            />

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-e-2xl cursor-pointer hover:bg-red-600 transition "
              >
                <FaX />
              </button>
            )}
          </div>
          {errors?.notes?.[index]?.note && (
            <p className="text-red-500 text-sm mt-2">
              {errors?.notes?.[index]?.note?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          icon={<FaPlus />}
          onClick={() => append({ note: "" })}
        >
          اضافة ملاحظة
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FaPlus />}
            onClick={() => handleClose()}
          >
            إلغاء
          </Button>

          <Button
            disabled={isPending}
            type="submit"
            variant="primary"
            icon={<FaPlus />}
          >
            {isPending
              ? "جاري التحديث..."
              : isNextStep
                ? "رفع للمرحلة التالية"
                : "إرجاع للاستيفاء"}
          </Button>
        </div>
      </div>
    </form>
  );
}
