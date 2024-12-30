export default async function handler(request, response){
    const { playlistId, pageToken = "" } = request.query;
    if(!playlistId){
        return response.status(400).json({
            error: "playlistId is required"
        });
    };
    try{
        const youtubeUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.MUSIC_PLAYER_API_KEY}&pageToken=${pageToken}`;
        const youtubeResponse = await fetch(youtubeUrl, {
            headers: {
                'Referer': 'https://widget-hell.vercel.app/',
            }
        });        
        const youtubeData = await youtubeResponse.json();
        response.status(200).json(youtubeData);
    }catch(err){
        console.error(err);
        response.status(500).json({ error: err.message });
    };
};