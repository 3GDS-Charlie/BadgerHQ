import DashboardPage from "@/components/pages/Dashboard";

import { createClient } from "@/lib/supabase/server-props";

export default DashboardPage;

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
