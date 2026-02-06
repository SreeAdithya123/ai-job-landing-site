import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Interview {
  id: string;
  question: string;
  answer: string;
  feedback: string | null;
  timestamp: string;
}

const InterviewHistoryTable = () => {
  const { user } = useAuth();

  const { data: interviews, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as Interview[];
    },
    enabled: !!user?.id,
  });

  const handleDeleteInterview = async (interviewId: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', interviewId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Interview Deleted",
        description: "The interview record has been successfully deleted.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete interview record.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="glass-card p-4 sm:p-6 rounded-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-48"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-4 sm:p-6 rounded-xl">
        <div className="text-center text-destructive">
          <p className="font-medium">Error loading interview history</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!interviews || interviews.length === 0) {
    return (
      <motion.div
        className="glass-card p-4 sm:p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-medium font-headline text-foreground mb-2">
            No Interview History Yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Start your first interview to see your history here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold font-headline text-foreground">Interview History</h3>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {interviews.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden divide-y divide-border">
        {interviews.slice(0, 5).map((interview, index) => (
          <motion.div
            key={interview.id}
            className="p-4 hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(interview.timestamp)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteInterview(interview.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {truncateText(interview.question, 100)}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {truncateText(interview.answer, 80)}
            </p>
            {interview.feedback && (
              <p className="text-xs text-secondary">
                {truncateText(interview.feedback, 80)}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.slice(0, 5).map((interview, index) => (
              <motion.tr
                key={interview.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {formatTimestamp(interview.timestamp)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                    {truncateText(interview.question, 100)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {truncateText(interview.answer, 100)}
                  </p>
                </TableCell>
                <TableCell>
                  {interview.feedback ? (
                    <p className="text-xs sm:text-sm text-secondary line-clamp-2">
                      {truncateText(interview.feedback, 100)}
                    </p>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No feedback</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInterview(interview.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {interviews.length > 5 && (
        <div className="px-4 sm:px-6 py-3 border-t border-border text-center">
          <span className="text-xs text-muted-foreground">
            Showing 5 of {interviews.length} interviews
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default InterviewHistoryTable;
