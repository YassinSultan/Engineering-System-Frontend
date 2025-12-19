import React from "react";

import {
  hasAnyPermission,
  hasPermission,
} from "../../../utils/permission.utils";
import { useAuth } from "../../../hooks/useAuth";

/**
 * مكون Can: يعرض children فقط إذا كانت الصلاحية موجودة
 *
 * استخدام:
 * <Can action="companies:read" unitId={companyUnitId}>
 *   <button>تعديل الشركة</button>
 * </Can>
 *
 * <Can any={["users:create", "users:update"]}>
 *   <button>إضافة مستخدم</button>
 * </Can>
 */
export default function Can({
  children,
  action, // صلاحية واحدة مثل "companies:update"
  any, // مصفوفة من الصلاحيات، يكفي وجود واحدة
  unitId, // معرف الوحدة التنظيمية إذا لزم الأمر
  fallback = null, // ما يُعرض إذا لم تكن الصلاحية موجودة
}) {
  const { user } = useAuth(); // أو أي طريقة تحصل بها على المستخدم الحالي

  if (!user) return fallback;

  const allowed = any
    ? hasAnyPermission(user, any, unitId)
    : action
    ? hasPermission(user, action, unitId)
    : true; // إذا لم يُحدد action ولا any → يعرض دائمًا

  return allowed ? <>{children}</> : fallback;
}
