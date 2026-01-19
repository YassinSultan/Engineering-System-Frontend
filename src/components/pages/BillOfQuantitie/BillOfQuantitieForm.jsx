import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { getProjectsOptions } from "../../../api/projectApi";
import AppSelect from "../../ui/AppSelect/AppSelect";
import { getCompaniesOptions } from "../../../api/companyAPI";
import Input from "../../ui/Input/Input";
import FileInput from "../../ui/FileInput/FileInput";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBillOfQuantitie,
  getBillOfQuantitie,
  updateBillOfQuantitie,
} from "../../../api/billOfQuantitieAPI";
import { useAuth } from "../../../hooks/useAuth";
import { useParams } from "react-router";
import Loading from "../../common/Loading/Loading";
import OrganizationalTreeModal from "../../common/OrganizationalTreeModal/OrganizationalTreeModal";
import Button from "../../ui/Button/Button";

const allDisciplines = [
  { value: "GENERAL", label: "اعتيادي" },
  { value: "PLUMBING", label: "صحي" },
  { value: "FIRE_FIGHTING", label: "حريق" },
  { value: "ELECTRICAL", label: "كهرباء" },
  { value: "HVAC", label: "تكييف" },
  { value: "MAINTENANCE", label: "صيانة" },
  { value: "LANDSCAPING", label: "زراعات" },
  { value: "INFRASTRUCTURE", label: "شبكة مرافق" },
  { value: "SWIMMING_POOLS", label: "حمامات سباحة" },
];

export default function BillOfQuantitieForm({ mode = "create" }) {
  console.log("mode", mode);
  const { user } = useAuth();
  const { id } = useParams();
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const isUpdate = mode === "update";

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getBillOfQuantitie(id),
    select: (res) => res.data,
    enabled: mode === "update",
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      project: null,
      company: null,
      name: "",
      projectDuration: "",
      area: "",
      pricePerMeter: "",
      steelPrice: "",
      cementPrice: "",
      completionPercentage: "",
      disciplines: allDisciplines.map((d) => ({
        type: d.value,
        selected: false,
        amount: "",
      })),
      boqExcel: null,
      boqPdf: null,
      priceAnalysisPdf: null,
      approvedDrawingsPdf: null,
      approvedDrawingsDwg: null,
      consultantApprovalPdf: null,
      companyProfilePdf: null,
    },
  });
  const selectedUnit = useWatch({
    control,
    name: "organizationalUnit",
  });
  // مراقبة التخصصات لمعرفة أيها مختار
  const disciplines = useWatch({ control, name: "disciplines" }) || [];
  const mutation = useMutation({
    mutationFn:
      mode === "create" ? createBillOfQuantitie : updateBillOfQuantitie,
    onSuccess: (res) => {
      console.log("res", res);
      toast.success(
        mode === "create"
          ? "تم إنشاء المقايسة بنجاح"
          : "تم تحديث المقايسة بنجاح",
      );
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        mode === "create"
          ? "حدث خطأ في انشاء المقايسة"
          : "حدث خطأ في تحديث المقايسة",
      );
    },
  });
  const onSubmit = async (data) => {
    try {
      const getNestedValue = (obj, path) =>
        path
          .replace(/\[(\w+)\]/g, ".$1")
          .split(".")
          .reduce((acc, key) => acc?.[key], obj);
      const formData = new FormData();
      const textFields = [
        "name",
        "projectDuration",
        "area",
        "pricePerMeter",
        "steelPrice",
        "cementPrice",
        "completionPercentage",
      ];
      // إضافة الحقول النصية / الأرقام العادية
      textFields.forEach((field) => {
        const value = getNestedValue(data, field);
        if (value !== undefined && value !== null) {
          formData.append(field, value);
        }
      });

      // التخصصات – فقط المختارة
      const selectedDisciplines = data.disciplines
        .filter((d) => d.selected)
        .map((d) => ({ type: d.type, amount: d.amount }));
      formData.append("disciplines", JSON.stringify(selectedDisciplines));

      const fileFields = [
        "boqExcel",
        "boqPdf",
        "priceAnalysisPdf",
        "approvedDrawingsPdf",
        "approvedDrawingsDwg",
        "consultantApprovalPdf",
        "companyProfilePdf",
      ];
      // إضافة الملفات – فقط إذا تم اختيار ملف
      fileFields.forEach((field) => {
        const value = getNestedValue(data, field);
        if (value instanceof FileList && value.length > 0) {
          formData.append(field, value[0]);
        }
      });
      // select fields
      if (data.project?.value) {
        formData.append("project", data.project.value);
      }
      if (data.company?.value) {
        formData.append("company", data.company.value);
      }
      if (data.organizationalUnit) {
        formData.append("organizationalUnit", data.organizationalUnit._id);
      }
      // print the form data
      console.log("form data");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      mutation.mutate({
        id: data._id,
        data: formData,
      });
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      toast.error("حدث خطاء اثناء الإرسال");
    }
  };
  const canSelectUnit =
    user.permissions.some(
      (p) =>
        p.action === "BillOfQuantitie:create:BillOfQuantitie" &&
        (p.scope === "ALL" || p.scope === "CUSTOM_UNIT"),
    ) || user.role === "SUPER_ADMIN";

  if (isLoading) return <Loading />;
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle
            title={isUpdate ? "إضافة مقايسة جديد" : "تعديل المقايسة"}
          />
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: "المشروع مطلوب" }}
                  render={({ field, fieldState }) => (
                    <AppSelect
                      loadOptionsFn={getProjectsOptions}
                      isCreatable={false}
                      label="المشروع"
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                      error={fieldState.error?.message}
                      isRequired
                    />
                  )}
                />

                <Controller
                  name="company"
                  control={control}
                  rules={{ required: "الجهة المالكة مطلوبة" }}
                  render={({ field, fieldState }) => (
                    <AppSelect
                      loadOptionsFn={getCompaniesOptions}
                      isCreatable={false}
                      label="الشركة"
                      value={field.value}
                      onChange={field.onChange}
                      isInvalid={!!fieldState.error}
                      error={fieldState.error?.message}
                      isRequired
                    />
                  )}
                />
              </div>

              <Input
                label="اسم المقايسة"
                {...register("name", { required: "الاسم مطلوب" })}
                error={errors.name}
              />

              <Input
                type="number"
                label="مدة المشروع بالشهور"
                {...register("projectDuration", {
                  required: "مدة المشروع مطلوبة",
                })}
                error={errors.projectDuration}
              />

              <Input
                type="number"
                label="المسطح"
                {...register("area", { required: "المسطح مطلوب" })}
                error={errors.area}
              />

              <Input
                type="number"
                label="سعر المتر المسطح"
                {...register("pricePerMeter", {
                  required: "سعر المتر المسطح مطلوب",
                })}
                error={errors.pricePerMeter}
              />

              <Input
                type="number"
                label="سعر الحديد"
                {...register("steelPrice", { required: "سعر الحديد مطلوب" })}
                error={errors.steelPrice}
              />

              <Input
                type="number"
                label="سعر الاسمنت"
                {...register("cementPrice", { required: "سعر الاسمنت مطلوب" })}
                error={errors.cementPrice}
              />

              <Input
                type="number"
                label="نسبة التنفيذ"
                min="0"
                max="100"
                step="0.01"
                {...register("completionPercentage", {
                  required: "مطلوب",
                  min: { value: 0, message: "الحد الأدنى 0" },
                  max: { value: 100, message: "الحد الأقصى 100" },
                })}
                error={errors.completionPercentage}
              />
            </div>

            {/* قسم التخصصات */}
            <div className="col-span-full mt-2">
              <label className="block text-lg font-medium mb-4">
                تخصصات المقايسة
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allDisciplines.map((disc, index) => {
                  const isSelected = disciplines[index]?.selected || false;

                  return (
                    <div
                      key={disc.value}
                      className={`p-4 border rounded-lg transition-all duration-200 flex justify-between items-center ${
                        isSelected
                          ? "border-blue-500  shadow-sm"
                          : "border-gray-200 "
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`disc-${disc.value}`}
                          checked={isSelected}
                          onChange={(e) => {
                            setValue(
                              `disciplines.${index}.selected`,
                              e.target.checked,
                            );
                            // إذا ألغى التحديد → امسح المبلغ
                            if (!e.target.checked) {
                              setValue(`disciplines.${index}.amount`, "");
                            }
                          }}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`disc-${disc.value}`}
                          className="mr-3  font-medium cursor-pointer select-none"
                        >
                          {disc.label}
                        </label>
                      </div>

                      <div>
                        <Input
                          disabled={!isSelected}
                          type="number"
                          label="المبلغ"
                          placeholder="0.00"
                          {...register(`disciplines.${index}.amount`, {
                            required: isSelected
                              ? "المبلغ مطلوب لهذا التخصص"
                              : false,
                            min: { value: 0, message: "المبلغ ≥ 0" },
                            valueAsNumber: true,
                          })}
                          error={errors.disciplines?.[index]?.amount}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ──────────────── قسم المرفقات (Attachments) ──────────────── */}
            <div className="col-span-full mt-10">
              <label className="block text-xl font-semibold mb-4 text-gray-800">
                المرفقات والمستندات
              </label>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { key: "boqExcel", label: "BOQ Excel" },
                  { key: "boqPdf", label: "BOQ PDF" },
                  { key: "priceAnalysisPdf", label: "تحليل الأسعار PDF" },
                  {
                    key: "approvedDrawingsPdf",
                    label: "الرسومات المعتمدة PDF",
                  },
                  {
                    key: "approvedDrawingsDwg",
                    label: "الرسومات المعتمدة DWG",
                  },
                  {
                    key: "consultantApprovalPdf",
                    label: "موافقة الاستشاري PDF",
                  },
                  { key: "companyProfilePdf", label: "ملف الشركة PDF" },
                ].map(({ key, label }) => (
                  <FileInput
                    label={label}
                    id={key}
                    existingFiles={
                      mode === "update" && data?.[key] ? data[key] : []
                    }
                    {...register(key, {
                      required: mode === "create",
                    })}
                  />
                ))}
              </div>
            </div>
            {canSelectUnit && (
              <div className="col-span-full mt-2">
                <label className="block text-sm font-medium mb-1">
                  الوحدة التابع لها
                </label>

                <div
                  onClick={() => setIsUnitModalOpen(true)}
                  className="border rounded px-3 py-2 cursor-pointer"
                >
                  {selectedUnit?.name || "اختر الوحدة التابع لها"}
                </div>

                {errors.organizationalUnit && (
                  <p className="text-red-500 text-sm mt-1">
                    الوحدة التابع لها مطلوبة
                  </p>
                )}
              </div>
            )}
            {/* زر الإرسال */}
            <div className="mt-4">
              <Button type="submit">
                {mode === "create" ? "حفظ" : "تحديث"}
              </Button>
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
