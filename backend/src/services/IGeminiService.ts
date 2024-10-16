import { MahjongHand } from "../models/MahjongHand";

interface IGeminiService {
    generateContent(imageBase64: string): Promise<MahjongHand>;
}

export type { IGeminiService };