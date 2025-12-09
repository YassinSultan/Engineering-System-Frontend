import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  deleteUser,
  exportUsers,
  getUsers,
  suggestionFilter,
} from "../../../api/userAPI";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { FaDownload, FaPlus } from "react-icons/fa";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { FiRefreshCcw } from "react-icons/fi";
import DataTable from "../../common/DataTabel/DataTable";
import { BsEye, BsTrash2 } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

const fields = [
  {
    value: "fullName",
    label: "اسم المستخدم كامل",
  },
  {
    value: "mainUnit",
    label: " الوحدة الرئيسية",
  },
  {
    value: "commercialRegister",
    label: " رقم السجل التجاري",
  },
  {
    value: "subUnit",
    label: "الوحدة الفرعية",
  },
  {
    value: "specialization",
    label: "التخصص",
  },
  {
    value: "office",
    label: "المكتب",
  },
  {
    value: "username",
    label: "اسم المستخدم",
  },
  {
    value: "role",
    label: "الدور",
  },
  {
    value: "permissions",
    label: "الصلاحيات",
  },
];
export default function User() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState("all"); // default field
  const [searchString, setSearchString] = useState(""); //filter Search
  const [globalFilter, setGlobalFilter] = useState(""); //real filter after user click button or select suggestion
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();
  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", pageIndex, pageSize, globalFilter, sorting],
    queryFn: () =>
      getUsers({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    onSuccess: () => {
      toast.success("تم جلب المستخدمين بنجاح");
    },
    onError: () => {
      toast.error("حدث خطاء اثناء جلب المستخدمين");
    },
  });
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", searchField, searchString],
    queryFn: () => suggestionFilter(searchField, { search: searchString }),
    enabled: searchString.length > 1, // مشتغلش إلا لما يكتب كفاية
  });
  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح");
      refetch();
    },
    onError: (error) => {
      console.log(
        "فشل حذف المستخدم: " + (error.response?.data?.message || error.message)
      );
      toast.error("فشل حذف المستخدم");
    },
  });
  const excelMutation = useMutation({
    mutationKey: ["export-companies"],
    mutationFn: () =>
      exportUsers({
        search: globalFilter, // البحث الحالي
        filters: {}, // لو عندك فلاتر متقدمة، مررها هنا
        // مثال: filters: advancedFilters,
      }),
    onSuccess: () => {
      toast.success("تم تصدير الملف بنجاح!");
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        toast.error("لا توجد بيانات للتصدير بناءً على الفلاتر الحالية");
      } else {
        toast.error("فشل في تصدير الملف");
      }
      console.error("Export error:", error);
    },
  });
  const handelDelete = (id) => {
    Swal.fire({
      title: "هل انت متاكد من حذف المستخدم؟",
      text: "لا يمكنك التراجع عن هذا الحذف",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "حذف",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  //   table coulmn
  const columns = useMemo(() => [
    {
      id: "fullName",
      header: "اسم المستخدم",
      accessorKey: "fullName",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.fullName}
        </span>
      ),
    },
    {
      id: "mainUnit",
      header: "الوحدة الرئيسية",
      accessorKey: "mainUnit",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.mainUnit}
        </span>
      ),
    },
    {
      id: "subUnit",
      header: "الوحدة الفرعية",
      accessorKey: "subUnit",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.subUnit}
        </span>
      ),
    },
    {
      id: "specialization",
      header: "التخصص",
      accessorKey: "specialization",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.specialization}
        </span>
      ),
    },
    {
      id: "office",
      header: "المكتب",
      accessorKey: "office",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.office}
        </span>
      ),
    },
    {
      id: "phones",
      header: "رقم الهاتف",
      accessorKey: "phones",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.phones.map((p) => p.phone).join(", ")}
        </span>
      ),
    },
    {
      id: "username",
      header: " اسم المستخدم",
      accessorKey: "username",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.username}
        </span>
      ),
    },
    {
      id: "role",
      header: "الوظيفة",
      accessorKey: "role",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.role}
        </span>
      ),
    },
    {
      id: "permissions",
      header: "الصلاحيات",
      accessorKey: "permissions",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.permissions.map((p) => p.name).join(", ")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <NavLink to={`/user/view/${row.original._id}`}>
            <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <BsEye className="w-4 h-4" />
            </button>
          </NavLink>
          <NavLink to={`/user/edit/${row.original._id}`}>
            <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
              <BiEdit className="w-4 h-4" />
            </button>
          </NavLink>
          <button
            onClick={() => handelDelete(row.original._id)}
            className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          >
            <BsTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]);
  if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle
          title="ادارة المستخدمين"
          subTitle="يمكنك التحكم في المستخدمين من هنا"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FaDownload />}
            onClick={() => excelMutation.mutate()} // ← لازم .mutate()
            disabled={excelMutation.isPending} // ← loading state
          >
            {excelMutation.isPending ? "جاري التصدير..." : "تصدير إكسل"}
          </Button>
          <Button onClick={() => navigate("/user/new")} icon={<FaPlus />}>
            اضافة مستخدم
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <SearchInput
            fields={fields}
            suggestions={suggestions}
            selectedField={searchField}
            onChangeText={setSearchString}
            onSelectSuggestion={(value) => setGlobalFilter(value)}
            onSearchFieldChange={(value) => {
              setSearchField(value);
              setSearchString("");
            }}
          />
        </div>
        {/* refresh button */}
        <Button onClick={() => refetch()}>
          <FiRefreshCcw />
        </Button>
      </div>
      {/* Table */}
      <div>
        {res?.data?.length > 0 ? (
          <DataTable
            data={res?.data || []}
            columns={columns}
            loading={isLoading}
            pageCount={res?.totalPages || 0}
            totalRecords={res?.total || 0}
            pageIndex={pageIndex}
            pageSize={pageSize}
            sorting={sorting}
            onPageChange={setPageIndex}
            onPageSizeChange={setPageSize}
            onSortingChange={setSorting}
          />
        ) : (
          <div className="flex items-center justify-center h-40 border border-dashed border-primary-500 rounded-lg">
            <span className="text-primary-500">لا يوجد مستخدمين</span>
          </div>
        )}
      </div>
    </>
  );
}
