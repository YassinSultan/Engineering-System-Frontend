import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { NavLink, useParams } from "react-router";
import { getBillOfQuantitie } from "../../../api/billOfQuantitieAPI";
import Loading from "../../common/Loading/Loading";
import NotFound from "../NotFound/NotFound";
import Can from "../../common/Can/Can";
import Button from "../../ui/Button/Button";
import { IoIosArrowForward } from "react-icons/io";
import PageTitle from "../../ui/PageTitle/PageTitle";
import { FiDownload } from "react-icons/fi";
import {
  FaBackward,
  FaBolt,
  FaBuilding,
  FaCalendar,
  FaCalendarCheck,
  FaDollarSign,
  FaDownload,
  FaDraftingCompass,
  FaEye,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFireAlt,
  FaPercentage,
  FaProjectDiagram,
  FaRegEdit,
  FaRoad,
  FaSnowflake,
  FaSwimmer,
  FaTools,
  FaTree,
  FaWrench,
} from "react-icons/fa";
import Card from "../../ui/Card/Card";
import CardHeader from "../../ui/Card/CardHeader";
import CardBody from "../../ui/Card/CardBody";
import { VscReferences } from "react-icons/vsc";
import getFileUrl from "../../../utils/getDownladLink";
import {
  FaArrowLeft,
  FaArrowsLeftRight,
  FaForwardStep,
  FaSquareArrowUpRight,
  FaVectorSquare,
} from "react-icons/fa6";
import { GiConcreteBag, GiSteelClaws } from "react-icons/gi";
import StepBillOfQuantitieModal from "./StepBillOfQuantitieModal";

const ATTACHMENTS_META = {
  boqExcel: {
    label: "ملف المقايسة (Excel)",
    icon: <FaFileExcel />,
  },
  boqPdf: {
    label: "ملف المقايسة (PDF)",
    icon: <FaFilePdf />,
  },
  priceAnalysisPdf: {
    label: "عروض وتحليل اسعار",
    icon: <FaFilePdf />,
  },
  approvedDrawingsPdf: {
    label: "اللوحات المعتمدة (PDF)",
    icon: <FaDraftingCompass />,
  },
  approvedDrawingsDwg: {
    label: "اللوحات المعتمدة (DWG)",
    icon: <FaDraftingCompass />,
  },
  consultantApprovalPdf: {
    label: "اعتماد الاستشاري",
    icon: <FaFilePdf />,
  },
  companyProfilePdf: {
    label: "ملف الشركة",
    icon: <FaFileAlt />,
  },
};
const DISCIPLINES_META = {
  GENERAL: {
    label: "اعتيادي",
    icon: <FaBuilding />,
  },
  PLUMBING: {
    label: "صحي",
    icon: <FaTools />,
  },
  FIRE_FIGHTING: {
    label: "حريق",
    icon: <FaFireAlt />,
  },
  ELECTRICAL: {
    label: "كهرباء",
    icon: <FaBolt />,
  },
  HVAC: {
    label: "تكييف",
    icon: <FaSnowflake />,
  },
  MAINTENANCE: {
    label: "صيانة",
    icon: <FaWrench />,
  },
  LANDSCAPING: {
    label: "زراعات",
    icon: <FaTree />,
  },
  INFRASTRUCTURE: {
    label: "شبكات مرافق",
    icon: <FaRoad />,
  },
  SWIMMING_POOLS: {
    label: "حمامات سباحة",
    icon: <FaSwimmer />,
  },
};
const STATUS_META = {
  REVIEW: {
    label: "قيد المراجعة",
    style: "bg-green-400/40 border-green-400",
  },
  TECHNICAL: {
    label: "قائد المكتب الفني / قائد الكتيبة",
    style: "bg-blue-400/40 border-blue-400",
  },
  GENERAL: {
    label: "مكتب فني اللواء",
    style: "bg-yellow-400/40 border-yellow-400",
  },
  SENT: {
    label: "تم الارسال لادارة الاشغال",
    style: "bg-red-400/40 border-red-400",
  },
};

export default function SpecificBillOfQuantitie() {
  const { id } = useParams();
  const [tab, setTab] = useState("files");
  const [showStepBillOfQuantitieModal, setShowStepBillOfQuantitieModal] =
    useState(false);
  const [stepBillOfQuantitieModal, setStepBillOfQuantitieModal] =
    useState("next");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bill-of-quantitie", id],
    queryFn: () => getBillOfQuantitie(id),
    select: (res) => res.data,
  });

  const handleOrganizationalUnitIDsArray = (organizationalUnits) => {
    return organizationalUnits?.map((ou) => ou._id);
  };
  if (isLoading) return <Loading />;
  if (isError || data == null) return <NotFound />;
  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-sart gap-4">
            <Can action="projects:read">
              <NavLink to={"/bill-of-quantitie"} className={"h-fit"}>
                <Button variant="ghost" size="sm">
                  <IoIosArrowForward size={20} />
                </Button>
              </NavLink>
            </Can>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium rounded-2xl px-4 border w-fit ${
                    STATUS_META[data.status].style
                  }`}
                >
                  {STATUS_META[data.status].label}
                </span>
              </div>
              <PageTitle
                title={`${data.name}`}
                subTitle={`تفاصيل مقايسة ${data.name}`}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/*            <Button variant="secondary" icon={<FiDownload />}>
              تصدير التقرير
            </Button> */}
            <Can
              action={`billOfQuantitie:step:${data.status}`}
              unitId={handleOrganizationalUnitIDsArray(
                data?.organizationalUnit,
              )}
            >
              <Button
                variant="secondary"
                icon={<FaSquareArrowUpRight />}
                onClick={() => {
                  setStepBillOfQuantitieModal("next");
                  setShowStepBillOfQuantitieModal(true);
                }}
              >
                رفع المقايسة
              </Button>
            </Can>
            {(data.status === "TECHNICAL" || data.status === "GENERAL") && (
              <Can
                action={`billOfQuantitie:step:${data.status}`}
                unitId={handleOrganizationalUnitIDsArray(
                  data?.organizationalUnit,
                )}
              >
                <Button
                  variant="secondary"
                  icon={<FaBackward />}
                  onClick={() => {
                    setStepBillOfQuantitieModal("prev");
                    setShowStepBillOfQuantitieModal(true);
                  }}
                >
                  استيفاء المقايسة
                </Button>
              </Can>
            )}
            <Can
              action="projects:update:project"
              unitId={handleOrganizationalUnitIDsArray(
                data?.organizationalUnit,
              )}
            >
              <NavLink to={`/projects/update/${id}`}>
                <Button icon={<FaRegEdit />}>تعديل</Button>
              </NavLink>
            </Can>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
          <Card className="bg-base h-fit">
            <CardHeader>
              <h3 className="text-xl font-bold">بيانات المقايسة</h3>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="icon">
                    <FaProjectDiagram />
                  </div>
                  <div>
                    <h6 className="font-light">اسم المشروع</h6>
                    <div>
                      <span className="font-bold">{data.project.name}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <NavLink to={`/projects/read/${data.project._id}`}>
                    <Button variant="ghost" size="xs">
                      <FaEye className="text-primary-500" />
                    </Button>
                  </NavLink>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="icon">
                    <FaBuilding />
                  </div>
                  <div>
                    <h6 className="font-light">اسم الشركة</h6>
                    <div>
                      <span className="font-bold">
                        {data.company.companyName}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <NavLink to={`/companies/read/${data.company._id}`}>
                    <Button variant="ghost" size="xs">
                      <FaEye className="text-primary-500" />
                    </Button>
                  </NavLink>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FaCalendarCheck />
                </div>
                <div>
                  <h6 className="font-light">مدة المشروع</h6>
                  <span className="font-bold">{data.projectDuration} شهر</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FaVectorSquare />
                </div>
                <div>
                  <h6 className="font-light">المسطح</h6>
                  <span className="font-bold">{data.area}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FaDollarSign />
                </div>
                <div>
                  <h6 className="font-light">سعر المتر المسطح</h6>
                  <span className="font-bold">
                    {data.pricePerMeter} جنية مصري
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <GiSteelClaws />
                </div>
                <div>
                  <h6 className="font-light">سعر الحديد</h6>
                  <span className="font-bold">{data.steelPrice} جنية مصري</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <GiConcreteBag />
                </div>
                <div>
                  <h6 className="font-light">سعر الاسمنت</h6>
                  <span className="font-bold">
                    {data.cementPrice} جنية مصري
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FaPercentage />
                </div>
                <div>
                  <h6 className="font-light">نسبة التنفيذ</h6>
                  <span className="font-bold">
                    {data.completionPercentage}%
                  </span>
                </div>
              </div>
              {data.organizationalUnit.length > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon">
                    <VscReferences />
                  </div>
                  <div>
                    <h6 className="font-light">الوحدة التابع لها</h6>
                    <span className="font-bold">
                      {data.organizationalUnit.map((o) => o.name).join(", ") ||
                        "----"}
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          <Card className="bg-base h-fit">
            <CardHeader>
              <div className="flex justify-end">
                <div
                  className="inline-flex rounded-lg shadow-xs -space-x-px bg-primary-100 text-primary-content-100 p-1"
                  role="group"
                >
                  <button
                    onClick={() => setTab("files")}
                    type="button"
                    className={`px-4 py-1 rounded-md cursor-pointer text-sm  ${
                      tab === "files"
                        ? "bg-primary-500 text-primary-content-500"
                        : ""
                    }`}
                  >
                    المستندات
                  </button>
                  <button
                    onClick={() => setTab("disciplines")}
                    type="button"
                    className={`px-4 py-1 rounded-md cursor-pointer text-sm  ${
                      tab === "disciplines"
                        ? "bg-primary-500 text-primary-content-500"
                        : ""
                    }`}
                  >
                    التخصصات
                  </button>
                  <button
                    onClick={() => setTab("changeLogs")}
                    type="button"
                    className={`px-4 py-1 rounded-md cursor-pointer text-sm  ${
                      tab === "changeLogs"
                        ? "bg-primary-500 text-primary-content-500"
                        : ""
                    }`}
                  >
                    سجل التغييرات
                  </button>
                </div>
              </div>
            </CardHeader>
            {tab === "files" && (
              <CardBody>
                {data.attachments ? (
                  <div className="space-y-3">
                    {Object.entries(data.attachments).map(([key, filePath]) => {
                      if (!filePath) return null;

                      const fileName = filePath.split("/").pop();
                      const meta = ATTACHMENTS_META[key];
                      return (
                        <div
                          key={key}
                          className="flex justify-between items-center p-4 border rounded-lg bg-background hover:bg-muted/40 transition"
                        >
                          {/* File Info */}
                          <div className="flex items-center gap-3">
                            <span className="text-primary-500 text-2xl">
                              {meta?.icon}
                            </span>

                            <div className="flex flex-col">
                              <span className="font-medium">
                                {meta?.label || "ملف مرفق"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {fileName}
                              </span>
                            </div>
                          </div>

                          {/* Action */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(getFileUrl(filePath), "_blank")
                            }
                            icon={<FaDownload />}
                          >
                            تحميل
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    لا توجد ملفات مرفقة
                  </p>
                )}
              </CardBody>
            )}
            {tab === "disciplines" && (
              <CardBody>
                {data.disciplines ? (
                  <div className="space-y-3">
                    {data.disciplines.map((item, index) => {
                      const meta = DISCIPLINES_META[item.type];
                      return (
                        <div
                          key={`${item.type}-${index}`}
                          className="flex justify-between items-center p-4 border rounded-lg bg-background hover:bg-muted/40 transition"
                        >
                          {/* File Info */}
                          <div className="flex items-center gap-3">
                            <span className="text-primary-500 text-xl">
                              {meta?.icon}
                            </span>

                            <div className="flex flex-col">
                              <span className="font-medium">
                                {meta?.label || "تخصص مرفق"}
                              </span>
                            </div>
                          </div>

                          {/* Action */}
                          <div>
                            <span>{item.amount} جنية مصري</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    لا توجد تخصصات
                  </p>
                )}
              </CardBody>
            )}
            {tab === "changeLogs" && (
              <CardBody>
                {data.changeLogs.length > 0 ? (
                  <ol className="relative border-s border-primary-500 border-default">
                    {data.changeLogs.map((log, index) => (
                      <li key={index} className="mb-10 ms-6 space-y-4">
                        <span
                          className="absolute flex items-center justify-center w-6 h-6
                      bg-base rounded-full -start-3 ring-2 ring-primary-500 text-primary-500"
                        >
                          <FaCalendar size={12} />
                        </span>
                        <time className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                          {(() => {
                            const parts = new Intl.DateTimeFormat("en-GB", {
                              timeZone: "Africa/Cairo",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }).formatToParts(new Date(log.createdAt));

                            const get = (type) =>
                              parts.find((p) => p.type === type)?.value;

                            return `${get("day")}/${get("month")}/${get("year")} | ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
                          })()}
                        </time>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-heading my-2">
                          {(log.fromStage == "TECHNICAL" ||
                            log.fromStage == "GENERAL") &&
                          log.toStage == "REVIEW" ? (
                            <>
                              {STATUS_META[log.fromStage].label}
                              <span className="mx-2">
                                <FaArrowLeft />
                              </span>
                              <span className="text-sm font-medium rounded-2xl px-4 border w-fit bg-yellow-400/40 border-yellow-400">
                                استيفاء
                              </span>
                            </>
                          ) : (
                            <>
                              {STATUS_META[log.fromStage].label}
                              <span className="mx-2">
                                <FaArrowLeft />
                              </span>
                              {STATUS_META[log.toStage].label}
                            </>
                          )}
                        </h3>
                        {log.notes.length > 0 ? (
                          log.notes.map((note, index) => (
                            <p key={`note-${index}`} className="mb-4 text-body">
                              {note}
                            </p>
                          ))
                        ) : (
                          <p>لم يتم إضافة ملاحظات</p>
                        )}
                        {log.attachments && (
                          <Button
                            variant="secondary"
                            icon={<FaDownload />}
                            onClick={() =>
                              window.open(
                                getFileUrl(log.attachments.boqPdf),
                                "_blank",
                              )
                            }
                          >
                            تحميل خطاب المقايسة
                          </Button>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-center text-muted-foreground">
                    لا توجد سجل تغييرات
                  </p>
                )}
              </CardBody>
            )}
          </Card>
        </div>
        <StepBillOfQuantitieModal
          billID={data._id}
          isOpen={showStepBillOfQuantitieModal}
          onClose={() => setShowStepBillOfQuantitieModal(false)}
          step={stepBillOfQuantitieModal}
        />
      </section>
    </>
  );
}
