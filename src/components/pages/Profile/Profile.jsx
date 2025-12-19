import React from "react";
import PageTitle from "../../ui/PageTitle/PageTitle";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../api/profileApi";
import Loading from "../../common/Loading/Loading";

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <section>
        <div className="mb-4">
          <PageTitle title="الملف الشخصي" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-base w-full p-2 rounded-lg shadow-md col-span-3">
            <h3 className="text-xl">المعلومات الشخصية</h3>
            <div className="flex flex-col">
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">
                  الاسم باللغة العربية
                </span>
                <span className="w-3/4 font-light">
                  {profile?.data.fullNameArabic || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">
                  الاسم باللغة الانجليزية
                </span>
                <span className="w-3/4 font-light">
                  {profile?.data.fullNameEnglish || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold">الوحدة التابع لها</span>
                <span className="w-3/4 font-light">
                  {profile?.data?.organizationalUnit?.name || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b border-b-current last:border-b-0">
                <span className="w-1/4 font-semibold">اسم المستخدم</span>
                <span className="w-3/4 font-light">
                  {profile?.data.username || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold"> التخصص</span>
                <span className="w-3/4 font-light">
                  {profile?.data.specialization || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold"> الوظيفة</span>
                <span className="w-3/4 font-light">
                  {profile?.data.role || "----"}
                </span>
              </div>
              <div className="w-full flex py-4 px-2 border-b last:border-b-0">
                <span className="w-1/4 font-semibold"> الصلاحيات</span>
                <span className="w-3/4 font-light">
                  {profile?.data.permissions.map((p) => p).join(" , ") ||
                    "----"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-base p-2 flex flex-col items-center py-5 h-fit w-full shadow-md">
            <div>
              <img
                src={profile?.data.avatar}
                alt="profile"
                width={100}
                height={100}
              />
            </div>
            <div className="text-center">
              <h5 className="text-2xl my-2 font-bold">
                {profile?.data.fullName}
              </h5>
              <p>{profile?.data.role}</p>
            </div>
            <div className="flex justify-between items-center gap-4 mt-8">
              <Button onClick={() => navigate("/profile/edit")}>
                تعديل الملف الشخصي
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/profile/change-password")}
              >
                تغيير كلمة المرور
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
