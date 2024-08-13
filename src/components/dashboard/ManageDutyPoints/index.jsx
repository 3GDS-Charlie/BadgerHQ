import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import { Combobox } from "@/components/shared/Combobox";
import { PLATOONS } from "@/lib/data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/shared/Tooltip";

const ManageDutyPoints = () => {
  const router = useRouter();
  const [platoon, setPlatoon] = useState("all");
  return (
    <div className="flex flex-col mt-4">
      <span className="flex justify-between space-x-4 items-center mb-4">
        <span>
          <h2 className="font-semibold text-lg">Manage Duty Points</h2>
          <p className="text-sm text-left text-slate-500">
            For administrative use. Generate a list of points to be awarded to
            guard duty personnel mapped to the{" "}
            <Tooltip>
              <TooltipTrigger className="underline">
                Guard Duty Points Logic
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex space-x-1">
                  <b>Weekday:</b>&nbsp; 1 DP{" "}
                  <Image
                    style={{ objectFit: "contain" }}
                    src="/assets/coin.png"
                    alt="logo"
                    width={15}
                    height={15}
                  />
                </p>
                <p className="flex space-x-1">
                  <b>Friday:</b>&nbsp; 1.5 DP{" "}
                  <Image
                    style={{ objectFit: "contain" }}
                    src="/assets/coin.png"
                    alt="logo"
                    width={15}
                    height={15}
                  />
                </p>
                <p className="flex space-x-1">
                  <b>Weekend/PH/OIL:</b>&nbsp; 2 DP{" "}
                  <Image
                    style={{ objectFit: "contain" }}
                    src="/assets/coin.png"
                    alt="logo"
                    width={15}
                    height={15}
                  />
                </p>
              </TooltipContent>
            </Tooltip>{" "}
            or add custom points to specific personnel.
          </p>
        </span>
        <span className="flex gap-x-4">
          <Combobox
            value={platoon}
            setValue={setPlatoon}
            data={PLATOONS}
            placeholder="Search platoon"
          />
        </span>
      </span>
    </div>
  );
};

export default ManageDutyPoints;
