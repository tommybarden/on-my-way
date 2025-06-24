(function () {
    'use strict';

    const ENDPOINT_URL = '/api/report.json';

    // Format date/time for form
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = date.toTimeString().substr(0, 5); // HH:MM
        return { date: dateStr, time: timeStr };
    }

    function fillForm(data) {
        const alarm = data.alarm;
        const units = data.units;
        const dateTime = formatDateTime(alarm.created_at);

        jQuery('[name="field_alarmreport_department"]').val('jomala_fbk');
        jQuery('[name="field_alarmreport_type"]').val('411');
        jQuery('[name="field_alarmreport_incident[0][value]"]').val(alarm.description || '');
        jQuery('[name="field_alarmreport_address[0][value]"]').val(alarm.location || '');
        jQuery('[name="field_alarmreport_date[0][value][date]"]').val(dateTime.date);
        jQuery('[name="field_alarmreport_date[0][value][time]"]').val(dateTime.time);
        jQuery('[name="field_alarmreport_unitmgr[0][value]"]').val('');
        jQuery('[name="field_alarmreport_description[0][value]"]').val(alarm.description || '');
        jQuery('[name="field_alarmreport_author_name[0][value]"]').val('Automatisk rapport');
        jQuery('[name="field_alarmreport_author_mail[0][value]"]').val('station@jfbk.ax');

        alert('Formulär ifyllt med alarmdata');
    }

    // Main function
    fetch(ENDPOINT_URL, {
        credentials: "include",
        method: "GET"
    })
        .then(response => response.json())
        .then(data => fillForm(data))
        .catch(error => {
            console.error('Error:', error);
            alert('Kunde inte hämta alarmdata');
        });

})();