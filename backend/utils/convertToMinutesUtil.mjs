function convertToMinutesUtil(timeString) {
    // Define patterns for hours and minutes
    hourPattern = "(\d+)\s*(hr|hours|hour)"
    minutePattern = "(\d+)\s*(min|mins|minutes|minute)"

    // Search for hour and minute patterns in the timeString
    hoursMatch = search(hourPattern, timeString)
    minutesMatch = search(minutePattern, timeString)

    // Initialize total minutes
    totalMinutes = 0

    // Convert and add hours to total minutes if present
    if (hoursMatch is found) {
        totalMinutes += parseInt(hoursMatch[1]) * 60
    }

    // Add minutes to total minutes if present
    if (minutesMatch is found) {
        totalMinutes += parseInt(minutesMatch[1])
    }

    return totalMinutes
}
