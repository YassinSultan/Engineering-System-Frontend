import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import FileInput from "../../ui/FileInput/FileInput";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createCompany } from "../../../api/companyAPI";
import toast from "react-hot-toast";

export default function AddCompany() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      phones: [{ phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });
  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("تم إضافة الشركة بنجاح!");
      reset();
      QueryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("حدث خطاء اثناء اضافة الشركة");
    },
  });

  // Convert form data to FormData
  const onSubmit = (data) => {
    const formData = new FormData();

    // Append simple fields
    formData.append("companyCode", data.companyCode || "");
    formData.append("commercialRegister", data.commercialRegister || "");
    formData.append(
      "securityApprovalNumber",
      data.securityApprovalNumber || ""
    );
    formData.append("securityApprovalDate", data.securityApprovalDate || "");
    formData.append("fiscalYear", data.fiscalYear || "");
    formData.append("companyName", data.companyName || "");
    formData.append("companyCategory", data.companyCategory || "");
    formData.append("companyBrand", data.companyBrand || "");
    formData.append("companyActivity", data.companyActivity || "");
    formData.append("ownerName", data.ownerName || "");
    formData.append("ownerNID", data.ownerNID || "");
    formData.append("representativeName", data.representativeName || "");
    formData.append("fax", data.fax || "");
    formData.append("address", data.address || "");
    formData.append("email", data.email || "");
    formData.append("legalForm", data.legalForm || "");
    formData.append("securityFileNumber", data.securityFileNumber || "");

    // Append phones as JSON string (or handle as array on backend)
    data.phones.forEach((phoneObj, index) => {
      if (phoneObj.phone) {
        formData.append(`phones[${index}]`, phoneObj.phone);
        // OR: formData.append("phones[]", phoneObj.phone);
      }
    });

    // Append files
    if (data.securityApprovalFile?.[0]) {
      formData.append("securityApprovalFile", data.securityApprovalFile[0]);
    }

    if (data.companyDocuments) {
      Array.from(data.companyDocuments).forEach((file) => {
        formData.append("companyDocuments", file);
      });
    }

    // Trigger mutation
    mutation.mutate(formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-b pb-2 mb-2">
          <div>
            <Input
              label="كود الشركة"
              {...register("companyCode", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.companyCode}
            />
          </div>
          <div>
            <Input
              label="رقم السجل"
              {...register("commercialRegister")}
              type="text"
              error={errors.commercialRegister}
            />
          </div>
          <div>
            <Input
              label="رقم الموافقة الامنية"
              {...register("securityApprovalNumber")}
              type="text"
              error={errors.securityApprovalNumber}
            />
          </div>
          <div>
            <Input
              label="تاريخ الموافقة الامنية"
              {...register("securityApprovalDate")}
              type="date"
              error={errors.securityApprovalDate}
            />
          </div>
          <div>
            <Input
              label="العام المالي"
              {...register("fiscalYear")}
              type="text"
              error={errors.fiscalYear}
            />
          </div>
          <div>
            <Input
              label="اسم الشركة"
              {...register("companyName")}
              type="text"
              error={errors.companyName}
            />
          </div>
          <div>
            <Input
              label="فئة الشركة"
              {...register("companyCategory")}
              type="text"
              error={errors.companyCategory}
            />
          </div>
          <div>
            <Input
              label="سمة التجارية الشركة"
              {...register("companyBrand")}
              type="text"
              error={errors.companyBrand}
            />
          </div>
          <div>
            <Input
              label="نشاط الشركة"
              {...register("companyActivity")}
              type="text"
              error={errors.companyActivity}
            />
          </div>
          <div>
            <Input
              label="مالك الشركة"
              {...register("ownerName")}
              type="text"
              error={errors.ownerName}
            />
          </div>
          <div>
            <Input
              label="رقم هوية مالك الشركة"
              {...register("ownerNID")}
              type="text"
              error={errors.ownerNID}
            />
          </div>
          <div>
            <Input
              label="اسم المنوب"
              {...register("representativeName")}
              type="text"
              error={errors.representativeName}
            />
          </div>
          <div>
            <Input
              label="فاكس الشركة"
              {...register("fax")}
              type="text"
              error={errors.fax}
            />
          </div>
          <div>
            <Input
              label="عنوان الشركة"
              {...register("address")}
              type="text"
              error={errors.address}
            />
          </div>
          <div className="col-span-full flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label="رقم هاتف"
                    {...register(`phones.${index}.phone`)}
                    type="phone"
                    error={errors.phone}
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
            <div>
              <Button type="button" onClick={() => append({ number: "" })}>
                اضافة رقم
              </Button>
            </div>
          </div>
          <div>
            <Input
              label="البريد الالكتروني"
              {...register("email")}
              type="email"
              error={errors.email}
            />
          </div>
          <div>
            <Input
              label="الشكل القانوني"
              {...register("legalForm")}
              type="text"
              error={errors.legalForm}
            />
          </div>
          <div>
            <Input
              label="رقم الملف بمكتب الامن"
              {...register("securityFileNumber")}
              type="text"
              error={errors.securityFileNumber}
            />
          </div>
          <div className="col-span-full">
            <FileInput
              label="موافقة الامنية"
              id="securityApprovalFile"
              {...register("securityApprovalFile", { required: true })}
            />
          </div>
          <div className="col-span-full">
            <FileInput
              label="مستندات الشركة"
              id="companyDocuments"
              multiple
              {...register("companyDocuments", { required: true })}
            />
          </div>
        </div>
        <div>
          <Button type="submit">اضافة</Button>
        </div>
      </form>
    </>
  );
}
