import { NextResponse } from "next/server";
import { getLatestAlarm } from "@/services/server/alarms";
import { getAllUsers, getCurrentUser } from "@/services/server/users";
import { getConfirmed } from "@/services/client/alarms";
import { getStartedUnits } from "@/services/client/units";
import { User } from "@/utils/types";

interface Personnel {
    name: string;
    number: string;
}

interface Unit {
    left: Date | null;
    personnel: Personnel[];
}

interface GroupedUnits {
    [key: string]: Unit;
}

export async function GET() {

    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const latest_alarm = await getLatestAlarm();
    if (!latest_alarm) {
        return NextResponse.json({ error: "No alarm found" }, { status: 500 });
    }

    const users: { [key: string]: User } = await getAllUsers();
    const confirmed = await getConfirmed(latest_alarm.id);
    const units = (await getStartedUnits(latest_alarm.id)).map(unit => ({
        unit: unit.unit,
        left: new Date(unit.created_at)
    }));

    // Sort units by departure time
    const sortedUnits = units.sort((a, b) => a.left.getTime() - b.left.getTime());

    // Create grouped structure
    const groupedUnits: GroupedUnits = {};

    // Initialize each unit
    sortedUnits.forEach(unit => {
        groupedUnits[unit.unit] = {
            left: unit.left,
            personnel: []
        };
    });

    // Initialize "övriga" for people who arrived after all units left
    groupedUnits["Station"] = {
        left: null,
        personnel: []
    };

    // Initialize "egen bil" for people with negative minutes (going directly to scene)
    groupedUnits["Egen bil"] = {
        left: null,
        personnel: []
    };

    // Process each confirmed person
    confirmed.forEach(confirmation => {
        const person = users[confirmation.created_by];

        if (person) {
            const confirmationData: Personnel = {
                name: `${person.first_name} ${person.last_name}`,
                number: person.number.toString()
            };

            // Check if person is going directly to scene (negative minutes)
            if (confirmation.minutes < 0) {
                groupedUnits["Egen bil"].personnel.push(confirmationData);
                return;
            }

            // Calculate arrival time for positive minutes
            const arrivalTime = new Date(new Date(confirmation.created_at).getTime() + confirmation.minutes * 60000);

            // Find which unit they caught
            let assignedToUnit = false;

            for (const unit of sortedUnits) {
                if (arrivalTime <= unit.left) {
                    groupedUnits[unit.unit].personnel.push(confirmationData);
                    assignedToUnit = true;
                    break;
                }
            }

            // If they didn't catch any unit, put them in "övriga"
            if (!assignedToUnit) {
                groupedUnits["Station"].personnel.push(confirmationData);
            }
        }
    });

    // Remove units with no personnel
    Object.keys(groupedUnits).forEach(unitKey => {
        if (groupedUnits[unitKey].personnel.length === 0) {
            delete groupedUnits[unitKey];
        }
    });

    // Calculate alarm duration in hours
    const alarmStartTime = new Date(latest_alarm.created_at);
    const currentTime = new Date();
    const durationMs = currentTime.getTime() - alarmStartTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));

    // Calculate response time to first unit in minutes
    let responseTime = null;
    if (sortedUnits.length > 0) {
        const firstUnitLeft = sortedUnits[0].left;
        const responseMs = firstUnitLeft.getTime() - alarmStartTime.getTime();
        responseTime = Math.floor(responseMs / (1000 * 60));
    }


    return NextResponse.json({
        alarm: {
            ...latest_alarm,
            duration: durationHours,
            response_time: responseTime
        },
        units: groupedUnits
    }, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'https://www.raddning.ax',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        }
    });
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'https://www.raddning.ax',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}