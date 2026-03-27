import React, { useState } from "react";

export const Tabs = ({ tabs = [], defaultTab = 0, onChange = null }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`px-4 py-2 font-semibold transition-all -mb-px ${
              activeTab === index
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">{tabs[activeTab]?.content}</div>
    </div>
  );
};
