
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import TextResult, { TextResultItem } from "@/components/TextResult";
import { extractTextFromImage } from "@/utils/imageToText";
import { downloadAsJson } from "@/utils/downloadUtils";
import { toast } from "sonner";

interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
}

const Index = () => {
  const [textResults, setTextResults] = useState<TextResultItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [currentResult, setCurrentResult] = useState<TextResultItem | null>(null);

  // Update current result when results change
  useEffect(() => {
    if (textResults.length > 0 && !currentResult) {
      setCurrentResult(textResults[0]);
    } else if (textResults.length === 0) {
      setCurrentResult(null);
    }
  }, [textResults]);

  const handleImagesSelected = async (files: File[]) => {
    if (files.length === 0) {
      // If no files are provided, process the existing batch
      if (selectedImages.length > 0) {
        processBatch();
      }
      return;
    }

    // Create image items with unique IDs
    const newImages = files.map(file => ({
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setSelectedImages(newImages);
  };

  const processBatch = async () => {
    if (selectedImages.length === 0) return;

    try {
      setIsProcessing(true);
      setTextResults([]); // Clear previous results

      const results: TextResultItem[] = [];

      // Process each image sequentially
      for (const image of selectedImages) {
        try {
          const text = await extractTextFromImage(image.file);
          results.push({
            id: image.id,
            fileName: image.name,
            text
          });

          // Update results as they come in
          setTextResults(prev => [...prev, {
            id: image.id,
            fileName: image.name,
            text
          }]);
        } catch (error) {
          console.error(`Error processing image ${image.name}:`, error);
          // Add error result
          results.push({
            id: image.id,
            fileName: image.name,
            text: `Error processing this image: ${error.message || 'Unknown error'}`
          });
        }
      }

      toast.success(`Processed ${results.length} image${results.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast.error("Error processing batch");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    // Revoke object URLs to prevent memory leaks
    selectedImages.forEach(image => URL.revokeObjectURL(image.url));

    setSelectedImages([]);
    setTextResults([]);
    setCurrentResult(null);
  };

  const handleDownloadResults = () => {
    if (textResults.length === 0) return;

    const dataToDownload = textResults.map(result => ({
      fileName: result.fileName,
      text: result.text
    }));

    downloadAsJson(dataToDownload, 'image-text-results.json');
    toast.success("Results downloaded successfully");
  };

  const handleSelectResult = (result: TextResultItem) => {
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploader
              onImagesSelected={handleImagesSelected}
              selectedImages={selectedImages}
              onReset={handleReset}
              isProcessing={isProcessing}
              onDownloadResults={handleDownloadResults}
              hasResults={textResults.length > 0}
            />
          </div>
          <div>
            <TextResult
              results={textResults}
              isProcessing={isProcessing}
              currentResult={currentResult}
              onSelectResult={handleSelectResult}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
