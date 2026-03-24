export const formatTo12Hour = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const h = Number(hours);

    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
};

// Show first 3 letters of day
export const formatDay = (day) => day?.slice(0, 3);