import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface InterviewWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InterviewWarningModal: React.FC<InterviewWarningModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Unusual Activity Detected
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              We've noticed you've ended interviews early multiple times. This
              pattern affects your credit usage and interview progress.
            </p>
            <p className="font-medium text-amber-700">
              Continuing this behavior may result in account suspension and
              review by our team.
            </p>
            <p className="text-sm text-muted-foreground">
              Please complete your interviews to get the full benefit of your
              credits and improve your interview skills.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewWarningModal;
