import EditableTableCell from "@/components/shared/Table/EditableTableCell";

export const MONTHS = [
  {
    value: "january",
    label: "January"
  },
  {
    value: "february",
    label: "February"
  },
  {
    value: "march",
    label: "March"
  },
  {
    value: "april",
    label: "April"
  },
  {
    value: "may",
    label: "May"
  },
  {
    value: "june",
    label: "June"
  },
  {
    value: "july",
    label: "July"
  },
  {
    value: "august",
    label: "August"
  },
  {
    value: "september",
    label: "September"
  },
  {
    value: "october",
    label: "October"
  },
  {
    value: "november",
    label: "November"
  },
  {
    value: "december",
    label: "December"
  }
];

export const YEARS = [
  {
    value: "2024",
    label: "2024"
  },
  {
    value: "2025",
    label: "2025"
  }
];

export const EDITABLE_GUARD_DUTY_COLUMNS = [
  {
    accessorKey: "id",
    header: "id"
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: EditableTableCell
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.getValue("appointment");
      if (!appointment) {
        return <p>Empty</p>;
      }
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {appointment}
        </kbd>
      );
    }
  }
];

export const GUARD_DUTY_COLUMNS = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      const rank = row.getValue("rank");
      if (!rank) {
        return <p className="text-red-500">Empty</p>;
      }
      return <p>{rank}</p>;
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name");
      if (!name) {
        return <p className="text-red-500">Empty</p>;
      }
      return <p>{name}</p>;
    }
  },
  {
    accessorKey: "platoon",
    header: "Platoon",
    cell: ({ row }) => {
      const platoon = row.getValue("platoon");
      if (!platoon) {
        return <p className="text-red-500">Empty</p>;
      }
      return <p>{platoon}</p>;
    }
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.getValue("contact");
      if (!contact) {
        return <p className="text-red-500">Empty</p>;
      }
      return <p>{contact}</p>;
    }
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.getValue("appointment");
      if (!appointment) {
        return <p>Empty</p>;
      }
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {appointment}
        </kbd>
      );
    }
  }
];

export const GUARD_ROLES = {
  main: [
    "GUARD COMMANDER",
    "GUARD IC",
    "GUARD 1",
    "GUARD 2",
    "GUARD 3",
    "GUARD 4",
    "GUARD 5",
    "GUARD 6",
    "GUARD 7",
    "ACCESS CONTROL IC"
  ],
  sub: [
    "RESERVE GUARD COMMANDER",
    "RESERVE GUARD 1",
    "RESERVE GUARD 2",
    "RESERVE GUARD 2"
  ]
};
