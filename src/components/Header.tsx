
import { FileText, Camera } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500 h-6 w-6" />
            <h1 className="text-xl font-bold">ImageText</h1>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Camera className="h-4 w-4" />
            <span>Image to Text Converter</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
