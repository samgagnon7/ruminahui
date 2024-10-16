import { MahjongHand } from "../models/MahjongHand";

interface IGeminiService {
    generateContent(imageBase64: string): Promise<MahjongHand>;

    trimResponseToJson(promptResponse: string): string;
}

export type { IGeminiService };