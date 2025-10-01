
export interface ImageFile {
    base64: string;
    mimeType: string;
    name: string;
}

export interface EditedImageResult {
    base64: string;
    mimeType: string;
}

export type EditMode = 'prompt' | 'reference' | 'merge';
