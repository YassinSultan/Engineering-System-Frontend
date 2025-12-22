import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getProjects } from "../../../api/projectApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SearchInput from "../../ui/SearchInput/SearchInput";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import Can from "../../common/Can/Can";
import { FaKeycdn, FaPlus } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import DataTable from "../../common/DataTabel/DataTable";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import formatDate from "../../../utils/formatDate";

export default function Project() {
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
    queryKey: ["projects", pageIndex, pageSize, globalFilter, sorting],
    queryFn: () =>
      getProjects({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    onSuccess: () => {
      console.log(res);
      toast.success("تم جلب المستخدمين بنجاح");
    },
    onError: (error) => {
      console.log(error);
      toast.error("حدث خطاء اثناء جلب المستخدمين");
    },
  });
  // const { data: suggestions } = useQuery({
  //   queryKey: ["suggestions", searchField, searchString],
  //   queryFn: () => suggestionFilter(searchField, { search: searchString }),
  //   enabled: searchString.length > 1, // مشتغلش إلا لما يكتب كفاية
  // });
  // // Delete Mutation
  // const deleteMutation = useMutation({
  //   mutationFn: deleteUser,
  //   onSuccess: () => {
  //     toast.success("تم حذف المستخدم بنجاح");
  //     refetch();
  //   },
  //   onError: (error) => {
  //     console.log(
  //       "فشل حذف المستخدم: " + (error.response?.data?.message || error.message)
  //     );
  //     toast.error("فشل حذف المستخدم");
  //   },
  // });
  // const excelMutation = useMutation({
  //   mutationKey: ["export-companies"],
  //   mutationFn: () =>
  //     exportUsers({
  //       search: globalFilter, // البحث الحالي
  //       filters: {}, // لو عندك فلاتر متقدمة، مررها هنا
  //       // مثال: filters: advancedFilters,
  //     }),
  //   onSuccess: () => {
  //     toast.success("تم تصدير الملف بنجاح!");
  //   },
  //   onError: (error) => {
  //     if (error.response?.status === 404) {
  //       toast.error("لا توجد بيانات للتصدير بناءً على الفلاتر الحالية");
  //     } else {
  //       toast.error("فشل في تصدير الملف");
  //     }
  //     console.error("Export error:", error);
  //   },
  // });
  // const handelDelete = (id) => {
  //   Swal.fire({
  //     title: "هل انت متاكد من حذف المستخدم؟",
  //     text: "لا يمكنك التراجع عن هذا الحذف",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "حذف",
  //     cancelButtonText: "الغاء",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteMutation.mutate(id);
  //     }
  //   });
  // };

  //   table coulmn
  const columns = useMemo(() => [
    {
      id: "name",
      header: "اسم المشروع",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1">{row.original.name}</span>
      ),
    },
    {
      id: "status",
      header: "حالة المشروع",
      accessorKey: "status",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1">
          {row.original.status === "STUDY"
            ? "دراسة"
            : row.original.status === "ONGOING"
            ? "جاري"
            : "منهي"}
        </span>
      ),
    },
    {
      id: "contractingParty",
      header: "جهة التعاقد",
      accessorKey: "contractingParty",
      cell: ({ row }) => (
        <span className="text-xs font-bold px-2 py-1">
          {row.original.contractingParty === "CIVILIAN"
            ? "جهة مدنية"
            : row.original.contractingParty === "MILITARY"
            ? "جهة عسكرية"
            : "جهة موازنة"}
        </span>
      ),
    },
    {
      id: "code",
      header: "كود المشروع",
      accessorKey: "code",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.code}</span>
      ),
    },
    {
      id: "startDate",
      header: "تاريخ بدء المشروع",
      accessorKey: "startDate",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      id: "location",
      header: "موقع المشروع",
      accessorKey: "location",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1">{row.original.location}</span>
      ),
    },
    {
      id: "landArea",
      header: "مساحة المشروع",
      accessorKey: "landArea",
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 ">{row.original.landArea}</span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Can action="users:read">
            <NavLink to={`/users/read/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <BsEye className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          <Can action="users:update">
            <NavLink to={`/users/update/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
                <BiEdit className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          {/* <Can action="users:delete">
            <button
              onClick={() => handelDelete(row.original._id)}
              className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
            >
              <BsTrash2 className="w-4 h-4" />
            </button>
          </Can> */}
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
          {/* <Can action="projects:read">
            <Button
              variant="secondary"
              icon={<FaDownload />}
              onClick={() => excelMutation.mutate()} // ← لازم .mutate()
              disabled={excelMutation.isPending} // ← loading state
            >
              {excelMutation.isPending ? "جاري التصدير..." : "تصدير إكسل"}
            </Button>
          </Can> */}
          <Can action="projects:create">
            <Button
              onClick={() => navigate("/projects/create")}
              icon={<FaPlus />}
            >
              اضافة مشروع
            </Button>
          </Can>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <SearchInput
            // fields={fields}
            // suggestions={suggestions}
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
            <span className="text-primary-500">لا يوجد مشاريع</span>
          </div>
        )}
      </div>
    </>
  );
}
