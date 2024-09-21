import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/shared/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/shared/Popover";

export function Combobox({
  defaultValue,
  value,
  setValue,
  data,
  placeholder,
  className
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); // Track search input
  const filteredData = data.filter((oneData) =>
    oneData.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} className={className}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between ${className}`}
        >
          {value
            ? data.find((oneData) => oneData.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[200px] p-0 ${className}`}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder || "Search..."}
            onValueChange={(val) => setSearch(val)}
          />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {filteredData.map((oneData) => (
                <CommandItem
                  key={oneData.value}
                  value={oneData.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === oneData.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {oneData.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
