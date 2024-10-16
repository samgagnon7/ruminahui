import { GeminiService } from '../../services/GeminiService.js';
import fs from 'fs';
import { MahjongHandValidator } from '../../validators/MahjongHandValidator.js';
import { expect } from 'chai';

describe('gemini service', () => {
  it('generates content correctly from image', async () => {
    const imageBase64 = fs.readFileSync('/Users/samgamji/Code/ruminahui/backend/src/tests/test-files/mahjong-base64-jpeg.txt', 'utf-8');
    const result = await new GeminiService(new MahjongHandValidator()).generateContent(imageBase64);
    console.log(result);
    expect(result).to.be.an('object');
  });
});