function formatDate(date, showDate, showTime) {
    let formattedDate = "";

    if (showDate) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        formattedDate += `${year}-${month}-${day}`;
    }

    if (showTime) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        formattedDate += `${showDate ? " " : ""}${hours}:${minutes}`;
    }

    return formattedDate;
}

function githubRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffhours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays === 0) return `${diffhours} hours ago`;
    else if (diffDays === 1) return "Yesterday";
    else if (diffDays < 30) return `${diffDays} days ago`;

    return formatDate(date, true, false);
}