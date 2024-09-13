import MePage from "@/components/pages/Me";

import { createClient } from "@/lib/supabase/server-props";

export default MePage;

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
