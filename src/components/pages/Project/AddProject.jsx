import React, { useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { Controller, useForm, useWatch } from "react-hook-form";
import AppSelect from "../../ui/AppSelect/AppSelect";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import FileInput from "../../ui/FileInput/FileInput";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";
import { createOwnerEntity, getOwnerEntity } from "../../../api/ownerEntityApi";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../../api/projectApi";
import toast from "react-hot-toast";

export default function AddProject() {
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const contractingParty = useWatch({
    control,
    name: "contractingParty",
  });
  const selectedUnit = useWatch({
    control,
    name: "organizationalUnit",
  });

  const mutation = useMutation({
    mutationKey: ["createProject"],
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("تم انشاء المشروع بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
  });
  const onSubmit = (data) => {
    const getNestedValue = (obj, path) =>
      path.split(".").reduce((acc, key) => acc?.[key], obj);

    console.log("data", data);

    const formData = new FormData();

    const textFields = [
      "name",
      "code",
      "startDate",
      "location",
      "coordinates.lat",
      "coordinates.lng",
      "landArea",
      "fiscalYear",
      "estimatedCost.value",
    ];

    textFields.forEach((field) => {
      const value = getNestedValue(data, field);
      if (value !== undefined && value !== null) {
        formData.append(field, value);
      }
    });

    const fileFields = [
      "networkBudgetFile",
      "siteHandoverFile",
      "estimatedCost.file",
      "securityApprovalFile",
    ];

    fileFields.forEach((field) => {
      const value = getNestedValue(data, field);
      console.log("value", value);
      if (value !== undefined && value !== null) {
        formData.append(field, value[0]);
      }
    });

    // select fields
    if (data.contractingParty?.value) {
      formData.append("contractingParty", data.contractingParty.value);
    }
    if (data.organizationalUnit) {
      formData.append("organizationalUnit", data.organizationalUnit._id);
    }
    if (data.ownerEntity?.value) {
      formData.append("ownerEntity", data.ownerEntity.value);
    }
    if (data.status?.value) {
      formData.append("status", data.status.value);
    }

    // Debug
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    mutation.mutate(formData);
  };
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle title="اضافة مشروع جديد" />
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-2">
              <div>
                <Input
                  label="اسم المشروع"
                  {...register("name", { required: "اسم المشروع مطلوب" })}
                  error={errors.name}
                  rules={{ required: "الوظيفة مطلوبة" }}
                />
              </div>
              <div>
                <Controller
                  name="contractingParty"
                  control={control}
                  rules={{ required: "الجهة مطلوبة" }}
                  render={({ field, fieldState }) => (
                    <AppSelect
                      options={[
                        {
                          value: "CIVILIAN",
                          label: "جهة مدنية",
                        },
                        {
                          value: "MILITARY",
                          label: "جهة قوات مسلحة",
                        },
                        {
                          value: "BUDGET",
                          label: "جهة موازنة",
                        },
                      ]}
                      label="جهة التعاقد"
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                      error={fieldState.error?.message}
                      isRequired
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "حالة المشروع مطلوبة" }}
                  render={({ field, fieldState }) => (
                    <AppSelect
                      options={[
                        {
                          value: "STUDY",
                          label: "دراسة",
                        },
                        {
                          value: "ONGOING",
                          label: "جاري",
                        },
                        {
                          value: "FINISHED",
                          label: "منتهي",
                        },
                      ]}
                      label="جهة التعاقد"
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                      error={fieldState.error?.message}
                      isRequired
                    />
                  )}
                />
              </div>
              <div>
                <Input
                  label="كود المشروع"
                  {...register("code", { required: "كود المشروع مطلوب" })}
                  error={errors.code}
                  rules={{ required: "كود المشروع مطلوب" }}
                />
              </div>
              <div>
                <Input
                  type="date"
                  label="تاريخ بدء المشروع"
                  {...register("startDate", {
                    required: "تاريخ بدء المشروع مطلوب",
                  })}
                  error={errors.startDate}
                  rules={{ required: "تاريخ بدء المشروع مطلوب" }}
                />
              </div>
              <div>
                <Input
                  label="موقع المشروع"
                  {...register("location", {
                    required: "موقع المشروع مطلوب",
                  })}
                  error={errors.location}
                  rules={{ required: "موقع المشروع مطلوب" }}
                />
              </div>
              <div>
                <Input
                  label="مساحة المشروع بالمتر مربع"
                  {...register("landArea", {
                    required: "مساحة المشروع مطلوب",
                  })}
                  error={errors.landArea}
                  rules={{ required: "مساحة المشروع مطلوب" }}
                />
              </div>
              <div className="col-span-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <FileInput
                    label="ملف الميزانية الشبكية"
                    id="networkBudgetFile"
                    {...register("networkBudgetFile", { required: true })}
                  />
                  <FileInput
                    label="ملف استلام الموقع"
                    id="siteHandoverFile"
                    {...register("siteHandoverFile", { required: true })}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <Input
                      label="احداثي الارض (خط الطول)"
                      {...register("coordinates.lat", {
                        required: "احداثي ارض المشروع مطلوب",
                      })}
                      error={errors.location}
                      rules={{ required: "احداثي ارض المشروع مطلوب" }}
                    />
                  </div>
                  <div>
                    <Input
                      label="احداثي الارض (خط العرض)"
                      {...register("coordinates.lng", {
                        required: "احداثي ارض المشروع مطلوب",
                      })}
                      error={errors.location}
                      rules={{ required: "احداثي ارض المشروع مطلوب" }}
                    />
                  </div>
                </div>
              </div>
              {contractingParty?.value === "BUDGET" && (
                <div>
                  <Input
                    label="العام المالي"
                    {...register("fiscalYear", {
                      required: "العام المالي مطلوب",
                    })}
                    error={errors.fiscalYear}
                    rules={{ required: "العام المالي مطلوب" }}
                  />
                </div>
              )}
              {contractingParty?.value === "BUDGET" ||
                (contractingParty?.value === "MILITARY" && (
                  <div className="col-span-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
                      <div className="col-span-full">
                        <Input
                          label="التكلفة التقديرية (القيمة)"
                          {...register("estimatedCost.value", {
                            required: "التكلفة التقديرية (القيمة) مطلوبة",
                          })}
                          error={errors.estimatedCost?.value}
                          rules={{
                            required: "التكلفة التقديرية (القيمة) مطلوبة",
                          }}
                        />
                      </div>
                      <div>
                        <FileInput
                          label="التكلفة التقديرية (الملف)"
                          id="estimatedCost.file"
                          multiple
                          {...register("estimatedCost.file", {
                            required: true,
                          })}
                        />
                      </div>
                      <div>
                        <FileInput
                          label="ملف تصديق الامانة"
                          id="securityApprovalFile"
                          multiple
                          {...register("securityApprovalFile", {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {contractingParty?.value === "CIVILIAN" && (
                <div>
                  <Controller
                    name="ownerEntity"
                    control={control}
                    rules={{ required: "الجهة المالكة مطلوبة" }}
                    render={({ field, fieldState }) => (
                      <AppSelect
                        loadOptionsFn={getOwnerEntity}
                        createOptionsFn={createOwnerEntity}
                        isCreatable
                        label="الجهة المالكة"
                        value={field.value}
                        onChange={field.onChange}
                        isInvalid={!!fieldState.error}
                        error={fieldState.error?.message}
                        isRequired
                      />
                    )}
                  />
                </div>
              )}
            </div>
            <div className="col-span-full mt-2">
              <label className="block text-sm font-medium mb-1">
                الوحدة التابع لها
              </label>

              <div
                onClick={() => setIsUnitModalOpen(true)}
                className="border rounded px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {selectedUnit?.name || "اختر الوحدة التابع لها"}
              </div>

              {errors.organizationalUnit && (
                <p className="text-red-500 text-sm mt-1">
                  الوحدة التابع لها مطلوبة
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button type="submit">حفظ</Button>
            </div>
          </form>
        </div>
        <OrganizationalTreeModal
          isOpen={isUnitModalOpen}
          onClose={() => setIsUnitModalOpen(false)}
          onSelect={(unit) => {
            console.log("unit", unit[0]);
            setValue("organizationalUnit", unit[0], {
              shouldValidate: true,
            });
          }}
          multiple={false}
        />
      </section>
    </>
  );
}
