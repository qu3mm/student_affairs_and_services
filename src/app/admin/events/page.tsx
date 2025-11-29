import EventsDashboard from "@/components/admin/events-dashboard";
import { fetchAdminEvents } from "./actions";


async function page(){
  const events = await fetchAdminEvents();

  return <EventsDashboard events={events} />;
};

export default page

