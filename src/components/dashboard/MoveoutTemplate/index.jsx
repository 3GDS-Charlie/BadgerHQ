import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/component";
import { recursiveCamelCase } from "@/lib/utils";

const MoveoutTemplate = () => {
  const supabaseClient = createClient();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
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
    <div className="flex flex-col mt-4">
      <span className="flex justify-between space-x-4 items-center mb-4">
        <span>
          <h2 className="font-semibold text-lg">Moveout Template</h2>
          <p className="text-sm text-left text-slate-500">
            Generate moveout template easily and copy it to clipboard.
          </p>
        </span>
        <span className="flex gap-x-4">
          {/* <Combobox
            value={platoon}
            setValue={setPlatoon}
            data={PLATOONS}
            placeholder="Search platoon"
          /> */}
        </span>
      </span>
      <div>
        {loading ? (
          <span className="w-full h-full flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </span>
        ) : (
          <p>list here</p>
        )}
      </div>
    </div>
  );
};

export default MoveoutTemplate;
