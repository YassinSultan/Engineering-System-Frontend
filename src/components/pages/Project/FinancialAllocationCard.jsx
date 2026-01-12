import React from "react";
import Button from "../../ui/Button/Button";
import getFileUrl from "../../../utils/getDownladLink";
import { FaDownload } from "react-icons/fa";
import Can from "../../common/Can/Can";

export default function FinancialAllocationCard({
  organizationalUnit,
  financialAllocation,
  onUpdate,
}) {
  return (
    <div className="my-3 rounded-lg border border-primary-500 bg-primary-50 text-primary-content-50 dark:bg-primary-900 dark:text-primary-content-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer select-none">
        <div className="flex gap-4 items-center">
          <div>
            <h6 className="text-lg font-semibold">
              قيمة التخصص المالي :
              <span className="ms-2 font-normal ">
                {financialAllocation.value} جنية مصري
              </span>
            </h6>
            <p className="text-sm opacity-80">
              تاريخ السماح:
              <span className="ms-2">
                {financialAllocation.date.split("T")[0]}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(getFileUrl(financialAllocation.file), "_blank")
              }
            >
              <FaDownload />
            </Button>
          </div>
          <Can
            action={"projects:update:financialAllocation"}
            unitId={organizationalUnit}
          >
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(financialAllocation);
              }}
            >
              تعديل
            </Button>
          </Can>
        </div>
      </div>
    </div>
  );
}
