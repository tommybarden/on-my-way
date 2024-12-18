import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  
let { data: Alarms, error } = await supabase
.from('Alarms')
.select('*')
        

  return <pre>{JSON.stringify(Alarms, null, 2)}</pre>
}