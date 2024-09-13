import EditGuardDutyPage from "@/components/pages/EditGuardDuty";

import { createClient } from "@/lib/supabase/server-props";

export default EditGuardDutyPage;

export async function getServerSideProps(context) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data) {
    return {
      redirect: {
        destination: "/404",
        permanent: false
      }
    };
  }

  return {
    props: {
      user: data.user
    }
  };
}
