import { prettyDate } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export default async function OngoingAlarm(props: any) {

    const supabase = await createClient();

    type Alarm = {
        id: number,
        created_at: string,
        description: string,
        location: string,
        units: string,
        status: number
      }
    //   type StatusTexts = Record<number, string>;

    //   const statusTexts: StatusTexts = {
    //     0: "Inaktiv",
    //     1: "Pågående",
    //     2: "Avslutad",
    //   };
      
    //   const getStatusText = (status: number) => statusTexts[status] || "-";
    
      const filterUnits = (input: string, own: boolean): string => {
        const units = input.split(',').map(unit => unit.trim());
        
        return units.filter(unit => own ? unit.startsWith('J1'): !unit.startsWith('J1')).join(', ');
      }

      let { data: current_alarm, error } = await supabase
      .from<string, Alarm>('Alarms')
      .select('*')
      .eq('status', 1)
      .limit(1)
      .single()

    return current_alarm && (
        <div className={props.className + ' p-4'}>
            <div className="flex justify-between mb-6">
                <div>
                    <strong>Aktuellt larm</strong>
                </div>
                <div>
                    <span>{prettyDate(current_alarm.created_at, { time: true })}</span>
                </div>
            </div>
          
          <p className="text-2xl">{current_alarm.location}</p>
          <p className="my-6">{current_alarm.description}</p>
          <p className="text-xl mb-3">Egna enheter: {filterUnits(current_alarm.units, true)}</p>
          <p>Andra enheter: {filterUnits(current_alarm.units, false)}</p>
        </div>
      );
}