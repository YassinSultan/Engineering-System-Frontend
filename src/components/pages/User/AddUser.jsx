import { QueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createUser } from "../../../api/userAPI";
import toast from "react-hot-toast";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

export default function AddUser() {
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
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("تم إضافة المستخدم بنجاح!");
      reset();
      QueryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error:", error.response.data.message);
      toast.error("حدث خطاء اثناء اضافة المستخدم");
    },
  });

  const onSubmit = (data) => {
    const phones = data.phones.map((p) => {
      return p.phone;
    });
    data.phones = phones;
    mutation.mutate(data);
  };
  return (
    <>
      <section>
        <div className="w-fit">
          <PageTitle title="اضافة مستخدم جديد" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          autoComplete="off"
        >
          <div>
            <Input
              label="اسم المستخدم كامل"
              {...register("fullName", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.fullName}
            />
          </div>
          <div>
            <Input
              label="الوحدة الرئيسية"
              {...register("mainUnit", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.mainUnit}
            />
          </div>
          <div>
            <Input
              label="الوحدة الفرعية"
              {...register("subUnit", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.subUnit}
            />
          </div>
          <div>
            <Input
              label="التخصص"
              {...register("specialization", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.specialization}
            />
          </div>
          <div>
            <Input
              label="المكتب"
              {...register("office", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.office}
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
                    error={errors.phones?.[index]?.phone}
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
              label="اسم المستخدم في تسجيل الدخول"
              {...register("username", { required: "اسم الشركة مطلوب" })}
              type="text"
              error={errors.username}
            />
          </div>
          <div>
            <Input
              label="كلمة المرور"
              {...register("password", { required: "اسم الشركة مطلوب" })}
              type="password"
              error={errors.password}
              rules={{ required: "الوظيفة مطلوبة" }}
            />
          </div>
          <div>
            <Input
              label="الوظيفة"
              {...register("role", { required: "اسم الشركة مطلوب" })}
              type="select"
              error={errors.role}
              options={[
                { value: "super_admin", label: "مدير النظام" },
                { value: "admin", label: "مدير" },
                { value: "engineer", label: "مهندس" },
                { value: "user", label: "مستخدم" },
              ]}
              rules={{ required: "الوظيفة مطلوبة" }}
            />
          </div>
          <div className="col-span-full">
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isLoading}
            >
              اضافة
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
