import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { FaPlus } from "react-icons/fa";
import { BiSolidTrash } from "react-icons/bi";

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
      disciplines: [],
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "disciplines",
  });
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
        .filter((d) => d.type && d.amount)
        .map((d) => ({
          type: d.type.value,
          amount: Number(d.amount),
        }));

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
  useEffect(() => {
    if (!canSelectUnit) {
      setValue("organizationalUnit", user.organizationalUnit, {
        shouldValidate: true,
      });
    }
  }, [canSelectUnit, user, setValue]);
  if (isLoading) return <Loading />;
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle
            title={isUpdate ? "تعديل المقايسة" : "إضافة مقايسة جديد"}
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
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between gap-4 border p-4 rounded-md bg-gray-50"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Discipline Type */}
                      <Controller
                        name={`disciplines.${index}.type`}
                        control={control}
                        rules={{ required: "نوع التخصص مطلوب" }}
                        render={({ field: controllerField, fieldState }) => {
                          // Get all currently selected types (except the current row)
                          const selectedTypes = fields
                            .filter((f, i) => i !== index) // exclude current row
                            .map((f) => f.type?.value) // get value string
                            .filter(Boolean); // remove undefined/null

                          // Filter available options
                          const availableOptions = allDisciplines.filter(
                            (opt) => !selectedTypes.includes(opt.value),
                          );

                          return (
                            <AppSelect
                              options={availableOptions}
                              isCreatable={false}
                              label="نوع التخصص"
                              value={controllerField.value}
                              onChange={controllerField.onChange}
                              isInvalid={!!fieldState.error}
                              error={fieldState.error?.message}
                              // Optional: placeholder when no options left
                              placeholder={
                                availableOptions.length === 0
                                  ? "تم اختيار جميع التخصصات"
                                  : "اختر التخصص"
                              }
                            />
                          );
                        }}
                      />

                      {/* Amount */}
                      <Input
                        type="number"
                        label="التكلفة"
                        {...register(`disciplines.${index}.amount`, {
                          required: "التكلفة مطلوبة",
                          min: {
                            value: 0,
                            message: "القيمة يجب أن تكون موجبة",
                          },
                        })}
                        error={errors.disciplines?.[index]?.amount}
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="danger"
                      size="icon"
                    >
                      <BiSolidTrash />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() =>
                  append({
                    type: null,
                    amount: "",
                  })
                }
                className="mt-4"
                icon={<FaPlus />}
              >
                اضافة تخصص
              </Button>
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
