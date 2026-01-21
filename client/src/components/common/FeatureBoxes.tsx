"use client";

export default function FeatureBoxes() {
  const items = [
    {
      id: 1,
      title: "STUDYPLAN CHI TIẾT",
      color: "from-cyan-400 to-sky-500",
      icon: "/icons/StudyPlan-Chi-Tiet.png",
    },
    {
      id: 2,
      title: (
        <>
          PHƯƠNG PHÁP GIẢNG DẠY <br />
          <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl">
            LCLT
          </span>
        </>
      ),
      color: "from-purple-500 to-pink-500",
      icon: "/icons/Phuong-phap-LCLT.png",
    },
    {
      id: 3,
      title: "GIÁO VIÊN TINH TUYỂN",
      color: "from-cyan-400 to-sky-500",
      icon: "/icons/Giaso-vien-tinh-tuyen.png",
    },
  ];

  return (
    <div className="w-full bg-white py-10">
      <div className="max-w-[1250px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:items-center gap-6">
          {items.map((feature) => {
            const isSecond = feature.id === 2;
            let extraClasses = "";
            if (feature.id === 1) {
              extraClasses = "col-start-1 row-start-1 lg:col-start-1 lg:row-start-auto";
            } else if (feature.id === 3) {
              extraClasses = "col-start-2 row-start-1 lg:col-start-3 lg:row-start-auto";
            } else if (feature.id === 2) {
              extraClasses = "col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-auto";
            }

            const height = isSecond
              ? "h-36 md:h-56 lg:h-[272px]"
              : "h-[120px] md:h-40 lg:h-48";

            const gradient = isSecond
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gradient-to-r from-cyan-300 to-sky-500 text-sky-900";

            const widthAdjust = isSecond ? "w-full sm:w-[70%] lg:w-full mx-auto" : "";

            const textClass = isSecond
              ? "mt-3 font-semibold text-lg sm:text-xl md:text-2xl"
              : "mt-3 font-semibold text-base sm:text-lg md:text-xl";

            const alt =
              feature.id === 1
                ? "StudyPlan-Chi-Tiet"
                : feature.id === 2
                ? "Phuong-phap-LCLT"
                : "Giao-vien-tinh-tuyen";

            return (
              <div key={feature.id} className={extraClasses}>
                <div
                  className={`${height} ${gradient} ${widthAdjust} rounded-2xl shadow-md flex flex-col items-center justify-center text-center p-4 md:p-6 hover:scale-105 transition-transform duration-300`}
                >
                  <img
                    src={feature.icon}
                    alt={alt}
                    className="size-[70px] hidden md:block"
                  />
                  <p className={textClass}>{feature.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
