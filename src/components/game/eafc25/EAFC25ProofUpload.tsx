
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, Check, X, Camera } from "lucide-react";

interface EAFC25ProofUploadProps {
  onSubmit: (file: File) => Promise<boolean>;
  submitted: boolean;
}

export function EAFC25ProofUpload({ 
  onSubmit,
  submitted
}: EAFC25ProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        alert("Invalid file type. Please upload a JPG or PNG image.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || submitted) return;
    
    setUploading(true);
    try {
      const success = await onSubmit(file);
      if (!success) {
        throw new Error("Failed to upload proof");
      }
    } catch (error) {
      console.error("Error uploading proof:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Upload Match Proof</h4>
          <p className="text-xs text-muted-foreground mb-4">
            Take a screenshot showing the final score screen. The image must clearly show the final score and match timer.
          </p>
        </div>

        {!submitted && (
          <>
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Score screenshot preview" 
                  className="w-full h-auto rounded-md border border-border"
                />
                <button 
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-md p-6 text-center relative">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload a screenshot of the final score
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </>
        )}

        {submitted ? (
          <div className="flex items-center justify-center text-green-500 gap-2">
            <Check className="h-5 w-5" />
            <span>Proof submitted successfully</span>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload}
              disabled={!file || uploading || submitted}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Proof
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
