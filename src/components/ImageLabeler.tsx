import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Image {
  id: number;
  image_url: string;
  label: string | null;
}

const API_URL = 'http://localhost:5000/api';

export default function ImageLabeler() {
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-image`);
      const data = await response.json();
      
      if (data.message) {
        toast({
          title: "All Done!",
          description: "No more images to label.",
        });
        setCurrentImage(null);
      } else {
        setCurrentImage(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch image.",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = async () => {
    if (!currentImage || !label.trim()) return;

    try {
      const response = await fetch(`${API_URL}/submit-label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentImage.id,
          label: label.trim(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Label saved successfully.",
        });
        setLabel('');
        fetchImage();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save label.",
      });
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  if (!currentImage && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">All Done! 🎉</h2>
          <p>There are no more images to label.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Image Labeler</h1>
        
        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Progress: {progress}%
          </p>
        </div>

        {loading ? (
          <div className="aspect-video bg-gray-200 animate-pulse rounded-lg mb-6" />
        ) : (
          <img
            src={currentImage?.image_url}
            alt="To be labeled"
            className="w-full rounded-lg mb-6 aspect-video object-cover"
          />
        )}

        <div className="space-y-4">
          <Input
            placeholder="Enter a label for this image..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submitLabel()}
            disabled={loading}
          />
          
          <Button 
            className="w-full"
            onClick={submitLabel}
            disabled={loading || !label.trim()}
          >
            Submit Label
          </Button>
        </div>
      </Card>
    </div>
  );
}