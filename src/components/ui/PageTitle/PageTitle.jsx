import React from "react";

export default function PageTitle({ title = "عنوان الصفحة" }) {
  return (
    <h2 className="text-2xl font-bold border-b w-fit border-primary-500">
      {title}
    </h2>
  );
}
