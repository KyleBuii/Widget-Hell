function parseDuration(iso) {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || '0', 10);
    const minutes = parseInt(match?.[2] || '0', 10);
    const seconds = parseInt(match?.[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
};

export default async function handler(request, response) {
    const { playlistId, pageToken = '' } = request.query;

    if (!playlistId) {
        return response.status(400).json({
            error: 'playlistId is required'
        });
    };

    try {
        const youtubeUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.MUSIC_PLAYER_API_KEY}&pageToken=${pageToken}`;
        const youtubeResponse = await fetch(youtubeUrl, {
            headers: {
                'Referer': 'https://widget-hell.vercel.app/',
            }
        });        
        const youtubeData = await youtubeResponse.json();

        const videoIds = youtubeData.items
            .map((item) => item.snippet.resourceId.videoId)
            .join(',');
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${process.env.MUSIC_PLAYER_API_KEY}&pageToken=${pageToken}`;
        const detailResponse = await fetch(detailsUrl, {
            headers: {
                'Referer': 'https://widget-hell.vercel.app/',
            }
        });
        const detailData = await detailResponse.json();

        const youtubeDataDuration = youtubeData.items
            .map((item, index) => {
                const durationRaw = detailData.items?.[index]?.contentDetails?.duration;
                const duration = durationRaw ? parseDuration(durationRaw) : 0;

                return {
                    ...item,
                    duration
                };
            });

        response.status(200).json(youtubeDataDuration);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    };
};