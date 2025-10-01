import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { EditedImageResult, ImageFile, EditMode } from '../types';

// Assume process.env.API_KEY is configured in the environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey });

// Helper function to handle the final response processing
const processResponse = (response: GenerateContentResponse): EditedImageResult | null => {
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        
    if (imagePart && imagePart.inlineData) {
        return {
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
        };
    }
    return null;
}

export const extractImageDescription = async (image: ImageFile): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: image.base64.split(',')[1],
            mimeType: image.mimeType,
        },
    };
    const analysisPrompt = "Describe the artistic style of this image in detail. Focus on color palette, lighting, mood, composition, and any distinct visual characteristics like textures or brush strokes. The description should be a practical guide for an AI image editor to replicate the style. Be concise and descriptive.";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{text: analysisPrompt}, imagePart] },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error extracting image description:", error);
        throw new Error("Failed to extract image description from the AI model.");
    }
};


export const generateImage = async (
    images: ImageFile[],
    prompt: string,
    mode: EditMode
): Promise<EditedImageResult | null> => {
    try {
        let response: GenerateContentResponse;

        if (mode === 'merge' && images.length > 1) {
            const imagePart1 = { inlineData: { data: images[0].base64.split(',')[1], mimeType: images[0].mimeType } };
            const imagePart2 = { inlineData: { data: images[1].base64.split(',')[1], mimeType: images[1].mimeType } };
            
            const promptForMerge = `You are an expert digital artist specializing in photo compositing. Your task is to seamlessly merge the two provided images based on the user's instruction.

User's instruction: "${prompt}"

Follow the user's instruction precisely.

This is Image 1 (the primary image, often the background or main subject):`;

            const promptForImage2 = `This is Image 2 (the image containing elements to be merged into Image 1):`;

            const finalInstruction = `Now, produce a single, high-resolution, photorealistic image that combines the elements as requested by the user. The final result should be a believable composition. Output only the final merged image.`

            const parts = [
                { text: promptForMerge },
                imagePart1,
                { text: promptForImage2 },
                imagePart2,
                { text: finalInstruction }
            ];

            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

        } else {
            // --- Prompt & Reference Mode ---
            // The prompt for reference mode is now constructed on the frontend and passed in.
            const subjectImagePart = {
                inlineData: {
                    data: images[0].base64.split(',')[1],
                    mimeType: images[0].mimeType,
                },
            };
            
            const textPart = { text: prompt };
            const parts = [textPart, subjectImagePart];
            
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
        }

        return processResponse(response);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};