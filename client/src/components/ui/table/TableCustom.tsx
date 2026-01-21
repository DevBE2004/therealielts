import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import CustomPagination from "./PaginationCustom";

export type IItem = {
  [key: string]: unknown;
};

type AlignType = "center" | "start" | "end";

export type TableProps<item> = {
  title: string;
  key: string;
  dataIndex: string;
  align?: AlignType;
  render?: (record: item) => ReactNode;
  width?: string | number;
  hidden?: boolean;
};

interface TableCustomProps {
  currentPage: number;
  dataSource: any[];
  total: number;
  columnTable: TableProps<any>[];
  onChangePage?: (page: number) => void;
  onChangeSize?: (size: number) => void;
  pageSize?: number;
  heightCell?: number | null;
  isPagination?: boolean;
  className?: string;
  isPageSize?: boolean;
}

const TableCustom = ({
  currentPage,
  total = 0,
  heightCell,
  onChangePage,
  onChangeSize,
  columnTable,
  dataSource,
  pageSize = 10,
  isPagination = true,
  className,
  isPageSize = false,
}: TableCustomProps) => {
  const renderAlign = (align?: AlignType) => {
    switch (align) {
      case "center":
        return "justify-center";
      case "start":
        return "justify-left";
      case "end":
        return "justify-right";
      default:
        return "justify-left";
    }
  };

  const onChangePagination = (page: number) => {
    onChangePage && onChangePage(page);
  };
  const onChangePageSize = (page: number) => {
    onChangeSize && onChangeSize(page);
  };

  return (
    <>
      <div className="border-t border-t-[#DEE5EF]"></div>
      {dataSource?.length ? (
        <Table className={cn("text-[#091E42]", className)}>
          {/* <TableCaption>{`Tổng ${total}`}</TableCaption> */}
          <TableHeader>
            <TableRow className="bg-[#F7F7FA] ">
              {columnTable?.map((item: TableProps<IItem>) => {
                return !item?.hidden ? (
                  <TableHead
                    key={item?.key}
                    className={cn(
                      "w-auto border-r border-[#ECECEC]",
                      item?.width && `w-[${item?.width}]`
                    )}
                  >
                    {item?.title}
                  </TableHead>
                ) : null;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSource?.map((item: IItem, index: number) => {
              return (
                <TableRow
                  key={index}
                  className="hover:bg-[#E1EBF7] border-b border-[#ECECEC]"
                >
                  {columnTable?.map((ele: TableProps<IItem>) => {
                    return !ele?.hidden ? (
                      <TableCell
                        key={ele?.key}
                        className={`${
                          heightCell ? "h-[${heightCell }px" : "h-auto"
                        } min-h-[30px] border-r border-[#ECECEC]`}
                      >
                        <div
                          className={cn("flex w-full", renderAlign(ele?.align))}
                        >
                          {ele?.render
                            ? ele?.render(item)
                            : (item[ele?.key] as React.ReactNode)}
                        </div>
                      </TableCell>
                    ) : null;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          {/* <Image
            src="/icon/EmptySearch.svg"
            alt="empty"
            width={240}
            height={160}
          /> */}
          <div className="mt-4 text-[#7A8593] text-base">
            Không tìm thấy kết quả. Vui lòng thử lại.
          </div>
        </div>
      )}
      {isPagination && (
        <CustomPagination
          currentPage={currentPage}
          onChangePage={onChangePagination}
          onChangePageSize={onChangePageSize}
          total={total}
          pageSize={pageSize}
          isPageSize={isPageSize}
        />
      )}
    </>
  );
};

export default TableCustom;
