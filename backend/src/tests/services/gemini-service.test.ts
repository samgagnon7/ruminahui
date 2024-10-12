import { expect } from 'chai';
import { generateContent } from '../../services/gemini-service';
import fs from 'fs';

describe('gemini service', () => {
  it('generates content correctly from image', async () => {
    const imageBase64 = fs.readFileSync('/Users/samgamji/Code/ruminahui/backend/src/tests/test-files/mahjong-base64-jpeg.txt', 'utf-8');
    const result = await generateContent(imageBase64);
    console.log(result);
    expect(result).to.be.an('object');
  });
});