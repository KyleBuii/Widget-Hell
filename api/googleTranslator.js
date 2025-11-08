export default async function handler(request, response) {
    try {
        const { data } = request.query;

        if (!data) {
            return response.status(400).json({
                error: 'data is required'
            });
        };
        
        const { text, from, to } = JSON.parse(data);
        const formatedBody = new URLSearchParams({ text, from, to });
        
        const options = {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': process.env.VITE_TRANSLATOR_API_KEY,
                'X-RapidAPI-Host': process.env.VITE_TRANSLATOR_API_HOST,
            },
            body: formatedBody
        };
        
        const apiResponse = await fetch('https://translate281.p.rapidapi.com/', options);
        const apiData = await apiResponse.json();
        
        response.status(200).json(apiData);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
};