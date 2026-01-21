import slugify from "slugify";
import CardNew from "./card-new";
import { Newspaper } from "lucide-react";
import { New } from "@/types";
import { useRouter } from "next/navigation";

interface GroupNewProps {
  group: {
    title: string;
    items: New[];
  };
}
const GroupNew = ({ group }: GroupNewProps) => {
  const router = useRouter();
  return (
    <div key={group.title} className="mb-16">
      {/* Category Header + Link */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Newspaper size={32} className="text-[#B32686]" />
          <h3 className="text-[20px] font-bold text-[#20376C]">
            {group.title}
          </h3>
        </div>

        <div
          className=" cursor-pointer text-center text-white rounded-2xl font-medium  px-6 py-2 duration-300 transform hover:scale-105"
          style={{
            background: "linear-gradient(90deg, #7459a5 0%, #cb459a 100%)",
          }}
          onClick={() =>
            router.push(`/${slugify(group.title, { lower: true })}-page`)
          }
        >
          Xem tất cả
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {group.items.map((item) => {
          return <CardNew key={item?.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default GroupNew;
