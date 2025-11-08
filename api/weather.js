export default async function handler(request, response) {
    const { location } = request.query;

    if (!location) {
        return response.status(400).json({
            error: 'location is required'
        });
    };

    try {
        const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.VITE_WEATHER_API_KEY,
                'X-RapidAPI-Host': process.env.VITE_WEATHER_API_HOST,
            }
        };

        const apiResponse = await fetch(url, options);
        const apiData = await apiResponse.json();
        
        response.status(200).json(apiData);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
};