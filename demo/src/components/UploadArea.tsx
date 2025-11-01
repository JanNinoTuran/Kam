import { useState, useRef, type DragEvent, type ChangeEvent, type FC } from 'react';

interface UploadAreaProps {
  onFilesUploaded?: (files: File[]) => void;
  /** If provided, the first selected file will be passed to this callback and the modal can be opened for captioning */
  onSelectForModal?: (file: File) => void;
}

const UploadArea: FC<UploadAreaProps> = ({ onFilesUploaded, onSelectForModal }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (onSelectForModal && files.length > 0) {
      onSelectForModal(files[0])
      if (files.length > 1 && onFilesUploaded) onFilesUploaded(files.slice(1))
    } else {
      if (onFilesUploaded) onFilesUploaded(files)
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (onSelectForModal && files.length > 0) {
      onSelectForModal(files[0])
      if (files.length > 1 && onFilesUploaded) onFilesUploaded(files.slice(1))
    } else {
      if (onFilesUploaded) onFilesUploaded(files)
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        className={`upload-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver ? 'dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <p className="text-lg mb-2">Drag & drop images here or click to select</p>
        <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
      </div>
    </div>
  );
};

export default UploadArea;
