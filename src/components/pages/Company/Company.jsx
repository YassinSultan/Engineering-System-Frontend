import React, { useMemo, useState } from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { FaDownload, FaPlus } from "react-icons/fa";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteCompany,
  exportCompanies,
  getCompanies,
  suggestionFilter,
} from "../../../api/companyAPI";
import SearchInput from "../../ui/SearchInput/SearchInput";
import { BsEye, BsFileText, BsTrash2 } from "react-icons/bs";
import { BiChevronDown, BiEdit, BiFolder } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router";
import DataTable from "../../common/DataTabel/DataTable";
import { FiRefreshCcw } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../../common/Loading/Loading";
import AttachmentsModal from "../../common/AttachmentsModal/AttachmentsModal";
import ColumnSelector from "../../common/ColumnSelector/ColumnSelector";
import Can from "../../common/Can/Can";
const fields = [
  {
    value: "companyCode",
    label: "كود الشركة",
  },
  {
    value: "companyName",
    label: "اسم الشركة",
  },
  {
    value: "commercialRegister",
    label: " رقم السجل التجاري",
  },
  {
    value: "securityApprovalNumber",
    label: " رقم الموافقة الامنية",
  },
  {
    value: "companyBrand",
    label: "السمة التجارية للشركة",
  },
  {
    value: "companyActivity",
    label: "نشاط الشركة",
  },
  {
    value: "ownerName",
    label: "اسم مالك الشركة",
  },
  {
    value: "ownerNID",
    label: "رقم الهوية لمالك الشركة",
  },
  {
    value: "representativeName",
    label: "اسم المنوب",
  },
  {
    value: "legalForm",
    label: "الشكل القانوني",
  },
  {
    value: "fiscalYear",
    label: "العام المالي",
  },
];
export default function Company() {
  const [isAttachmentsModalOpen, setIsAttachmentsModalOpen] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState({
    mainFile: null,
    additionalFiles: [],
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
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
    queryKey: ["companies", pageIndex, pageSize, globalFilter, sorting],
    queryFn: () =>
      getCompanies({
        page: pageIndex + 1,
        limit: pageSize,
        search: globalFilter,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    onSuccess: () => {
      toast.success("تم جلب الشركات بنجاح");
    },
    onError: () => {
      toast.error("حدث خطاء اثناء جلب الشركات");
    },
  });
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", searchField, searchString],
    queryFn: () => suggestionFilter(searchField, { search: searchString }),
    enabled: searchString.length > 1, // مشتغلش إلا لما يكتب كفاية
  });
  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      toast.success("تم حذف الشركة بنجاح");
      refetch();
    },
    onError: (error) => {
      console.log(
        "فشل حذف الشركة: " + (error.response?.data?.message || error.message)
      );
      toast.error("فشل حذف الشركة");
    },
  });
  const excelMutation = useMutation({
    mutationKey: ["export-companies"],
    mutationFn: () =>
      exportCompanies({
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
      title: "هل انت متاكد من حذف الشركة؟",
      text: "لا يمكنك التراجع عن هذا الحذف",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "الغاء",
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
      id: "companyCode",
      header: "كود الشركة",
      accessorKey: "companyCode",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.companyCode}
        </span>
      ),
    },
    {
      id: "commercialRegister",
      header: "رقم السجل",
      accessorKey: "commercialRegister",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.commercialRegister}
        </span>
      ),
    },
    {
      id: "securityApprovalNumber",
      header: "رقم الموافقة الامنية",
      accessorKey: "securityApprovalNumber",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.securityApprovalNumber}
        </span>
      ),
    },
    {
      id: "securityApprovalDate",
      header: "تاريخ الموافقة الامنية",
      accessorKey: "securityApprovalDate",
      cell: ({ row }) => {
        const date = new Date(row.original.securityApprovalDate);
        const formatted = new Intl.DateTimeFormat("EG", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date);

        return (
          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
            {formatted}
          </span>
        );
      },
    },
    {
      id: "fiscalYear",
      header: "العام المالي",
      accessorKey: "fiscalYear",
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {row.original.fiscalYear}
        </span>
      ),
    },
    {
      id: "companyName",
      header: "اسم الشركة",
      accessorKey: "companyName",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {row.original.companyName}
        </span>
      ),
    },
    {
      id: "companyCategory",
      header: "فئة الشركة",
      accessorKey: "companyCategory",
      cell: ({ row }) => (
        <span className="font-mono text-primary">
          {row.original.companyCategory}
        </span>
      ),
    },
    {
      id: "companyBrand",
      header: "السمة التجارية للشركة",
      accessorKey: "companyBrand",
      cell: ({ row }) => (
        <span className="font-mono text-primary">
          {row.original.companyBrand}
        </span>
      ),
    },
    {
      id: "companyActivity",
      header: "نشاط الشركة",
      accessorKey: "companyActivity",
      cell: ({ row }) => (
        <span className="font-mono text-primary">
          {row.original.companyActivity}
        </span>
      ),
    },

    {
      id: "ownerName",
      header: "مالك الشركة",
      accessorKey: "ownerName",
    },
    {
      id: "ownerNID",
      header: "رقم هوية مالك الشركة",
      accessorKey: "ownerNID",
    },
    {
      id: "representativeName",
      header: "مندوب الشركة",
      accessorKey: "representativeName",
    },
    {
      id: "address",
      header: "عنوان الشركة",
      accessorKey: "address",
    },
    {
      id: "phones",
      header: "التليفونات",
      accessorKey: "phones",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.phones?.join(" | ") || "-"}
        </span>
      ),
    },
    {
      id: "fax",
      header: "فاكس الشركة",
      accessorKey: "fax",
    },
    {
      id: "email",
      header: "البريد الكتروني للشركة",
      accessorKey: "email",
    },
    {
      id: "legalForm",
      header: "الشكل القانوني",
      accessorKey: "legalForm",
    },
    {
      id: "securityFileNumber",
      header: "رقم الملف بمكتب الامن",
      accessorKey: "securityFileNumber",
    },
    {
      id: "files",
      header: "الملفات",
      enableSorting: false,
      enableHiding: false, // اختياري: ليبقى دائمًا ظاهر
      cell: ({ row }) => {
        const mainFile = row.original.securityApprovalFile;
        const additionalFiles = row.original.companyDocuments || [];
        const totalFiles = (mainFile ? 1 : 0) + additionalFiles.length;

        if (totalFiles === 0) {
          return <span className="text-muted-foreground text-xs">لا يوجد</span>;
        }

        const openModal = () => {
          setCurrentAttachments({
            mainFile: mainFile || null,
            additionalFiles,
          });
          setIsAttachmentsModalOpen(true);
        };

        return (
          <div className="flex items-center justify-center gap-2">
            {mainFile && (
              <button
                onClick={openModal}
                className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
                title="ملف الموافقة الأمنية"
              >
                <BsFileText className="w-4 h-4" />
              </button>
            )}
            {additionalFiles.length > 0 && (
              <button
                onClick={openModal}
                className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                title="أوراق الشركة"
              >
                <BiFolder className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {additionalFiles.length}
                </span>
              </button>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Can action={"companies:read"}>
            <NavLink to={`/companies/read/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <BsEye className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          <Can action={"companies:update"}>
            <NavLink to={`/companies/update/${row.original._id}`}>
              <button className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors">
                <BiEdit className="w-4 h-4" />
              </button>
            </NavLink>
          </Can>
          <Can action={"companies:delete"}>
            <button
              onClick={() => handelDelete(row.original._id)}
              className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
            >
              <BsTrash2 className="w-4 h-4" />
            </button>
          </Can>
        </div>
      ),
    },
  ]);
  if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <PageTitle
          title="ادارة الشركات"
          subTitle="عرض وإدارة جميع الشركات المسجلة في النظام"
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
          <Can action="companies:create">
            <Button
              onClick={() => navigate("/companies/create")}
              icon={<FaPlus />}
            >
              اضافة شركة
            </Button>
          </Can>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
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
        <div className="flex items-center gap-2 flex-row-reverse">
          <Button onClick={() => refetch()}>
            <FiRefreshCcw />
          </Button>
          <ColumnSelector
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            isOpen={isColumnSelectorOpen}
            setIsOpen={setIsColumnSelectorOpen}
            essentialColumnIds={["companyName"]}
            excludeColumns={["actions"]}
          />
        </div>
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
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        ) : (
          <div className="flex items-center justify-center h-40 border border-dashed border-primary-500 rounded-lg">
            <span className="text-primary-500">لا يوجد شركات</span>
          </div>
        )}
      </div>
      <AttachmentsModal
        isOpen={isAttachmentsModalOpen}
        onClose={() => setIsAttachmentsModalOpen(false)}
        title="ملفات الشركة"
        mainFile={currentAttachments.mainFile}
        mainFileLabel="ملف الموافقة الأمنية"
        additionalFiles={currentAttachments.additionalFiles}
        additionalFilesLabel="أوراق الشركة"
      />
    </>
  );
}
