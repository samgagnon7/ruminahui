interface IGeminiService {
    generateContent(imageBase64: string): Promise<MahjongHand>;
}

export { IGeminiService };
