const { VertexAI } = require('@google-cloud/vertexai');
import { IGeminiService } from './IGeminiService';

class GeminiService implements IGeminiService {
    private vertexAIClient: any;
    private generativeModel: any;

    // Constructor
  constructor() {
    this.vertexAIClient = new VertexAI({ project: 'vision-430712', location: 'us-central1' });
    this.generativeModel = this.vertexAIClient.preview.getGenerativeModel({
        model: 'gemini-1.5-flash-001',
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
  }

    async generateContent(imageBase64: string): Promise<any> {
        const image1 = {
            inlineData: {
                mimeType: 'image/png',
                data: imageBase64,
            },
        };

        const req = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        image1,
                        { text: 'Extract the mahjong combinations and suits and output them in JSON.' },
                    ],
                },
            ],
        };

        const streamingResp = await this.generativeModel.generateContentStream(req);

        let bestResult = '';

        // Loop through the streaming response and break on the first valid result
        for await (const item of streamingResp.stream) {
            if (item?.candidates?.[0]?.content?.parts?.[0]?.text) {
                bestResult = item.candidates[0].content.parts[0].text;
                break;  // Stop at the first valid result
            }
        }

        // Attempt to parse the result
        let jsonResult;
        try {
            console.log('Raw Response:', bestResult);
            jsonResult = JSON.parse(bestResult);  // Parse the first valid result into JSON
        } catch (error) {
            console.error('Error parsing JSON:', error);
            jsonResult = { error: 'Failed to parse JSON result' };  // Return an error object if parsing fails
        }

        return jsonResult;  // Return the parsed JSON or error object
    }

}

export { GeminiService };