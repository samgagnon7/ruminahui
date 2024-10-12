const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'vision-430712', location: 'us-central1' });
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 1,
        'topP': 0.95,
    },
    responseSchema: {
        type: 'json_object',
        properties: {
            tiles: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        suit: { 
                            type: 'string',
                            enum: ['bamboo', 'character', 'dots']
                        },
                        value: {
                            type: 'string',
                            enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                        }
                    },
                    required: ['suit', 'value']
                },
                minItems: 14,
                maxItems: 14
            }
        },
        required: ['tiles']
    },
    safetySettings: [
        {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        }
    ],
});

interface GenerateContentInput {
  imageBase64: string;
}

async function generateContent({ imageBase64 }: GenerateContentInput) {
    const image1 = {
        inlineData: {
            mimeType: 'image/png',
            data: imageBase64,
        }
    };

    const req = {
        contents: [
            { role: 'user', parts: [image1, { text: `Extract the mahjong combinations and suits and output them in JSON.` }] }
        ],
    };

    const streamingResp = await generativeModel.generateContentStream(req);

    let bestResult = '';
    for await (const item of streamingResp.stream) {
        if (item.candidates && item.candidates[0] && item.candidates[0].content) {
            bestResult = item.candidates[0].content.parts[0].text;
        }
    }

    let jsonResult;
    try {
        console.log(bestResult);
        jsonResult = JSON.parse(bestResult);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        jsonResult = { error: 'Failed to parse JSON result' };
    }

    return jsonResult;
}

module.exports = {
    generateContent,
};
