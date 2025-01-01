import AlarmList from "@/components/alarms/alarm-list";
import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {

  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();


  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">

      <OngoingAlarm className="rounded-md bg-gray-800"/>

      <AlarmList />

    </div>
  );
}
