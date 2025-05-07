
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Upload, X, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: { id: string; url: string; name: string }[];
  onReset: () => void;
  isProcessing: boolean;
  onDownloadResults: () => void;
  hasResults: boolean;
}

const ImageUploader = ({
  onImagesSelected,
  selectedImages,
  onReset,
  isProcessing,
  onDownloadResults,
  hasResults
}: ImageUploaderProps) => {
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onImagesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onImagesSelected(filesArray);
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
          <div className="flex gap-2">
            {hasResults && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadResults}
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-1" /> Download Results
              </Button>
            )}
            {selectedImages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                disabled={isProcessing}
              >
                <X className="h-4 w-4 mr-1" /> Clear All
              </Button>
            )}
          </div>
        </div>

        {selectedImages.length === 0 ? (
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
              multiple
              className="hidden"
            />
            <Image className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              Drag & drop images here, or click to browse
            </p>
            <p className="text-xs text-gray-400 text-center">
              Supported formats: JPG, PNG, GIF, BMP
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-2">
              {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {selectedImages.map((image) => (
                <div key={image.id} className="flex items-center p-2 border-b last:border-b-0">
                  <div className="w-12 h-12 mr-3 flex-shrink-0">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 truncate text-sm">{image.name}</div>
                </div>
              ))}
            </div>
            {isProcessing && (
              <div className="bg-blue-50 rounded-md p-3 flex items-center">
                <div className="animate-pulse flex space-x-2 items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">Processing images...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t flex gap-2">
        <Button
          onClick={triggerFileInput}
          className="flex-1"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4 mr-2" /> Upload Images
        </Button>
        {selectedImages.length > 0 && (
          <Button
            onClick={() => onImagesSelected([])}
            variant="outline"
            disabled={isProcessing}
          >
            <FileText className="h-4 w-4 mr-2" /> Process Batch
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
