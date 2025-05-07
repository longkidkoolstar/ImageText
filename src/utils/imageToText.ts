
import { createWorker } from 'tesseract.js';
import { toast } from "sonner";

/**
 * Extract text from an image using Tesseract.js OCR library
 * @param imageFile The image file to process
 * @returns Promise containing the extracted text
 */
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    toast.info("Analyzing image...", {
      duration: 2000,
    });

    // Create a worker for OCR processing
    const worker = await createWorker();
    
    // Initialize the worker with English language
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Read the image file and convert to URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Recognize text in the image
    const { data } = await worker.recognize(imageUrl);
    
    // Terminate the worker to free up resources
    await worker.terminate();
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrl);
    
    // If no text was found, show a message
    if (!data.text || data.text.trim() === '') {
      toast.warning("No text detected in the image");
      return "No text detected in this image.";
    }
    
    toast.success("Text extracted successfully!");
    return data.text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    toast.error("Failed to extract text from image");
    return "Error extracting text. Please try again.";
  }
};
