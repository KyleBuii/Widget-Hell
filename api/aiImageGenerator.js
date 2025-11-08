import { InferenceClient } from '@huggingface/inference';


const hf = new InferenceClient(process.env.VITE_AI_IMAGE_GENERATOR_ACCESS_TOKEN);

export default async function handler(request, response) {
    const { randomNumber, prompt, model, negative } = request.query;

    if (!model) {
        return response.status(400).json({
            error: 'model is required'
        });
    };

    try {
        const result = await hf.textToImage({
            provider: 'hf-inference',
            model: model,
            inputs: `${prompt} ${randomNumber}`,
            parameters: {
                negative_prompt: negative
            }
        });
        const arrayBuffer = await result.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        response.status(200).send(buffer);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
};