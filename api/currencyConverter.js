export default async function handler(request, response) {
    const { translateFrom } = request.query;
    if (!translateFrom) {
        return response.status(400).json({
            error: 'translateFrom is required'
        });
    };
    try {
        const currencyConverterUrl = `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_CONVERTER_API_KEY}/latest/${translateFrom}`;
        const currencyConverterResponse = await fetch(currencyConverterUrl);
        const currencyConverterData = await currencyConverterResponse.json();
        response.status(200).json(currencyConverterData);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    };
};