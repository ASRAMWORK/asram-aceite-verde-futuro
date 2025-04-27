
import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, Link as LinkIcon, Image } from 'lucide-react';
import { uploadImage } from '@/lib/firebase';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelected: (url: string) => void;
  folder: string;
  label?: string;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected, 
  folder, 
  label = 'Imagen', 
  showPreview = true,
  previewSize = 'medium'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecciona un archivo primero");
      return;
    }

    try {
      setUploading(true);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const url = await uploadImage(selectedFile, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setImageUrl(url);
      onImageSelected(url);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      toast.error("Error al subir la imagen");
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInputValue || !urlInputValue.trim()) {
      toast.error("Por favor, introduce una URL válida");
      return;
    }

    if (!urlInputValue.startsWith('http')) {
      toast.error("Por favor, introduce una URL válida que comience con http:// o https://");
      return;
    }

    setImageUrl(urlInputValue);
    onImageSelected(urlInputValue);
    toast.success("URL de imagen agregada correctamente");
  };
  
  const getPreviewSize = () => {
    switch(previewSize) {
      case 'small': return 'h-32 w-32';
      case 'large': return 'h-80 w-auto max-w-full';
      default: return 'h-48 w-auto max-w-full';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} />
              Subir archivo
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon size={16} />
              Desde URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-upload" className="text-sm font-medium">
                {label}
              </label>
              <Input 
                id="image-upload" 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="h-2 mt-1" />
              )}
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploading} 
                className="mt-2 bg-[#ee970d] hover:bg-[#ee970d]/90 text-white"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir imagen
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-url" className="text-sm font-medium">
                URL de la imagen
              </label>
              <div className="flex gap-2">
                <Input 
                  id="image-url" 
                  type="text" 
                  placeholder="https://ejemplo.com/imagen.jpg" 
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                />
                <Button 
                  onClick={handleUrlSubmit} 
                  className="flex-shrink-0 bg-[#ee970d] hover:bg-[#ee970d]/90 text-white"
                >
                  Añadir
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {showPreview && imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <div className="border rounded p-2 flex justify-center bg-gray-50">
              <img 
                src={imageUrl} 
                alt="Vista previa" 
                className={`${getPreviewSize()} object-contain`} 
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
