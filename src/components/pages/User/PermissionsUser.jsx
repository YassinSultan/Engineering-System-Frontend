import React, { useState, useEffect } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateUserPermissions } from "../../../api/userAPI";
import Loading from "../../common/Loading/Loading";
import { useForm, Controller, useWatch } from "react-hook-form";
import Button from "../../ui/Button/Button";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";
import toast from "react-hot-toast";

export default function PermissionsUser() {
  // هيكل الصلاحيات
  const permissionGroups = [
    {
      id: "users",
      label: "إدارة المستخدمين",
      prefix: "users:",
      permissions: [
        { name: "create", label: "إضافة مستخدم" },
        {
          name: "update",
          label: "تعديل مستخدم",
          subPermissions: [
            { name: "updateAll", label: "تعديل كامل للمستخدم" },
            { name: "updatePermissions", label: "تعديل صلاحيات المستخدم" },
          ],
        },
        { name: "delete", label: "حذف مستخدم" },
        { name: "read", label: "عرض المستخدمين" },
      ],
    },
    {
      id: "companies",
      label: "إدارة الشركات",
      prefix: "companies:",
      permissions: [
        { name: "create", label: "إضافة شركة" },
        {
          name: "update",
          label: "تعديل بيانات الشركة",
          subPermissions: [
            { name: "updateDocuments", label: "تعديل الأوراق والمستندات" },
            { name: "updateAll", label: "تعديل كامل للشركة" },
            { name: "updateName", label: "تعديل اسم الشركة" },
          ],
        },
        { name: "delete", label: "حذف شركة" },
        { name: "read", label: "عرض الشركات" },
      ],
    },
  ];
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser({ id }),
    enabled: !!id,
  });

  // حالة الفتح/الإغلاق لكل مجموعة بشكل مستقل
  const [openGroups, setOpenGroups] = useState(() => {
    const initialOpen = {};
    permissionGroups.forEach((group) => {
      initialOpen[group.id] = true; // مفتوحة افتراضيًا
    });
    return initialOpen;
  });

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      permissions: [],
    },
  });

  const selectedPermissions = useWatch({
    control,
    name: "permissions",
    defaultValue: [],
  });

  const toggleGroupOpen = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const normalizePermissions = (perms) => {
    const normalized = new Set(perms);

    permissionGroups.forEach((group) => {
      const base = group.prefix;

      const hasUpdate =
        normalized.has(`${base}update`) ||
        Array.from(normalized).some((p) => p.startsWith(`${base}update:`));

      const hasDelete =
        normalized.has(`${base}delete`) ||
        Array.from(normalized).some((p) => p.startsWith(`${base}delete:`));

      if (hasUpdate || hasDelete) {
        normalized.add(`${base}read`);
      }
    });

    return Array.from(normalized);
  };
  // تحديد/إلغاء كل صلاحيات المجموعة
  const toggleGroup = (groupPrefix) => {
    const groupPerms = permissionGroups
      .find((g) => g.prefix === groupPrefix)
      .permissions.flatMap((p) =>
        p.subPermissions
          ? p.subPermissions.map((sp) => `${groupPrefix}${p.name}:${sp.name}`)
          : [`${groupPrefix}${p.name}`]
      );

    const allSelected = groupPerms.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      setValue(
        "permissions",
        normalizePermissions(
          selectedPermissions.filter((p) => !groupPerms.includes(p))
        )
      );
    } else {
      setValue(
        "permissions",
        normalizePermissions([
          ...selectedPermissions.filter((p) => !groupPerms.includes(p)),
          ...groupPerms.filter((p) => !selectedPermissions.includes(p)),
        ])
      );
    }
  };

  // تحديد/إلغاء صلاحية رئيسية (مثل update)
  const toggleMainPermission = (groupPrefix, permName, subPerms = []) => {
    const perms = subPerms.length
      ? subPerms.map((sp) => `${groupPrefix}${permName}:${sp.name}`)
      : [`${groupPrefix}${permName}`];

    const allSelected = perms.every((p) => selectedPermissions.includes(p));

    if (allSelected) {
      setValue(
        "permissions",
        normalizePermissions(
          selectedPermissions.filter((p) => !perms.includes(p))
        )
      );
    } else {
      setValue(
        "permissions",
        normalizePermissions([...new Set([...selectedPermissions, ...perms])])
      );
    }
  };
  useEffect(() => {
    if (user?.data?.permissions) {
      reset({
        permissions: user.data.permissions,
      });
    }
  }, [user, reset]);
  const mutaation = useMutation({
    mutationKey: ["update-user-permissions", id],
    mutationFn: (data) => updateUserPermissions({ id, data }),
    onSuccess: () => {
      toast.success("تم تحديث صلاحيات المستخدم بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطاء اثناء تحديث صلاحيات المستخدم");
      console.log("error", error);
    },
  });
  const onSubmit = (data) => {
    const safePermissions = normalizePermissions(data.permissions);
    console.log(safePermissions);
    mutaation.mutate({ permissions: safePermissions });
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-600 text-center py-10">
        حدث خطأ في تحميل بيانات المستخدم
      </div>
    );

  return (
    <section className="mx-auto space-y-8 py-6" dir="rtl">
      <div className="w-fit">
        <PageTitle
          title="صلاحيات المستخدم"
          subTitle={`${user?.data?.fullName} - ${user?.data?.username}`}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-background rounded-2xl shadow-lg border border-base overflow-hidden">
          <div className="p-6 bg-base">
            <h2 className="text-2xl font-bold ">إدارة صلاحيات المستخدم</h2>
            <p className="mt-1">حدد الصلاحيات التي يمكن للمستخدم تنفيذها</p>
          </div>

          <div className="p-6 space-y-6 grid grid-cols-1">
            {permissionGroups.map((group) => {
              const groupPrefix = group.prefix;
              const allGroupPerms = group.permissions.flatMap((p) =>
                p.subPermissions
                  ? p.subPermissions.map(
                      (sp) => `${groupPrefix}${p.name}:${sp.name}`
                    )
                  : [`${groupPrefix}${p.name}`]
              );

              const groupSelectedCount = allGroupPerms.filter((p) =>
                selectedPermissions.includes(p)
              ).length;

              const isGroupIndeterminate =
                groupSelectedCount > 0 &&
                groupSelectedCount < allGroupPerms.length;

              const isOpen = openGroups[group.id] ?? true;

              return (
                <div
                  key={group.id}
                  className="border border-gray-300 rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* رأس المجموعة */}
                  <div
                    className="flex items-center gap-4 p-5 bg-base cursor-pointer select-none"
                    onClick={() => toggleGroupOpen(group.id)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroupOpen(group.id);
                      }}
                      className=" transition"
                    >
                      {isOpen ? (
                        <BiChevronDown className="w-6 h-6" />
                      ) : (
                        <BiChevronLeft className="w-6 h-6" />
                      )}
                    </button>

                    <input
                      type="checkbox"
                      checked={groupSelectedCount === allGroupPerms.length}
                      ref={(el) =>
                        el && (el.indeterminate = isGroupIndeterminate)
                      }
                      onChange={() => toggleGroup(groupPrefix)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded border-gray-400 focus:ring-blue-500 cursor-pointer"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{group.label}</h3>
                      <p className="text-sm ">
                        تم اختيار {groupSelectedCount} من {allGroupPerms.length}{" "}
                        صلاحية
                      </p>
                    </div>
                  </div>

                  {/* قائمة الصلاحيات */}
                  {isOpen && (
                    <div className="p-6 space-y-5 border-t border-gray-200 bg-gray-50/30">
                      {group.permissions.map((perm) => {
                        const fullPerm = `${groupPrefix}${perm.name}`;
                        const hasSub =
                          perm.subPermissions && perm.subPermissions.length > 0;
                        const subPerms = hasSub
                          ? perm.subPermissions.map(
                              (sp) => `${fullPerm}:${sp.name}`
                            )
                          : [];

                        const mainChecked = hasSub
                          ? subPerms.every((p) =>
                              selectedPermissions.includes(p)
                            )
                          : selectedPermissions.includes(fullPerm);

                        const mainIndeterminate =
                          hasSub &&
                          subPerms.some((p) =>
                            selectedPermissions.includes(p)
                          ) &&
                          !mainChecked;

                        return (
                          <div
                            key={perm.name}
                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                          >
                            {/* الصلاحية الرئيسية */}
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={mainChecked}
                                ref={(el) =>
                                  el && (el.indeterminate = mainIndeterminate)
                                }
                                onChange={() =>
                                  toggleMainPermission(
                                    groupPrefix,
                                    perm.name,
                                    perm.subPermissions || []
                                  )
                                }
                                className="w-5 h-5 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-800">
                                {perm.label}
                              </span>
                            </div>

                            {/* الصلاحيات الفرعية */}
                            {hasSub && (
                              <div className="mt-4 pr-10 space-y-3 border-r-4 border-blue-200">
                                {perm.subPermissions.map((sub) => {
                                  const subFull = `${fullPerm}:${sub.name}`;
                                  return (
                                    <label
                                      key={sub.name}
                                      className="flex items-center gap-3 py-2 hover:bg-blue-50 rounded-lg px-3 transition cursor-pointer"
                                    >
                                      <Controller
                                        name="permissions"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            type="checkbox"
                                            checked={
                                              field.value?.includes(subFull) ||
                                              false
                                            }
                                            onChange={(e) => {
                                              const newPerms = e.target.checked
                                                ? [...field.value, subFull]
                                                : field.value.filter(
                                                    (p) => p !== subFull
                                                  );
                                              field.onChange(
                                                normalizePermissions(newPerms)
                                              );
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                                          />
                                        )}
                                      />
                                      <span className="text-gray-700">
                                        {sub.label}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex">
          <Button type="submit" className="px-12 py-3 text-lg">
            حفظ الصلاحيات
          </Button>
        </div>
      </form>
    </section>
  );
}
