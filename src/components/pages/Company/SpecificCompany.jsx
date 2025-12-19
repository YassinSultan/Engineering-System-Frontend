import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { getCompany } from "../../../api/companyAPI";
import Loading from "../../common/Loading/Loading";
import toast from "react-hot-toast";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import getFileUrl from "../../../utils/getDownladLink";
import { BsDownload } from "react-icons/bs";

export default function SpecificCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompany({ id }),
    onError: (error) => {
      console.error("Failed to load company:", error.message);
      toast.error("حدث خطاء اثناء جلب الشركة");
      navigate("/companies");
    },
    select: (res) => res.data.data,
  });
  console.log(company);
  if (isLoading) {
    <Loading />;
  }
  return (
    <>
      <section>
        <div className="w-fit">
          <PageTitle title="تفاصيل الشركة" subTitle={company?.companyName} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 my-4">
          <div className="lg:col-span-3 p-3 shadow rounded-lg">
            <h3 className="my-2 py-2 text-2xl font-extrabold">بيانات الشركة</h3>
            <ul className="list-disc list-inside space-y-4">
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  اسم الشركة
                </span>
                <span className="inline-block">
                  {company?.companyName || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  مقر الشركة
                </span>
                <span className="inline-block">
                  {company?.address || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  كود الشركة
                </span>
                <span className="inline-block">
                  {company?.companyCode || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  رقم السجل التجاري
                </span>
                <span className="inline-block">
                  {company?.commercialRegister || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  رقم الموافقة الأمنية
                </span>
                <span className="inline-block">
                  {company?.securityApprovalNumber || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  تاريخ الموافقة الأمنية
                </span>
                <span className="inline-block">
                  {company?.securityApprovalDate
                    ? new Date(company.securityApprovalDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  السنة المالية
                </span>
                <span className="inline-block">
                  {company?.fiscalYear || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  فئة الشركة
                </span>
                <span className="inline-block">
                  {company?.companyCategory || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  نشاط الشركة
                </span>
                <span className="inline-block">
                  {company?.companyActivity || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2 mb-3">
                  مدير الشركة
                </span>
                <ol className="list-disc list-inside ps-10 space-y-2">
                  <li>
                    <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                      اسم المدير
                    </span>
                    <span className="inline-block">
                      {company?.ownerName || "----"}
                    </span>
                  </li>
                  <li>
                    <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                      رقم الهوية
                    </span>
                    <span className="inline-block">
                      {company?.ownerNID || "----"}
                    </span>
                  </li>
                </ol>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  الشكل القانوني للشركة
                </span>
                <span className="inline-block">
                  {company?.legalForm || "----"}
                </span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  حساب الشركة
                </span>
                <span className="inline-block">{company?.email || "----"}</span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap pe-2">
                  فاكس الشركة
                </span>
                <span className="inline-block">{company?.fax || "----"}</span>
              </li>
              <li>
                <span className="lg:w-1/4 inline-block font-bold text-nowrap mb-3">
                  هواتف الشركة
                </span>
                {company.phones.length > 0 ? (
                  <ol className="list-disc list-inside ps-10 space-y-2">
                    {company.phones.map((p) => {
                      return (
                        <li>
                          <span className="inline-block">{p}</span>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  "----"
                )}
              </li>
            </ul>
          </div>
          <div className="p-3 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-3">ملفات الشركة</h3>
            <div className="space-y-2">
              <span className="block font-bold">مرفقات الشركة</span>
              {company?.companyDocuments.length > 0
                ? company?.companyDocuments.map((doc) => (
                    <div className="flex items-center justify-between">
                      <p className="text-justify">{doc.split("/").pop()}</p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(getFileUrl(doc), "_blank")}
                        icon={<BsDownload />}
                      >
                        تحميل
                      </Button>
                    </div>
                  ))
                : "----"}
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-justify">
                <span className="block font-bold">ملف الموافقة الامنية</span>
                {company?.securityApprovalFile.split("/").pop()}
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    getFileUrl(company?.securityApprovalFile),
                    "_blank"
                  )
                }
                icon={<BsDownload />}
              >
                تحميل
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
