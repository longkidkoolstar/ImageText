
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: string | null;
  onReset: () => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onImageSelected, selectedImage, onReset, isProcessing }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Image Input</h2>
          {selectedImage && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
        
        {!selectedImage ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 h-64 transition-colors",
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Image className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              Drag & drop an image here, or click to browse
            </p>
            <p className="text-xs text-gray-400 text-center">
              Supported formats: JPG, PNG, GIF, BMP
            </p>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden h-64">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-full object-contain"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-md p-4">
                  <div className="animate-pulse flex space-x-2 items-center">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t">
        <Button 
          onClick={triggerFileInput} 
          className="w-full"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" /> Upload Image
        </Button>
      </div>
    </Card>
  );
};

export default ImageUploader;
