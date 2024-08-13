/* eslint-disable no-restricted-globals */
import Image from "next/image";
import { ArrowUpDown, CircleHelp, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import EditableTableCell from "@/components/shared/Table/EditableTableCell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/shared/Tooltip";

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

export const PLATOONS = [
  {
    value: "all",
    label: "All"
  },
  {
    value: "7",
    label: "7"
  },
  {
    value: "8",
    label: "8"
  },
  {
    value: "9",
    label: "9"
  },
  {
    value: "hq",
    label: "HQ"
  }
];

export const DUTY_POINTS_TRANSACTIONS_COLUMNS = [
  {
    accessorKey: "duty_points",
    header: "Duty Points",
    cell: ({ row }) => {
      const dutyPoints = row.getValue("duty_points");
      return (
        <kbd
          className={`${dutyPoints < 0 && "text-red-500"} pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100`}
        >
          {dutyPoints}
          <Image
            style={{ objectFit: "contain" }}
            src="/assets/coin.png"
            alt="logo"
            width={10}
            height={10}
          />
        </kbd>
      );
    }
  },
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at");
      return (
        <code className="font-mono text-gray-500 text-xs font-medium">
          {dayjs(timestamp).format("h:mmA MMM DD, YYYY")}
        </code>
      );
    }
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      const remarks = row.getValue("remarks");
      return <p className="text-xs text-gray-700 font-semibold">{remarks}</p>;
    }
  },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          {id}
        </kbd>
      );
    }
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
    accessorKey: "platoon",
    header: "Platoon",
    cell: ({ row }) => {
      const platoon = row.getValue("platoon");
      if (!platoon) {
        return <p>Empty</p>;
      }
      return <p>{platoon}</p>;
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
  },
  {
    accessorKey: "dutyPoints",
    header: "Current Duty Points",
    cell: ({ row }) => {
      const dutyPoints = row.getValue("dutyPoints");
      if (dutyPoints === null) {
        return <p>Empty</p>;
      }
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {dutyPoints}
          <Image
            style={{ objectFit: "contain" }}
            src="/assets/coin.png"
            alt="logo"
            width={10}
            height={10}
          />
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
  },
  {
    accessorKey: "dutyPoints",
    header: "Current Duty Points",
    cell: ({ row }) => {
      const dutyPoints = row.getValue("dutyPoints");
      if (dutyPoints === null) {
        return <p className="text-red-500">Empty</p>;
      }
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {dutyPoints}
          <Image
            style={{ objectFit: "contain" }}
            src="/assets/coin.png"
            alt="logo"
            width={10}
            height={10}
          />
        </kbd>
      );
    }
  },
  {
    accessorKey: "signExtra",
    header: () => (
      <Tooltip>
        <TooltipTrigger className="flex cursor-pointer items-center select-none hover:underline">
          Sign Extra
          <CircleHelp className="ml-1 h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          If true, it means that the duty personnel will not be awarded the
          points for this duty.
        </TooltipContent>
      </Tooltip>
    ),
    cell: ({ row }) => {
      const signExtra = row.getValue("signExtra");
      if (signExtra === null || signExtra === undefined) {
        return <p className="text-red-500">Empty</p>;
      }
      return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {signExtra.toString()}
        </kbd>
      );
    }
  }
];

export const NOMINAL_ROLL_COLUMNS = [
  {
    accessorKey: "id",
    header: "id"
  },
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
      const id = row.getValue("id");
      return <Link href={`/dashboard/viewProfile/${id}`}>{name}</Link>;
    }
  },
  {
    accessorKey: "platoon",
    header: ({ column }) => (
      <span
        className="flex cursor-pointer select-none hover:underline"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Platoon
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => {
      const platoon = row.getValue("platoon");
      if (!platoon) {
        return <p>Empty</p>;
      }
      return <p>{platoon}</p>;
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email");
      if (!email) {
        return <p>Empty</p>;
      }
      return <p>{email}</p>;
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
  },
  {
    accessorKey: "dutyPoints",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer select-none hover:underline"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Duty Points
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => {
      const dutyPoints = row.getValue("dutyPoints");
      if (dutyPoints === null) {
        return <p className="text-red-500">Empty</p>;
      }
      return (
        <kbd className="whitespace-nowrap pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          {dutyPoints}
          <Image
            style={{ objectFit: "contain" }}
            src="/assets/coin.png"
            alt="logo"
            width={10}
            height={10}
          />
        </kbd>
      );
    }
  },
  {
    accessorKey: "ration",
    header: "Ration",
    cell: ({ row }) => {
      const ration = row.getValue("ration");
      if (!ration) {
        return <p>Empty</p>;
      }
      return <p>{ration}</p>;
    }
  },
  {
    accessorKey: "shirtSize",
    header: "Shirt Size",
    cell: ({ row }) => {
      const shirtSize = row.getValue("shirtSize");
      if (!shirtSize) {
        return <p>Empty</p>;
      }
      return <p>{shirtSize}</p>;
    }
  },
  {
    accessorKey: "pantsSize",
    header: "Pants Size",
    cell: ({ row }) => {
      const pantsSize = row.getValue("pantsSize");
      if (!pantsSize) {
        return <p>Empty</p>;
      }
      return <p>{pantsSize}</p>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const personnelId = row.getValue("id");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/profile/${personnelId}`}>View</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

export const COMMANDER_RANK = [
  "3SG",
  "2SG",
  "1SG",
  "SSG",
  "MSG",
  "3WO",
  "2WO",
  "1WO",
  "MWO",
  "SWO",
  "CWO",
  "2LT",
  "LTA",
  "CPT",
  "MAJ",
  "LTC",
  "SLTC",
  "COL",
  "BG",
  "MG",
  "LG"
];
export const TROOPER_RANK = ["PFC", "LCP", "CPL", "CFC"];
