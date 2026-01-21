"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Text } from "../text";

interface CustomPaginationProps {
  currentPage: number;
  total: number; // total number of items
  pageSize: number; // number of items per page
  onChangePage: (page: number) => void;
  onChangePageSize?: (pageSize: number) => void;
  isPageSize?: boolean;
}

const pageSizeOptions = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  total,
  pageSize,
  onChangePage,
  onChangePageSize,
  isPageSize = false,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const totalMemo = useMemo(() => {
    const itemEnd = currentPage * pageSize;
    const itemStart = currentPage * pageSize - pageSize + 1;
    return `Hiển thị ${itemStart}-${itemEnd} của ${total}`;
  }, [total, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onChangePage(page);
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = Math.min(Math.max(inputPage, 1), totalPages);
      if (page !== currentPage) {
        onChangePage(page);
      }
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = startPage + maxPageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination className="justify-between p-2 flex flex-wrap sm:flex-row flex-col items-center gap-4">
      {/* Tổng số */}
      <Text
        weight={"regular"}
        className="text-[#091E42] text-[0.75rem]"
      >{`${totalMemo}`}</Text>

      <div className="flex sm:flex-row flex-col gap-5">
        {/* {isPageSize && (
          <div className="flex items-center gap-2 sm:w-fit w-full justify-center">
            <CustomSelect
              className="w-20"
              sizes="small"
              isClear={false}
              value={pageSize.toString()}
              onValueChange={(value) => onChangePageSize?.(parseInt(value))}
              options={pageSizeOptions}
            />
            <Text
              weight={"regular"}
              className="text-[#091E42] text-[0.75rem] w-fit"
            >
              Đi đến trang
            </Text>
            <Input
              type="number"
              // sizes="small"
              className="w-10"
              value={inputPage}
              onChange={(e) => setInputPage(Number(e.target.value))}
              onKeyDown={handlePageInputKeyDown}
              min={1}
              max={totalPages}
            />
          </div>
        )} */}

        {/* Pagination */}
        <PaginationContent className="gap-3 items-center justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              size="default"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href="#"
              size="default"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </Pagination>
  );
};

export default CustomPagination;
