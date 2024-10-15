import { expect } from 'chai';
import { IGeminiService } from '../../services/IGeminiService';
import { GeminiService } from '../../services/GeminiService';
import fs from 'fs';

let geminiService: IGeminiService;

beforeEach(() => {
  geminiService = new GeminiService();
});


describe('gemini service', () => {
  it('generates content correctly from image', async () => {
    const imageBase64 = fs.readFileSync('../test-files/tests/test-files/mahjong-base64-jpeg.txt', 'utf-8');
    const result = await new GeminiService().generateContent(imageBase64);
    console.log(result);
    expect(result).to.be.an('object');
  });
});
