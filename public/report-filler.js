(function () {
    'use strict';

    const scriptSrc = new URL(document.currentScript.src);
    const urlParams = scriptSrc.searchParams;
    const urlDomain = scriptSrc.origin;
    const apiKey = urlParams.get('key');

    const ENDPOINT_URL = urlDomain + '/api/report.json';

    // Format date/time for form
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = date.toTimeString().substr(0, 5); // HH:MM
        return {date: dateStr, time: timeStr};
    }

    // Determine alarm type based on description
    function getAlarmType(description) {
        const desc = description.toLowerCase();

        // Check for Räddning types first (highest priority)
        if (desc.includes('assistans')) return '430'; // Räddning - Assistans
        if (desc.includes('fastklämd')) return '431'; // Räddning - Fastklämd
        if (desc.includes('dykalarm')) return '432'; // Räddning - Dykalarm
        if (desc.includes('kemalarm')) return '433'; // Räddning - Kemalarm

        // Check for Personsökaralarm types
        if (desc.includes('hissalarm')) return '401'; // Personsökaralarm - Hissalarm
        if (desc.includes('djurräddning') && desc.includes('personsökar')) return '402'; // Personsökaralarm - Djurräddning

        // Check for Grundalarm types (check before Litet Alarm)
        if (desc.includes('grundalarm') || desc.includes('större') || desc.includes('allvarlig')) {
            if (desc.includes('automatalarm')) return '421'; // Grundalarm - Automatalarm
            if (desc.includes('byggnadsbrand')) return '422'; // Grundalarm - Byggnadsbrand
            if (desc.includes('markbrand')) return '423'; // Grundalarm - Markbrand
            if (desc.includes('fordonsbrand')) return '424'; // Grundalarm - Fordonsbrand
            if (desc.includes('båtbrand') || desc.includes('fartygsbrand')) return '425'; // Grundalarm - Båt-/Fartygsbrand
            return '420'; // Grundalarm (general)
        }

        // Check for Litet Alarm types
        if (desc.includes('automatalarm')) return '411'; // Litet Alarm - Automatalarm
        if (desc.includes('byggnadsbrand')) return '412'; // Litet Alarm - Byggnadsbrand
        if (desc.includes('markbrand')) return '413'; // Litet Alarm - Markbrand
        if (desc.includes('fordonsbrand')) return '414'; // Litet Alarm - Fordonsbrand
        if (desc.includes('båtbrand')) return '415'; // Litet Alarm - Båtbrand
        if (desc.includes('soteld')) return '417'; // Litet Alarm - Soteld
        if (desc.includes('djurräddning')) return '418'; // Litet Alarm - Djurräddning
        if (desc.includes('kontroll')) return '419'; // Litet Alarm - Kontrolluppdrag

        // Special types
        if (desc.includes('sjukvård')) return 'SJUKVARD'; // Sjukvård - Första insats
        if (desc.includes('förstärkning')) return '440'; // Förstärkningsalarm
        if (desc.includes('beredskap')) return '441'; // Beredskapsalarm

        // Check for general Personsökaralarm
        if (desc.includes('personsökar')) return '400'; // Personsökaralarm

        // Default fallback - Litet Alarm general
        return 'OVRIGT'; // Litet Alarm
    }

    async function addUnitsAndPersonnel(units) {
        // Helper function to wait
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Process units with personnel using forEach with async
        await Promise.all(
            Object.entries(units).map(async ([unitKey, unit], unitIndex) => {
                // Always add unit (no unit fields exist initially)
                console.log('Adding units', unitKey);
                jQuery('input[name="field_alarmreport_crew_ref_crew_add_more"]').trigger('mousedown');
                await wait(1000);

                // Set unit name
                jQuery(`[name="field_alarmreport_crew_ref[${unitIndex}][subform][field_crew_unit][0][value]"]`).val(unitKey);

                // Add all personnel using map
                if (unit.personnel && unit.personnel.length > 0) {
                    await Promise.all(
                        unit.personnel.map(async (person, personIndex) => {
                            // Always add person field
                            console.log('Adding person', person.name);
                            jQuery(`input[name="field_alarmreport_crew_ref_${unitIndex}_subform_field_crew_person_ref_person_add_more"]`).trigger('mousedown');
                            await wait(1000);

                            // Fill person data
                            jQuery(`[name="field_alarmreport_crew_ref[${unitIndex}][subform][field_crew_person_ref][${personIndex}][subform][field_person_name][0][value]"]`).val(person.name);
                            jQuery(`[name="field_alarmreport_crew_ref[${unitIndex}][subform][field_crew_person_ref][${personIndex}][subform][field_person_nr][0][value]"]`).val(person.number);

                            // Set default values for time fields
                            const timeFields = [
                                'field_person_effort',
                                'field_person_watch',
                                'field_person_restore',
                                'field_person_smokedive',
                                'field_person_selfprotect'
                            ];

                            timeFields.forEach(field => {
                                jQuery(`[name="field_alarmreport_crew_ref[${unitIndex}][subform][field_crew_person_ref][${personIndex}][subform][${field}][0][value]"]`).val(0);
                            });
                        })
                    );
                }
            })
        );

        console.log('All units and personnel added');
    }

    function fillForm(data) {
        const alarm = data.alarm;
        const units = data.units;
        const dateTime = formatDateTime(alarm.created_at);

        if (alarm?.response_time) {
            alarm.description += '\n\nUtryckningstid: ' + alarm?.response_time + ' minuter'
        }

        jQuery('[name="field_alarmreport_department"]').val('jomala_fbk');
        jQuery('[name="field_alarmreport_type"]').val(getAlarmType(alarm.description || ''));
        jQuery('[name="field_alarmreport_incident[0][value]"]').val(alarm.description || '');
        jQuery('[name="field_alarmreport_address[0][value]"]').val(alarm.location || '');
        jQuery('[name="field_alarmreport_date[0][value][date]"]').val(dateTime.date);
        jQuery('[name="field_alarmreport_date[0][value][time]"]').val(dateTime.time);
        jQuery('[name="field_alarmreport_unitmgr[0][value]"]').val('');
        jQuery('[name="field_alarmreport_description[0][value]"]').val(alarm.description || '');
        jQuery('[name="field_alarmreport_author_name[0][value]"]').val('');
        jQuery('[name="field_alarmreport_author_mail[0][value]"]').val('stationen@jfbk.ax');

        addUnitsAndPersonnel(units).then(() => {
            alert('Klart! Vänligen fyll i de fält som saknas.');
            jQuery('[name="field_alarmreport_unitmgr[0][value]"]').focus();
        })

    }

    // Main function
    fetch(ENDPOINT_URL, {
        headers: {
            'x-api-key': apiKey
        }
    })
        .then(response => response.json())
        .then(data => fillForm(data))
        .catch(error => {
            console.error('Error:', error);
            alert('Kunde inte hämta alarmdata');
        });

})();