interface IGeminiService {
    generateContent(imageBase64: string): Promise<any>;
}

export { IGeminiService };
