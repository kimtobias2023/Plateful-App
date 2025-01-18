import moment from 'moment';
import 'moment-timezone';

export function formatCustomDate(date) {
    // Detect the user's timezone using the browser's capabilities.
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/San_Diego'; // Default to San Diego if not detected.

    // Format the date using the detected timezone.
    let formattedDate = moment(date).tz(detectedTimezone).format('MMM D [at] h:mm a');
    return formattedDate.replace(' pm', ' p.m.').replace(' am', ' a.m.');
}

export function formatCustomDateShort(date) {
    // Detect the user's timezone using the browser's capabilities.
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/San_Diego'; // Default to San Diego if not detected.

    // Format the date using the detected timezone.
    return moment(date).tz(detectedTimezone).format('ddd, MMM D');
}
