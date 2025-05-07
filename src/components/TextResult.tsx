
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, TextCursor } from "lucide-react";
import { toast } from "sonner";

interface TextResultProps {
  text: string;
  isProcessing: boolean;
}

const TextResult = ({ text, isProcessing }: TextResultProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Extracted Text</h2>
          {text && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={isProcessing || !text}
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
        <div className="flex-grow relative min-h-[260px]">
          {isProcessing ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : text ? (
            <div className="bg-gray-50 rounded-md p-4 h-full overflow-y-auto border">
              <pre className="whitespace-pre-wrap font-sans text-sm">{text}</pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-col text-center text-gray-400">
              <TextCursor className="h-12 w-12 mb-2" />
              <p>Upload an image to extract text</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TextResult;
