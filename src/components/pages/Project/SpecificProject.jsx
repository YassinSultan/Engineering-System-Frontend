import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router";
import { getProject } from "../../../api/projectApi";
import Loading from "../../common/Loading/Loading";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Can from "../../common/Can/Can";
import Button from "../../ui/Button/Button";
import { IoIosArrowForward } from "react-icons/io";
import Card from "../../ui/Card/Card";
import CardHeader from "../../ui/Card/CardHeader";
import CardBody from "../../ui/Card/CardBody";
import formatDate from "../../../utils/formatDate";
import {
  FaDollarSign,
  FaDownload,
  FaFile,
  FaPlus,
  FaPlusCircle,
  FaRegEdit,
} from "react-icons/fa";
import { FiCalendar, FiDownload, FiMapPin, FiUser } from "react-icons/fi";
import { RiBuilding2Line } from "react-icons/ri";
import { RxRulerSquare } from "react-icons/rx";
import { TbCrosshair } from "react-icons/tb";
import { BsDownload, BsPlus } from "react-icons/bs";
import getFileUrl from "../../../utils/getDownladLink";
import NotFound from "../NotFound/NotFound";
import { VscReferences } from "react-icons/vsc";
import AddProtocolModal from "./AddProtocolModal";
import ProtocolCard from "./ProtocolCard";
import ContractPermissionModal from "./ContractPermissionModal";
import ContractPermissionCard from "./ContractPermissionCard";
import WithdrawalPermissionCard from "./WithdrawalPermissionCard";
import WithdrawalPermissionModal from "./WithdrawalPermissionModal";
export default function SpecificProject() {
  const [tab, setTab] = useState("files");
  const [showWithdrawalPermissionModal, setShowWithdrawalPermissionModal] =
    useState(false);
  const [modeWithdrawalPermissionModal, setModeWithdrawalPermissionModal] =
    useState("create");
  const [WithdrawalPermissionData, setWithdrawalPermissionData] =
    useState(null);
  const [showContractPermissionModal, setShowContractPermissionModal] =
    useState(false);
  const [modeContractPermissionModal, setModeContractPermissionModal] =
    useState("create");
  const [contractPermissionData, setContractPermissionData] = useState(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [modeProtocolModal, setModeProtocolModal] = useState("create");
  const [protocolData, setProtocolData] = useState(null);
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    select: (res) => res.data,
  });
  if (isLoading) return <Loading />;
  if (isError || data == null) return <NotFound />;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-sart gap-4">
          <Can action="projects:read">
            <NavLink to={"/projects"} className={"h-fit"}>
              <Button variant="ghost" size="sm">
                <IoIosArrowForward size={20} />
              </Button>
            </NavLink>
          </Can>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <span className="text-primary-500">{data.code}</span>
              <span
                className={`text-sm font-medium rounded-2xl px-4 border w-fit ${
                  data.status == "STUDY"
                    ? "bg-green-400/40 border-green-400"
                    : data.status == "ONGOING"
                    ? "bg-yellow-400/40 border-yellow-400"
                    : "bg-red-400/40 border-red-400"
                }`}
              >
                {data.status == "STUDY"
                  ? "دراسة"
                  : data.status == "ONGOING"
                  ? "جاري"
                  : "منتهي"}
              </span>
            </div>
            <PageTitle
              title={`${data.name}`}
              subTitle={`تفاصيل مشروع ${data.name}`}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="secondary" icon={<FiDownload />}>
            تصدير التقرير
          </Button>
          <Can action="projects:update">
            <NavLink to={`/projects/${id}/edit`}>
              <Button icon={<FaRegEdit />}>تعديل</Button>
            </NavLink>
          </Can>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        <Card className="bg-base h-fit">
          <CardHeader>
            <h3 className="text-xl font-bold">بيانات المشروع</h3>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 mb-4">
              <div className="icon">
                <FiMapPin />
              </div>
              <div>
                <h6 className="font-light">موقع التعاقد</h6>
                <span className="font-bold">{data.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="icon">
                <RiBuilding2Line />
              </div>
              <div>
                <h6 className="font-light">جهة التعاقد</h6>
                <span className="font-bold">
                  {data.contractingParty == "CIVILIAN"
                    ? "جهة مدنية"
                    : data.contractingParty == "MILITARY"
                    ? "جهة قوات مسلحة"
                    : "جهة موازنة"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="icon">
                <RxRulerSquare />
              </div>
              <div>
                <h6 className="font-light">مساحة الارض</h6>
                <span className="font-bold">
                  {data.landArea || "----"} م<sup className="text-xs">2</sup>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TbCrosshair className="text-xl" />
                <h6 className="font-light">إحداثيات الأرض (e,n)</h6>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data.coordinates.map((coord, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-background/50 rounded shadow-sm"
                  >
                    <span className="font-semibold">نقطة {index + 1}</span>
                    <span>
                      {coord.e || "----"}, {coord.n || "----"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {data.fiscalYear && (
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FiCalendar />
                </div>
                <div>
                  <h6 className="font-light">العام المالي</h6>
                  <span className="font-bold">{data.fiscalYear || "----"}</span>
                </div>
              </div>
            )}
            {data.estimatedCost && (
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FaDollarSign />
                </div>
                <div>
                  <h6 className="font-light">التكلفة التقديرية</h6>
                  <span className="font-bold">
                    {data.estimatedCost.value || "----"}
                  </span>
                </div>
              </div>
            )}
            {data.ownerEntity && (
              <div className="flex items-center gap-4 mb-4">
                <div className="icon">
                  <FiUser />
                </div>
                <div>
                  <h6 className="font-light">الجهة المالكة</h6>
                  <span className="font-bold">
                    {data.ownerEntity.name || "----"}
                  </span>
                </div>
              </div>
            )}
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
            <div className="flex items-center gap-4 mb-4">
              <div className="icon">
                <FiCalendar />
              </div>
              <div>
                <h6 className="font-light">تاريخ البدء</h6>
                <span className="font-bold">
                  {formatDate(data.startDate) || "----"}
                </span>
              </div>
            </div>
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
                  onClick={() => setTab("contractPermissions")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer text-sm  ${
                    tab === "contractPermissions"
                      ? "bg-primary-500 text-primary-content-500"
                      : ""
                  }`}
                >
                  صلاحيات التعاقد
                </button>
                <button
                  onClick={() => setTab("WithdrawalPermissions")}
                  type="button"
                  className={`px-4 py-1 rounded-md cursor-pointer text-sm  ${
                    tab === "WithdrawalPermissions"
                      ? "bg-primary-500 text-primary-content-500"
                      : ""
                  }`}
                >
                  صلاحيات الصرف
                </button>
                {data.contractingParty === "CIVILIAN" && (
                  <button
                    onClick={() => setTab("protocols")}
                    type="button"
                    className={`px-4 py-1 rounded-md cursor-pointer text-sm ${
                      tab === "protocols"
                        ? "bg-primary-500 text-primary-content-500"
                        : ""
                    }`}
                  >
                    البروتوكلات
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          {tab === "files" && (
            <>
              <CardBody>
                {data.siteHandoverFile && (
                  <div className="p-3 bg-background/40 rounded-md shadow flex justify-between items-center mb-4">
                    <div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            getFileUrl(data.siteHandoverFile),
                            "_blank"
                          )
                        }
                      >
                        <FaDownload />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span>ملف استلام الموقع </span>
                        <span className="text-sm font-light">
                          {data.siteHandoverFile.split("/").pop().split("-")[1]}
                        </span>
                      </div>
                      <div>
                        <FaFile size={20} className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                )}
                {data.networkBudgetFile && (
                  <div className="p-3 bg-background/40 rounded-md shadow flex justify-between items-center mb-4">
                    <div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            getFileUrl(data.networkBudgetFile),
                            "_blank"
                          )
                        }
                      >
                        <FaDownload />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span>ملف الميزانية الشبكة</span>
                        <span className="text-sm font-light">
                          {
                            data.networkBudgetFile
                              .split("/")
                              .pop()
                              .split("-")[1]
                          }
                        </span>
                      </div>
                      <div>
                        <FaFile size={20} className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                )}
                {data.estimatedCost?.file && (
                  <div className="p-3 bg-background/40 rounded-md shadow flex justify-between items-center mb-4">
                    <div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            getFileUrl(data.estimatedCost.file),
                            "_blank"
                          )
                        }
                      >
                        <FaDownload />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span>ملف التكلفة التقديرية </span>
                        <span className="text-sm font-light">
                          {
                            data.estimatedCost.file
                              .split("/")
                              .pop()
                              .split("-")[1]
                          }
                        </span>
                      </div>
                      <div>
                        <FaFile size={20} className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                )}
                {data.securityApprovalFile && (
                  <div className="p-3 bg-background/40 rounded-md shadow flex justify-between items-center mb-4">
                    <div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            getFileUrl(data.securityApprovalFile),
                            "_blank"
                          )
                        }
                      >
                        <FaDownload />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span>ملف تصديق الامانة </span>
                        <span className="text-sm font-light">
                          {
                            data.securityApprovalFile
                              .split("/")
                              .pop()
                              .split("-")[1]
                          }
                        </span>
                      </div>
                      <div>
                        <FaFile size={20} className="text-primary-500" />
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </>
          )}
          {tab === "protocols" && (
            <>
              <CardBody>
                <div className="mb-4">
                  <Can action="projects:update">
                    <Button
                      icon={<FaPlus />}
                      onClick={() => {
                        setModeProtocolModal("create");
                        setShowProtocolModal(true);
                      }}
                    >
                      اضافة بروتوكول
                    </Button>
                  </Can>
                </div>
                {data.protocols ? (
                  <>
                    {data.protocols.map((protocol) => (
                      <ProtocolCard
                        key={protocol._id}
                        protocol={protocol}
                        onUpdate={(protocol) => {
                          setProtocolData(protocol);
                          setShowProtocolModal(true);
                          setModeProtocolModal("update");
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-center text-2xl font-bold border p-4 rounded border-dashed border-primary-500 text-primary-500">
                      <h6 className="mb-4">لا يوجد بروتوكولات</h6>
                    </div>
                  </>
                )}
              </CardBody>
            </>
          )}
          {tab === "contractPermissions" && (
            <>
              <CardBody>
                <div className="mb-4">
                  <Can action="projects:create:contractPermission">
                    <Button
                      icon={<FaPlus />}
                      onClick={() => {
                        setModeContractPermissionModal("create");
                        setShowContractPermissionModal(true);
                      }}
                    >
                      اضافة سماح بالتعاقد
                    </Button>
                  </Can>
                </div>
                {data.contractPermissions.length ? (
                  <>
                    {data.contractPermissions.map((contract) => (
                      <ContractPermissionCard
                        key={contract._id}
                        contract={contract}
                        onUpdate={(contract) => {
                          setContractPermissionData(contract);
                          setModeContractPermissionModal("update");
                          setShowContractPermissionModal(true);
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-center text-2xl font-bold border p-4 rounded border-dashed border-primary-500 text-primary-500">
                      <h6 className="mb-4">لا يوجد سماحات بالتعاقد</h6>
                    </div>
                  </>
                )}
              </CardBody>
            </>
          )}
          {tab === "WithdrawalPermissions" && (
            <>
              <CardBody>
                <div className="mb-4">
                  <Can action="projects:create:contractPermission">
                    <Button
                      icon={<FaPlus />}
                      onClick={() => {
                        setModeWithdrawalPermissionModal("create");
                        setShowWithdrawalPermissionModal(true);
                      }}
                    >
                      اضافة سماح بالصرف
                    </Button>
                  </Can>
                </div>
                {data.withdrawalPermissions.length ? (
                  <>
                    {data.withdrawalPermissions.map((withdrawal) => (
                      <WithdrawalPermissionCard
                        key={withdrawal._id}
                        withdrawal={withdrawal}
                        onUpdate={(withdrawal) => {
                          setWithdrawalPermissionData(withdrawal);
                          setModeWithdrawalPermissionModal("update");
                          setShowWithdrawalPermissionModal(true);
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-center text-2xl font-bold border p-4 rounded border-dashed border-primary-500 text-primary-500">
                      <h6 className="mb-4">لا يوجد سماحات بالصرف</h6>
                    </div>
                  </>
                )}
              </CardBody>
            </>
          )}
        </Card>
      </div>
      <AddProtocolModal
        projectID={id}
        isOpen={showProtocolModal}
        onClose={() => {
          setShowProtocolModal(false);
          refetch();
        }}
        mode={modeProtocolModal}
        initialData={modeProtocolModal === "update" ? protocolData : null}
      />
      <ContractPermissionModal
        projectID={id}
        isOpen={showContractPermissionModal}
        onClose={() => setShowContractPermissionModal(false)}
        mode={modeContractPermissionModal}
        initialData={
          modeContractPermissionModal === "update"
            ? contractPermissionData
            : null
        }
      />
      <WithdrawalPermissionModal
        projectID={id}
        isOpen={showWithdrawalPermissionModal}
        onClose={() => setShowWithdrawalPermissionModal(false)}
        mode={modeWithdrawalPermissionModal}
        initialData={
          modeWithdrawalPermissionModal === "update"
            ? WithdrawalPermissionData
            : null
        }
      />
    </section>
  );
}
