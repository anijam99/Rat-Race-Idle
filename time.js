export const time = {
    totalSeconds: 0,
    isDay: true,
    dayDuration: 300, // 5 minutes
    nightDuration: 300, // 5 minutes
};

export function updateTime(addEvent) {
    time.totalSeconds++;
    const cyclePosition = time.totalSeconds % (time.dayDuration + time.nightDuration);

    const wasDay = time.isDay;
    time.isDay = cyclePosition < time.dayDuration;

    if (wasDay && !time.isDay) {
        addEvent("Night has fallen. Be careful!");
    } else if (!wasDay && time.isDay) {
        addEvent("The sun is rising.");
    }
}