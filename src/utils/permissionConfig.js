export const permissionGroups = [
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
    {
        id: "projects",
        label: "إدارة المشاريع",
        prefix: "projects:",
        permissions: [
            {
                name: "create",
                label: "إضافة",
                subPermissions: [
                    { name: "project", label: "مشروع" },
                    // جزء خاص بالبروتوكلاات
                    { name: "protocol", label: "بروتوكول" },
                    { name: "cashFlow", label: "تدفقات مالية" },
                    { name: "planningBudget", label: "موازنة تخطيط" },
                    { name: "paymentOrder", label: "اوامر دفع" },
                    { name: "implementationRate", label: "نسبة التنفيذ" },
                    // -----------------
                    { name: "estimatedCost", label: "تكلفة تقديرية" },
                    { name: "financialAllocation", label: "مخصص مالي" },
                    { name: "withdrawalPermission", label: "سماح بالصرف" },
                    { name: "contractPermission", label: "سماح بالتعاقد" },
                ],
            },
            {
                name: "update",
                label: "تعديل",
                subPermissions: [
                    { name: "project", label: "مشروع" },
                    // جزء خاص بالبروتوكلاات
                    { name: "protocol", label: "بروتوكول" },
                    { name: "cashFlow", label: "تدفقات مالية" },
                    { name: "planningBudget", label: "موازنة تخطيط" },
                    { name: "paymentOrder", label: "اوامر دفع" },
                    { name: "implementationRate", label: "نسبة التنفيذ" },
                    // -----------------
                    { name: "estimatedCost", label: "تكلفة تقديرية" },
                    { name: "financialAllocation", label: "مخصص مالي" },
                    { name: "withdrawalPermission", label: "سماح بالصرف" },
                    { name: "contractPermission", label: "سماح بالتعاقد" },
                    {
                        name: "presentationFile",
                        label: "ملف العرض",
                    },
                    {
                        name: "aerialPhotographyFile",
                        label: "ملف تصوير جوي",
                    },
                ],
            },
            {
                name: "delete",
                label: "حذف",
                subPermissions: [
                    { name: "project", label: "مشروع" },
                    // جزء خاص بالبروتوكلاات
                    { name: "protocol", label: "بروتوكول" },
                    { name: "cashFlow", label: "تدفقات مالية" },
                    { name: "planningBudget", label: "موازنة تخطيط" },
                    { name: "paymentOrder", label: "اوامر دفع" },
                    // -----------------
                    { name: "estimatedCost", label: "تكلفة تقديرية" },
                    { name: "financialAllocation", label: "مخصص مالي" },
                    { name: "withdrawalPermission", label: "سماح بالصرف" },
                    { name: "contractPermission", label: "سماح بالتعاقد" },
                    {
                        name: "presentationFile",
                        label: "ملف العرض",
                    },
                    {
                        name: "aerialPhotographyFile",
                        label: "ملف تصوير جوي",
                    },
                ],
            },
            { name: "read", label: "عرض المشروع" },
        ],
    },
    {
        id: "billOfQuantitie",
        label: "إدارة المقايسات",
        prefix: "billOfQuantitie:",
        permissions: [
            {
                name: "create",
                label: "إضافة",
                description: "مرحلة تسجيل المقايسة",
            },
            {
                name: "step",
                label: "مرحلة",
                subPermissions: [
                    { name: "REVIEW", label: "1", description: "مرحلة مراجعة المقايسة" },
                    { name: "TECHNICAL", label: "2", description: "قائد المكتب الفني او قائد الكتيبة" },
                    { name: "GENERAL", label: "3", description: "مكتب اللواء" }
                ]
            },
            {
                name: "update",
                label: "تعديل",
            },
            {
                name: "delete",
                label: "حذف",
            },
            { name: "read", label: "عرض" },
        ],
    },
];