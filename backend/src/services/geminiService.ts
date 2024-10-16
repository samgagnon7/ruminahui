import { VertexAI } from '@google-cloud/vertexai';
import { IGeminiService } from './IGeminiService';
import { IMahjongHandValidator } from '../validators/IMahjongHandValidator';
import { MahjongHand } from '../models/MahjongHand';
import { HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

class GeminiService implements IGeminiService {
    private vertexAIClient;
    private generativeModel;
    private mahjongHandValidator: IMahjongHandValidator;

    constructor(mahjongHandValidator: IMahjongHandValidator) {
        this.vertexAIClient = new VertexAI({ project: 'vision-430712', location: 'us-central1' });
        this.generativeModel = this.vertexAIClient.preview.getGenerativeModel({
        model: 'gemini-1.5-flash-001',
        generationConfig: {
            'maxOutputTokens': 8192,
            'temperature': 1,
            'topP': 0.95,
        },
        // @ts-ignore
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
                                enum: ['bamboo', 'character', 'dots', 'honors']
                            },
                            value: {
                                type: 'string',
                                enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                            }
                        },
                        required: ['suit', 'value']
                    },
                    minItems: 13,
                    maxItems: 14
                }
            },
            required: ['tiles']
        },
        safetySettings: [
            {   
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            }
        ],
    });
    this.mahjongHandValidator = mahjongHandValidator;
  }

    async generateContent(imageBase64: string): Promise<MahjongHand> {
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

        for await (const item of streamingResp.stream) {
            if (item?.candidates?.[0]?.content?.parts?.[0]?.text) {
                bestResult = item.candidates[0].content.parts[0].text;
                break;
            }
        }

        let jsonResult;
        try {
            console.log('Raw Response:', bestResult);
            jsonResult = JSON.parse(bestResult);  // Parse the first valid result into JSON
        } catch (error) {
            console.error('Error parsing JSON:', error);
            jsonResult = { error: 'Failed to parse JSON result' };  // Return an error object if parsing fails
        }

        if (this.mahjongHandValidator.validateHand(jsonResult)) {
            return jsonResult;
        } else {
            console.log('Invalid hand');
            throw new Error('Invalid hand');
        }

    }

}

export { GeminiService };