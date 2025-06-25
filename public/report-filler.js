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

    // Add units and personnel
    function addUnitsAndPersonnel(units) {
        const unitKeys = Object.keys(units).filter(key =>
            units[key].personnel && units[key].personnel.length > 0
        );

        if (unitKeys.length === 0) return;

        let unitIndex = 0;

        function processNextUnit() {
            if (unitIndex >= unitKeys.length) {
                console.log('All units and personnel added');
                return;
            }

            const unitKey = unitKeys[unitIndex];
            const unit = units[unitKey];
            const personnel = unit.personnel;

            // Add unit if not the first one (first unit field already exists)
            if (unitIndex > 0) {
                jQuery('input[name="field_alarmreport_crew_ref_crew_add_more"]').trigger('mousedown');

                // Wait for unit to be added before continuing
                setTimeout(() => {
                    fillUnitData(unitKey, personnel, unitIndex);
                }, 500);
            } else {
                fillUnitData(unitKey, personnel, unitIndex);
            }
        }

        function fillUnitData(unitKey, personnel, unitIdx) {
            // Set unit name
            jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_unit][0][value]"]`).val(unitKey);

            // Add personnel (first person field already exists)
            let personIndex = 0;

            function addNextPerson() {
                if (personIndex >= personnel.length) {
                    unitIndex++;
                    setTimeout(processNextUnit, 300);
                    return;
                }

                const person = personnel[personIndex];

                // Add person if not the first one
                if (personIndex > 0) {
                    jQuery(`input[name="field_alarmreport_crew_ref_${unitIdx}_subform_field_crew_person_ref_person_add_more"]`).trigger('mousedown');

                    // Wait for person field to be added
                    setTimeout(() => {
                        fillPersonData(person, unitIdx, personIndex);
                    }, 300);
                } else {
                    fillPersonData(person, unitIdx, personIndex);
                }
            }

            function fillPersonData(person, unitIdx, personIdx) {
                // Set person name
                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_name][0][value]"]`).val(person.name);
                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_nr][0][value]"]`).val(person.number);


                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_effort][0][value]"]`).val(0);
                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_watch][0][value]"]`).val(0);
                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_restore][0][value]"]`).val(0);

                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_smokedive][0][value]"]`).val(0);
                jQuery(`[name="field_alarmreport_crew_ref[${unitIdx}][subform][field_crew_person_ref][${personIdx}][subform][field_person_selfprotect][0][value]"]`).val(0);

                personIndex++;
                setTimeout(addNextPerson, 200);
            }

            addNextPerson();
        }

        processNextUnit();
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

        setTimeout(() => {
            addUnitsAndPersonnel(units);
        }, 1000);

        alert('Klart! Vänligen fyll i de fält som saknas.');

        jQuery('[name="field_alarmreport_unitmgr[0][value]"]').focus();
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