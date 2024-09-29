import React, { useContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/component";
import { recursiveCamelCase } from "@/lib/utils";
import { Label } from "@/components/shared/Label";
import { Input } from "@/components/shared/Input";
import { DEFAULT_EQUIPMENT_LIST } from "@/lib/data";
import { Separator } from "@/components/shared/Separator";
import AuthContext from "@/lib/context/AuthContext";

const LabelInput = ({ name, defaultValue = 0 }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <span className="flex flex-col space-y-2">
      <Label>{name}</Label>
      <Input value={value} onChange={(event) => setValue(event.target.value)} />
    </span>
  );
};

const MoveoutTemplate = () => {
  const supabaseClient = createClient();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { profile } = useContext(AuthContext);
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
          <div>
            <div>
              <h2 className="font-semibold text-md">General</h2>
              <LabelInput name="Platoon" defaultValue={profile?.platoon} />
              <LabelInput name="Total Strength" />
              <LabelInput name="Participating Strength" />
              <LabelInput name="Commanders" />
              <LabelInput name="Troopers" />
            </div>
            <Separator className="my-4" />
            <h2 className="font-semibold text-md">Equipment List</h2>
            <p className="text-sm text-left text-slate-500">Qty per Pax</p>
            <span className="space-y-4">
              {DEFAULT_EQUIPMENT_LIST.map((oneEquipment, index) => (
                <LabelInput key={index} name={oneEquipment} />
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveoutTemplate;
