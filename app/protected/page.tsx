import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let { data: current_alarm, error } = await supabase
  .from('Alarms')
  .select('*')
  .eq('status', 2)
  .range(0,0)

  if (error) {
    console.error('Error fetching alarm:', error.message);
  } else if (current_alarm && current_alarm.length > 0) {
    // current_alarm är en array med max 1 objekt
    current_alarm = current_alarm[0];
    console.log('First alarm row:', current_alarm);
  } else {
    console.log('No alarms found with status 2.');
  }

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">


      {JSON.stringify(current_alarm.description, null, 2)}

      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
