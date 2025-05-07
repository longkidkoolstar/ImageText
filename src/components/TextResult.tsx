
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, TextCursor, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export interface TextResultItem {
  id: string;
  fileName: string;
  text: string;
}

interface TextResultProps {
  results: TextResultItem[];
  isProcessing: boolean;
  currentResult: TextResultItem | null;
  onSelectResult: (result: TextResultItem) => void;
}

const TextResult = ({ results, isProcessing, currentResult, onSelectResult }: TextResultProps) => {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const copyToClipboard = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult.text);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Extracted Text</h2>
            {results.length > 0 && (
              <div className="ml-2 text-sm text-gray-500">
                ({results.length} result{results.length !== 1 ? 's' : ''})
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {currentResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={isProcessing || !currentResult}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {results.length > 1 && (
          <div className="mb-4 relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {currentResult ? currentResult.fileName : 'Select a result'}
              </span>
              {isDropdownOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      currentResult?.id === result.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      onSelectResult(result);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {result.fileName}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-grow relative min-h-[260px]">
          {isProcessing ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : currentResult ? (
            <div className="bg-gray-50 rounded-md p-4 h-full overflow-y-auto border">
              <pre className="whitespace-pre-wrap font-sans text-sm">{currentResult.text}</pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-center text-gray-400">
              <TextCursor className="h-12 w-12 mb-2" />
              <p>Upload images to extract text</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TextResult;
