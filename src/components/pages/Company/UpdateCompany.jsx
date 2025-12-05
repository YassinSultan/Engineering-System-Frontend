import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompany, updateCompanyAPI } from "../../../api/companyAPI";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import FileInput from "../../ui/FileInput/FileInput";
import PageTitle from "../../ui/PageTitle/PageTitle";

export default function UpdateCompany() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch company
  const {
    data: company,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["company", { id }],
    queryFn: () => getCompany({ id }),
    select: (res) => res.data.data,
  });
  console.log("company", company);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (company) {
      const phones =
        company.phones?.length > 0
          ? company.phones.map((p) => ({ phone: p }))
          : [{ phone: "" }];
      const securityApprovalDate = new Date(company.securityApprovalDate, 0, 1);
      reset({
        ...company,
        phones,
        securityApprovalDate,
        securityApprovalFile: undefined,
        companyDocuments: undefined,
      });
    }
  }, [company, reset]);

  // Update Mutation
  const mutation = useMutation({
    mutationFn: updateCompanyAPI,
    onSuccess: () => {
      alert("تم تحديث الشركة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err) => {
      console.error(err);
      alert("حدث خطأ أثناء التحديث");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // Append all text fields (only if changed or always safe)
    const textFields = [
      "companyCode",
      "commercialRegister",
      "securityApprovalNumber",
      "securityApprovalDate",
      "fiscalYear",
      "companyName",
      "companyCategory",
      "companyBrand",
      "companyActivity",
      "ownerName",
      "ownerNID",
      "representativeName",
      "fax",
      "address",
      "email",
      "legalForm",
      "securityFileNumber",
    ];

    textFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null) {
        formData.append(field, data[field]);
      }
    });

    // Phones
    data.phones.forEach((item, index) => {
      if (item.phone) {
        formData.append(`phones[${index}]`, item.phone);
      }
    });

    // Files - only append if user selected new ones
    if (data.securityApprovalFile?.[0]) {
      formData.append("securityApprovalFile", data.securityApprovalFile[0]);
    }

    if (data.companyDocuments?.length > 0) {
      Array.from(data.companyDocuments).forEach((file) => {
        formData.append("companyDocuments", file);
      });
    }

    // Optional: Send flag to remove all documents (if you add a "Delete All" button later)
    // formData.append("removeAllDocuments", "true");

    mutation.mutate({ id, formData });
  };

  if (isLoading)
    return <div className="text-center py-10">جاري التحميل...</div>;
  if (isError) return <div className="text-red-500">خطأ: {error.message}</div>;
  if (!company) return <div>الشركة غير موجودة</div>;

  return (
    <div>
      <div className="w-fit mb-8">
        <PageTitle title="تحديث الشركة" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-b pb-6">
          {/* All your inputs - same as Add but pre-filled */}
          <Input
            label="كود الشركة"
            {...register("companyCode")}
            error={errors.companyCode}
          />
          <Input label="رقم السجل" {...register("commercialRegister")} />
          <Input
            label="رقم الموافقة الأمنية"
            {...register("securityApprovalNumber")}
          />
          <Input
            label="تاريخ الموافقة الأمنية"
            {...register("securityApprovalDate")}
            type="date"
          />
          <Input label="العام المالي" {...register("fiscalYear")} />
          <Input label="اسم الشركة" {...register("companyName")} />
          <Input label="فئة الشركة" {...register("companyCategory")} />
          <Input label="السمة التجارية" {...register("companyBrand")} />
          <Input label="نشاط الشركة" {...register("companyActivity")} />
          <Input label="مالك الشركة" {...register("ownerName")} />
          <Input label="هوية المالك" {...register("ownerNID")} />
          <Input label="اسم المنوب" {...register("representativeName")} />
          <Input label="الفاكس" {...register("fax")} />
          <Input label="العنوان" {...register("address")} />
          <Input
            label="البريد الإلكتروني"
            {...register("email")}
            type="email"
          />
          <Input label="الشكل القانوني" {...register("legalForm")} />
          <Input label="رقم الملف الأمني" {...register("securityFileNumber")} />

          {/* Dynamic Phones */}
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-2">
              أرقام الهواتف
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2 items-end">
                <div className="flex-1">
                  <Input
                    label="رقم الهاتف"
                    {...register(`phones.${index}.phone`)}
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => remove(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ phone: "" })}
            >
              + إضافة رقم
            </Button>
          </div>

          {/* Current + New Security Approval File */}
          <div className="col-span-full space-y-3">
            <div>
              <label className="block text-sm font-medium">
                موافقة أمنية حالية:
              </label>
              {company.securityApprovalFile ? (
                <a
                  href={`/uploads/${company.securityApprovalFile
                    .split("/")
                    .pop()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  عرض الملف الحالي
                </a>
              ) : (
                <span className="text-gray-500">لا يوجد ملف</span>
              )}
            </div>
            <FileInput
              label="استبدال الموافقة الأمنية (اختياري)"
              id="securityApprovalFile"
              {...register("securityApprovalFile")}
            />
          </div>

          {/* Company Documents */}
          <div className="col-span-full space-y-3">
            <div>
              <label className="block text-sm font-medium">
                مستندات الشركة الحالية:
              </label>
              {company.companyDocuments?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.companyDocuments.map((doc, i) => (
                    <a
                      key={i}
                      href={`/uploads/${doc.split("/").pop()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      مستند {i + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">لا توجد مستندات</span>
              )}
            </div>
            <FileInput
              label="إضافة مستندات جديدة (تُضاف إلى القديمة)"
              id="companyDocuments"
              multiple
              {...register("companyDocuments")}
            />
            <p className="text-xs text-gray-500">
              ملاحظة: المستندات الجديدة تُضاف فقط. للحذف، استخدم زر الحذف بجانب
              كل ملف (إذا أردت إضافته لاحقًا)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
