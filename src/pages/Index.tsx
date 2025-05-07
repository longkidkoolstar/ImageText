
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import TextResult from "@/components/TextResult";
import { extractTextFromImage } from "@/utils/imageToText";

const Index = () => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageProcess = async (imageFile: File) => {
    try {
      setIsProcessing(true);
      setSelectedImage(URL.createObjectURL(imageFile));
      const text = await extractTextFromImage(imageFile);
      setExtractedText(text);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setExtractedText("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploader 
              onImageSelected={handleImageProcess}
              selectedImage={selectedImage}
              onReset={handleReset}
              isProcessing={isProcessing}
            />
          </div>
          <div>
            <TextResult text={extractedText} isProcessing={isProcessing} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
