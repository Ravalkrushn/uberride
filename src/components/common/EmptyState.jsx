import React from "react";
import { MdOutlineEmptyRecords } from "react-icons/md";

export const EmptyState = ({
  icon: Icon = MdOutlineEmptyRecords,
  title = "No Data",
  description = "There is no data to display",
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
