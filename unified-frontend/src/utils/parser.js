const parseRecommendations = async (text, fetchImageUrl) => {
    const recommendations = [];
    const lines = text.split('\n');
    let currentPOI = null;

    if (!text || text.trim() === "") {
        console.warn("Text content is empty.");
        return [];
    }

    for (const line of lines) {
        const match = line.match(/^\d+\.\s\*\*(.+?)\*\*\:\s(.+)/);
        if (match) {
            if (currentPOI && currentPOI.name && currentPOI.description) {
                recommendations.push(currentPOI);
            }
            const placeName = match[1];
            const imageUrl = await fetchImageUrl(placeName);
            if (!imageUrl) {
                console.warn("Failed to fetch image URL for:", placeName);
            }
            currentPOI = {
                name: placeName,
                description: match[2],
                imageUrl: imageUrl
            };
        } else if (currentPOI) {
            currentPOI.description += ' ' + line;
        }
    }

    if (currentPOI && currentPOI.name && currentPOI.description) {
        recommendations.push(currentPOI);
    }

    console.log("Final parsed recommendations:", recommendations); // 调试输出
    return recommendations;
};


const parseContent = (responseBody) => {
    const dayRegex = /-\s\*\*Day\s(\d+):\s(.*?)\*\*\n(.*?)(?=\n- \*\*Day|\n\n- \*\*Day|\n\*\*Day|$)/gs;
    const activityRegex = /-\s(Morning|Late Morning|Afternoon|Evening):\s(.*?)\n/gs;

    let guide = [];

    let dayMatch;
    while ((dayMatch = dayRegex.exec(responseBody))) {
        let dayNumber = dayMatch[1];
        let dayTheme = dayMatch[2];
        let activities = dayMatch[3];

        let dayActivities = [];
        let activityMatch;
        while ((activityMatch = activityRegex.exec(activities))) {
            let time = activityMatch[1];
            let description = activityMatch[2].trim();

            dayActivities.push({
                time,
                description
            });
        }

        guide.push({
            day: `Day ${dayNumber}: ${dayTheme}`,
            activities: dayActivities
        });
    }

    return guide;
};

export { parseRecommendations, parseContent };
