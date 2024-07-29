import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/Table";

export function DataTable({
  className,
  columns,
  data,
  setData,
  allPersonnels = [],
  commanders = [],
  troopers = [],
  state
}) {
  const table = useReactTable({
    data,
    columns,
    state,
    getCoreRowModel: getCoreRowModel(),
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
