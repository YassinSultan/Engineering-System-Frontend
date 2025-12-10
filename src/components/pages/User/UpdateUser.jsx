import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { getUser, updateUser } from "../../../api/userAPI";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function UpdateUser() {
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ id }),
  });

  // react hook form
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
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
    mutationKey: ["updateUser", id],
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("تم تعديل المستخدم بنجاح!");
      reset();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("حدث خطاء اثناء تعديل المستخدم");
    },
  });
  // submit funtion
  const onSubmit = (data) => {
    const updatedData = {
      fullName: data.fullName,
      username: data.username,
      mainUnit: data.mainUnit || null,
      subUnit: data.subUnit || null,
      office: data.office || null,
      role: data.role,
      phones: data.phones
        .map((p) => p.phone.trim())
        .filter((phone) => phone !== ""),
    };

    mutation.mutate({ id, data: updatedData });
  };
  // reset form
  useEffect(() => {
    if (user?.data) {
      const phones =
        user.data.phones?.length > 0
          ? user.data.phones.map((p) => ({ phone: p }))
          : [{ phone: "" }];

      reset({
        fullName: user.data.fullName || "",
        username: user.data.username || "",
        mainUnit: user.data.mainUnit || "",
        subUnit: user.data.subUnit || "",
        office: user.data.office || "",
        role: user.data.role || "user",
        phones,
      });
    }
  }, [user?.data, reset]);
  if (isLoading) return <Loading />;
  return (
    <>
      <section>
        <div className="w-fit">
          <PageTitle title="تعديل المستخدم" subTitle={user.data.fullName} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="my-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="col-span-full">
              <Input
                label="الاسم الكامل"
                {...register("fullName", { required: "اسم الكامل مطلوب" })}
                error={errors.fullName}
                rules={{ required: "اسم الكامل مطلوب" }}
              />
            </div>
            <div>
              <Input
                label="الوحدة الرئيسية"
                {...register("mainUnit", {
                  required:
                    user?.data?.role === "super_admin"
                      ? false
                      : "الوحدة الرئيسية مطلوب",
                })}
                rules={{
                  required:
                    user?.data?.role === "super_admin"
                      ? false
                      : "الوحدة الرئيسية مطلوب",
                }}
                error={errors.mainUnit}
              />
            </div>
            <div>
              <Input
                label="الوحدة الفرعية"
                {...register("subUnit", {
                  required:
                    user?.data?.role === "super_admin"
                      ? false
                      : "الوحدة الفرعية مطلوب",
                })}
                rules={{
                  required:
                    user?.data?.role === "super_admin"
                      ? false
                      : "الوحدة الفرعية مطلوب",
                }}
                error={errors.subUnit}
              />
            </div>
            <div className="col-span-full">
              <Input
                label="اسم المستخدم"
                {...register("username", {
                  required: "اسم المستخدم مطلوب",
                })}
                rules={{
                  required: "اسم المستخدم مطلوب",
                }}
                error={errors.username}
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">
                أرقام الهواتف
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
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
                      <FaTrash />
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
            <div>
              <Input
                label="المكتب"
                {...register("office", {
                  required:
                    user?.data?.role === "super_admin" ? false : "المكتب مطلوب",
                })}
                rules={{
                  required:
                    user?.data?.role === "super_admin" ? false : "المكتب مطلوب",
                }}
                error={errors.office}
              />
            </div>
            <div>
              <Input
                label="الوظيفة"
                {...register("role", { required: "الوظيفة مطلوبة" })}
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
          </div>
          <Button type="submit">تعديل المستخدم</Button>
        </form>
      </section>
    </>
  );
}
