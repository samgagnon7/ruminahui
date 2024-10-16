import { GeminiService } from '../services/GeminiService';
import { MahjongHandValidator } from '../validators/MahjongHandValidator';

class ImageController {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService(new MahjongHandValidator());
  }

  public postImage = async (req: any, res: any) => {
    const imageBase64 = req.body.image;
    try {
      console.log("received image");
      const mahjongHand = await this.geminiService.generateContent(imageBase64);
      
      if (mahjongHand) {
        res.json({ mahjongHand });
      } else {
        res.status(400).json({ error: 'Invalid Mahjong hand' });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default new ImageController();