"use client";

import {
  Column,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
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
import { useState } from "react";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  alternate?: boolean;
  defaultSort?: string;
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
        className="py-2 pl-0 text-base font-bold text-black hover:bg-white"
        onClick={() => {
          column.toggleSorting(sort === "asc");
          if (callback) callback();
        }}
      >
        {title}
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
  alternate,
  defaultSort,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: defaultSort ? defaultSort : "",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualSorting: true, // NOTE: we expect sorting to be done server side!
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="py-2 font-bold text-black"
                  >
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
            table.getRowModel().rows.map((row, ind) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  (alternate && ind % 2 == 1 ? "bg-white" : "bg-secondary") +
                  " h-full"
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-full">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
