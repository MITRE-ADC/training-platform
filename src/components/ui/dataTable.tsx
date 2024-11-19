"use client";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  filterFns,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./button";
import { P } from "./custom/text";
import { ScrollArea } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSort?: string;
  placeholder?: string;
  filter?: DataTableFilteringProps;
}

interface DataTableFilteringProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  filterFn: FilterFn<any>;
}

export function SortableColumn<TData, TValue>({
  column,
  title,
  callback,
}: {
  column: Column<TData, TValue>;
  title: string;
  callback?: () => void;
}) {
  const sort = column.getIsSorted();

  return (
    <>
      <Button
        variant="ghost"
        className="py-2 pl-0 hover:bg-white"
        onClick={() => {
          column.toggleSorting(sort === "asc");
          if (callback) callback();
        }}
      >
        <P className="text-darkLight">{title}</P>
        <span className="pl-2 font-medium">
          {sort ? (
            sort == "asc" ? (
              <i className="ri-arrow-up-s-line"></i>
            ) : (
              <i className="ri-arrow-down-s-line"></i>
            )
          ) : (
            <i className="ri-expand-up-down-line"></i>
          )}
        </span>
      </Button>
    </>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultSort,
  placeholder,
  filter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: defaultSort ?? '',
      desc: true,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filter?.filter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: filter?.setFilter,
    globalFilterFn: filter?.filterFn,
  });

  return (
    <div className="flex flex-col justify-between">
      <ScrollArea className="h-[560px] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-full border-b-highlight"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-full">
                      <P>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </P>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <P>{placeholder ? placeholder : "No results."}</P>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
