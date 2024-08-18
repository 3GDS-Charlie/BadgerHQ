import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { Combobox } from "@/components/shared/Combobox";
import { createClient } from "@/lib/supabase/component";
import { recursiveCamelCase } from "@/lib/utils";
import { DataTable } from "@/components/shared/Table/DataTable";
import {
  DUTY_POINTS_CUSTOM_NOMINAL_ROLL_COLUMNS,
  NOMINAL_ROLL_COLUMNS,
  PLATOONS
} from "@/lib/data";

const Custom = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: allPersonnel, error: error1 } = await supabaseClient
        .from("profiles")
        .select();
      if (error1) {
        console.error(error1);
      }
      setData(recursiveCamelCase(allPersonnel));
      setLoading(false);
    })();
  }, []);
  return (
    <div className="w-full overflow-auto flex flex-col pr-4">
      <h1 className="text-md mb-2 font-semibold">Custom list</h1>
      {/* List */}
      <div>
        {loading ? (
          <span className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          <DataTable
            className="mt-4"
            columns={DUTY_POINTS_CUSTOM_NOMINAL_ROLL_COLUMNS}
            data={data || []}
            search
            setData={setData}
            state={{
              columnVisibility: {
                id: false
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Custom;
