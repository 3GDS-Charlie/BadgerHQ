import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel
} from "@tanstack/react-table";
import { unparse } from "papaparse";
import dayjs from "dayjs";
import { useState } from "react";
import { Copy, Download, Search } from "lucide-react";
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
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/shared/Tooltip";
import { CLIPBOARD_TEMPLATE_GD_SINGLE } from "@/lib/data";

export function DataTable({
  className,
  columns,
  data,
  setData,
  meta: {
    allPersonnels = [],
    commanders = [],
    troopers = [],
    location,
    date,
    id
  } = {},
  state,
  search = false,
  csvFileName = null,
  downloadable = false,
  copyable = false
}) {
  const { toast } = useToast();
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

  const generateClipboard = () => {
    const formattedPersonnels = data
      .map(
        (onePersonnel) =>
          `- ${onePersonnel.rank} ${onePersonnel.name} (${onePersonnel.appointment})`
      )
      .join("\n");
    copyToClipboard(
      CLIPBOARD_TEMPLATE_GD_SINGLE(date, location, formattedPersonnels, id)
    );

    toast({
      title: "Success!",
      description: "Copied to clipboard"
    });

    return clipboard;
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
      <span className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        {search ? (
          <div className="relative flex-1 mt-0 sm:mt-4">
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
        <span className="sm:space-x-4">
          {copyable && (
            <Tooltip>
              <TooltipTrigger className="text-left mt-4 sm:mt-0" asChild>
                <Button
                  variant="secondary"
                  disabled={data.length === 0}
                  onClick={generateClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy as Text
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Copy to clipboard in whatsapp/tele friendly format
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {downloadable && (
            <Button
              className="mt-4 sm:mt-0"
              disabled={data.length === 0}
              onClick={generateCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          )}
        </span>
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
