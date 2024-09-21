import { useState, useEffect } from "react";
import { Combobox } from "@/components/shared/Combobox";

const EditableTableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue() ? row.getValue("id") : "";
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    table.options.meta?.updateData(row.index, column.id, value);
  }, [value]);
  const appointment = row.getValue("appointment");
  let list = table.options.meta?.troopers;
  if (
    appointment === "GUARD COMMANDER" ||
    appointment === "GUARD IC" ||
    appointment === "RESERVE GUARD COMMANDER"
  ) {
    list = table.options.meta?.commanders;
  }
  list = list.map((onePersonnel) => ({
    value: onePersonnel.id,
    label: `${onePersonnel.rank} ${onePersonnel.name} (PLT ${onePersonnel.platoon})`
  }));
  return (
    <Combobox
      className="w-full"
      value={value}
      setValue={setValue}
      data={list}
      placeholder="Search personnels"
    />
  );
};

export default EditableTableCell;
