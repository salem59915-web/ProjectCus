import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface AudioUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function AudioUpload({ value, onChange, label = "رفع ملف صوتي" }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(value || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error("الرجاء اختيار ملف صوتي");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن لا يتجاوز 10 ميجابايت");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل رفع الملف الصوتي');
      }

      const data = await response.json();
      setAudioUrl(data.url);
      onChange(data.url);
      toast.success("تم رفع الملف الصوتي بنجاح");
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف الصوتي";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setAudioUrl("");
    onChange("");
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-3">
        {audioUrl ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex-1 text-sm text-muted-foreground">
              ملف صوتي مرفوع
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">اختر ملف صوتي للرفع</p>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.aac,.ogg,.flac,.wma"
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري رفع الملف الصوتي...
          </div>
        )}
      </div>
    </div>
  );
}
