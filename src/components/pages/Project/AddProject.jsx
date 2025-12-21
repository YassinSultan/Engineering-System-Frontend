import React, { useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { Controller, useForm, useWatch } from "react-hook-form";
import AppSelect from "../../ui/AppSelect/AppSelect";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import FileInput from "../../ui/FileInput/FileInput";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";
import { createOwnerEntity, getOwnerEntity } from "../../../api/ownerEntityApi";

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
  const onSubmit = (data) => {
    console.log("data", data);
    const formData = new FormData();
    // text fields
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
      "estimatedCost.value",
    ];
    textFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        formData.append(field, data[field]);
      }
    });
    const filesFields = [
      "networkBudgetFile",
      "siteHandoverFile",
      "estimatedCost.file",
    ];
    filesFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        formData.append(field, data[field]);
      }
    });

    // customs fields
    formData.append("contractingParty", data.contractingParty.value);
    formData.append("status", data.status.value);
    // print formData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
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
            <div className="col-span-full">
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
