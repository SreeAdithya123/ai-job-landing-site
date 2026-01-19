import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldX, Mail } from 'lucide-react';

interface AccountSuspendedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSuspendedModal: React.FC<AccountSuspendedModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onOpenChange(false);
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-red-700">
            Account Suspended
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-2">
            <p>
              Your account has been suspended due to repeated unusual activity
              patterns that violate our terms of service.
            </p>
            <p className="font-medium">
              You cannot start new interviews until your account is reviewed by
              our admin team.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left">
              <p className="text-sm font-medium mb-2">What happens next?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your account is now under review</li>
                <li>• An admin will assess your activity</li>
                <li>• You'll be contacted regarding the outcome</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={handleGoToDashboard}
            className="flex items-center gap-2"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => window.location.href = 'mailto:support@aiinterviewer.com'}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSuspendedModal;
