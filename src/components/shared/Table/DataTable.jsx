import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel
} from "@tanstack/react-table";
import { parse, unparse } from "papaparse";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/Table";
import { Input } from "@/components/shared/Input";
import { Button } from "../Button";

export function DataTable({
  className,
  columns,
  data,
  setData,
  allPersonnels = [],
  commanders = [],
  troopers = [],
  state,
  search = false,
  csvFileName = null,
  downloadable = false
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const downloadCSV = (csvString) => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", csvFileName || "table_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    const headers = JSON.parse(
      JSON.stringify(columns.map((col) => col.header))
    ); // deepcopy so that we don't get the raw header with functions
    const rows = data.map((row) => columns.map((col) => row[col.accessorKey]));
    const csvString = unparse([headers, ...rows]);
    downloadCSV(csvString);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      ...state,
      sorting,
      columnFilters
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) => ({
          ...old,
          personnels: old?.personnels?.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old?.personnels[rowIndex],
                [columnId]: value,
                id: value,
                dutyPoints: (() => {
                  const personnel = allPersonnels.find(
                    (person) => person.id === value
                  );
                  return personnel ? personnel.duty_points : null;
                })(),
                platoon: (() => {
                  const personnel = allPersonnels.find(
                    (person) => person.id === value
                  );
                  return personnel ? personnel.platoon : null;
                })()
              };
            }
            return row;
          })
        }));
      },
      allPersonnels,
      commanders,
      troopers
    }
  });

  return (
    <>
      <span className="flex justify-between items-center">
        {search ? (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-8"
            />
          </div>
        ) : (
          <span></span>
        )}
        {downloadable && (
          <Button disabled={data.length === 0} onClick={generateCSV}>
            Download CSV
          </Button>
        )}
      </span>

      <div className={`rounded-md border ${className}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
