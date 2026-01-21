"use client";

import TabNavigation from "@/components/about/phuong-phap-LCLT/TabsNavigation";
import { useEffect, useState } from "react";
import { SectionType, TabConfig } from "../type";
import RenderViewPage from "../render-view-page";

interface TabCustomProps {
  data: TabConfig[];
}

const TabCustom = ({ data }: TabCustomProps) => {
  // Fix: filter bỏ item không có name
  const tabs = [...(data || [])]
    .filter((item) => item?.title) // đảm bảo title không undefined
    .sort((a, b) => {
      const orderA = a.orderIndex ?? 0;
      const orderB = b.orderIndex ?? 0;
      return orderA - orderB;
    })
    .map((item) => ({
      key: `${item.orderIndex}-active`,
      label: item.title!,
    }));

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const RenderViewTab = (active: string) => {
    const item = data?.find(
      (item: TabConfig) => `${item.orderIndex}-active` === active
    );

    return item;
  };
  return (
    <div className="max-w-[1250px] m-auto">
      {tabs.length > 0 && (
        <>
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 my-6">
              {RenderViewTab(activeTab)?.subTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {RenderViewTab(activeTab)?.description}
            </p>
          </div>
          {activeTab && (
            <RenderViewPage
              data={RenderViewTab(activeTab)?.listSection as SectionType[]}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TabCustom;
