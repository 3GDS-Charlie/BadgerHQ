import ViewProfilePage from "@/components/pages/ViewProfile";

import { createClient } from "@/lib/supabase/server-props";

export default ViewProfilePage;

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
