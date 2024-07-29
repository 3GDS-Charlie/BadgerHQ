import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/shared/Select";

const EditableTableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue() ? row.getValue("id") : "";
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onChange = (newValue) => {
    table.options.meta?.updateData(row.index, column.id, newValue);
  };
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select personnel" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={null}>Empty</SelectItem>
        {table.options.meta?.allPersonnels.map((onePersonnel, index) => (
          <SelectItem key={index} value={onePersonnel.id}>
            {onePersonnel.rank} {onePersonnel.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EditableTableCell;
