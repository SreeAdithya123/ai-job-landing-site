
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MessageSquare, User, Trash2 } from 'lucide-react';
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 rounded-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 rounded-xl">
        <div className="text-center text-red-500">
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
        className="glass-card p-8 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Interview History Yet
          </h3>
          <p className="text-muted-foreground">
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
      transition={{ duration: 0.6 }}
    >
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Interview History</h3>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {interviews.length} {interviews.length === 1 ? 'record' : 'records'}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Date & Time</span>
                </div>
              </TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>AI Feedback</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview, index) => (
              <motion.tr
                key={interview.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="hover:bg-primary/5 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(interview.timestamp)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {truncateText(interview.question, 120)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {truncateText(interview.answer, 120)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    {interview.feedback ? (
                      <p className="text-sm text-blue-600 leading-relaxed">
                        {truncateText(interview.feedback, 120)}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No feedback</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInterview(interview.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default InterviewHistoryTable;
