import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        toast({
          title: "Camera Started",
          description: "Your camera is now active",
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      toast({
        title: "Camera Stopped",
        description: "Your camera has been turned off",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center space-x-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Candidate Profile</h1>
                  <p className="text-muted-foreground text-sm">{user?.email || 'Guest User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Camera Preview</h2>
                </div>
                {isCameraActive && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                )}
              </div>

              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">Camera not active</p>
                      <Button onClick={startCamera} className="bg-primary hover:bg-primary/90">
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isCameraActive && (
                <Button 
                  onClick={stopCamera} 
                  variant="outline"
                  className="w-full border-border hover:bg-muted"
                >
                  Stop Camera
                </Button>
              )}
            </Card>

            {/* User Information */}
            <Card className="bg-card border-border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">User Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-foreground mt-1">{user?.email || 'Not available'}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">User ID</label>
                  <p className="text-foreground mt-1 text-xs font-mono">{user?.id || 'Not available'}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Account Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-foreground">Active</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button 
                    onClick={() => navigate('/interview-copilot')}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    Start Interview Session
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
