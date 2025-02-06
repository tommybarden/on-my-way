import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321'; // Ändra om du kör på en annan port
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Hämta från .env
const newPassword = process.env.GLOBAL_PASSWORD;

if (!supabaseServiceRoleKey) {
    console.error('❌ ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}
if (!newPassword) {
    console.error('❌ ERROR: Missing GLOBAL_PASSWORD in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateAllUserPasswords() {
    console.log('🔄 Fetching all users...');

    const {data: users, error} = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Error fetching users:', error);
        return;
    }

    if (!users || users.users.length === 0) {
        console.log('✅ No users found.');
        return;
    }

    console.log(`🔹 Found ${users.users.length} users. Updating passwords...`);

    for (const user of users.users) {
        const {id, email} = user;

        const {error} = await supabase.auth.admin.updateUserById(id, {
            password: newPassword,
        });

        if (error) {
            console.error(`❌ Failed to update password for ${email}:`, error);
        } else {
            console.log(`✅ Password updated for ${email}`);
        }
    }

    console.log('🚀 Done!');
}

updateAllUserPasswords();
