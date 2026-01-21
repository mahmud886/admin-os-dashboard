'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { PollDetailsShimmer } from '@/components/shimmer/poll-details-shimmer';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'LIVE':
      return 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500';
    case 'DRAFT':
      return 'border-gray-500 bg-gray-500/50 text-gray-400 hover:bg-gray-500';
    case 'ENDED':
      return 'border-orange-500 bg-orange-500/50 text-orange-400 hover:bg-orange-500';
    case 'ARCHIVED':
      return 'border-purple-500 bg-purple-500/50 text-purple-400 hover:bg-purple-500';
    default:
      return 'border-gray-500 bg-gray-500/50 text-gray-400 hover:bg-gray-500';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PollDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const pollId = params.id;

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingVote, setIsUpdatingVote] = useState(null);

  // Fetch poll details
  const fetchPoll = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/polls/${pollId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch poll');
      }

      setPoll(data.poll);
      setError(null);
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError(err.message || 'Failed to load poll');
      setPoll(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  // Calculate total votes
  const getTotalVotes = (poll) => {
    if (!poll?.poll_options || poll.poll_options.length === 0) return 0;
    return poll.poll_options.reduce((total, option) => total + (option.vote_count || 0), 0);
  };

  // Calculate percentage for each option
  const getOptionPercentage = (option, totalVotes) => {
    if (!totalVotes || totalVotes === 0) return 0;
    return Math.round((option.vote_count / totalVotes) * 100);
  };

  // Real-time vote increment on option click
  const handleOptionVoteClick = async (option) => {
    if (isUpdatingVote === option.id) return; // Prevent double clicks
    if (!poll) return;

    try {
      setIsUpdatingVote(option.id);

      // Optimistically update UI
      const updatedPoll = {
        ...poll,
        poll_options: poll.poll_options.map((opt) =>
          opt.id === option.id ? { ...opt, vote_count: (opt.vote_count || 0) + 1 } : opt
        ),
      };
      setPoll(updatedPoll);

      // Send update to API
      const options = updatedPoll.poll_options.map((opt, index) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description || null,
        count: opt.vote_count || 0,
        vote_count: opt.vote_count || 0,
      }));

      const response = await fetch(`/api/polls/${poll.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          options: options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update vote');
      }

      // Refresh poll to get latest data
      await fetchPoll();

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Vote Added!',
        description: `Vote added to "${option.name}"`,
        duration: 2000,
      });
    } catch (err) {
      console.error('Error updating vote:', err);
      // Revert optimistic update
      await fetchPoll();

      addToast({
        variant: 'error',
        title: 'Failed to Update Vote',
        description: err.message || 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsUpdatingVote(null);
    }
  };

  if (loading) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / POLLS / DETAILS">
        <PollDetailsShimmer />
      </MainLayout>
    );
  }

  if (error || !poll) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / POLLS / DETAILS">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <div className="mb-4 text-red-400">Error: {error || 'Poll not found'}</div>
          <Button onClick={() => router.push('/polls')} variant="outline">
            Back to Polls
          </Button>
        </div>
      </MainLayout>
    );
  }

  const totalVotes = getTotalVotes(poll);
  const sortedOptions = poll.poll_options
    ? [...poll.poll_options].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  return (
    <MainLayout breadcrumb={`SYSTEM CONSOLE / POLLS / ${poll.title?.toUpperCase() || 'DETAILS'}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/polls')}
            className="text-gray-400 hover:text-teal-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO POLLS
          </Button>
        </div>

        {/* Poll Title Card */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl text-teal-400 mb-2">{poll.title}</CardTitle>
                {poll.description && <p className="text-gray-300 mt-2 whitespace-pre-wrap">{poll.description}</p>}
              </div>
              <Badge className={`${getStatusBadgeColor(poll.status)} text-sm`}>{poll.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <Label className="text-gray-400">Total Votes</Label>
                <p className="text-2xl font-bold text-teal-400 mt-1">{totalVotes}</p>
              </div>
              <div>
                <Label className="text-gray-400">Duration</Label>
                <p className="text-white mt-1">{poll.duration_days || 7} days</p>
              </div>
              <div>
                <Label className="text-gray-400">Start Date</Label>
                <p className="text-white mt-1">{formatDate(poll.starts_at)}</p>
              </div>
              <div>
                <Label className="text-gray-400">End Date</Label>
                <p className="text-white mt-1">{formatDate(poll.ends_at)}</p>
              </div>
              {poll.episodes && (
                <div className="col-span-2 md:col-span-4">
                  <Label className="text-gray-400">Episode</Label>
                  <p className="text-teal-400 mt-1">
                    {poll.episodes.title || 'N/A'}
                    {poll.episodes.episode_number &&
                      ` (S${poll.episodes.season_number || '?'} EP${poll.episodes.episode_number})`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Poll Options Card */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">POLL OPTIONS</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Click on an option to vote</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedOptions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No options available</p>
            ) : (
              sortedOptions.map((option, index) => {
                const percentage = getOptionPercentage(option, totalVotes);
                const isUpdating = isUpdatingVote === option.id;

                return (
                  <div
                    key={option.id}
                    className="relative p-4 rounded-lg border border-border bg-[#0a0a0a] hover:border-teal-400/50 transition-all cursor-pointer group"
                    onClick={() => handleOptionVoteClick(option)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-900/30 border border-teal-400/50 text-teal-400 font-semibold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-medium text-white transition-colors group-hover:text-teal-400">
                            {option.name}
                          </h3>
                        </div>
                        {option.description && <p className="text-sm text-gray-400 ml-11">{option.description}</p>}
                        {totalVotes > 0 && (
                          <div className="mt-3 ml-11">
                            <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-teal-400 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{percentage}% of votes</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-400">{option.vote_count || 0}</div>
                          <div className="text-xs text-gray-400">votes</div>
                        </div>
                        {isUpdating ? (
                          <div className="w-8 h-8 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-400 transition-opacity opacity-0 group-hover:opacity-100 hover:text-teal-300 hover:bg-teal-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOptionVoteClick(option);
                            }}
                          >
                            <CheckCircle2 className="w-5 h-5 mr-1" />
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Poll Info Card */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">POLL INFORMATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Poll ID</Label>
                <p className="mt-1 font-mono text-xs text-teal-400 break-all">{poll.id}</p>
              </div>
              <div>
                <Label className="text-gray-400">Status</Label>
                <div className="mt-1">
                  <Badge className={getStatusBadgeColor(poll.status)}>{poll.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Created At</Label>
                <p className="mt-1 text-white">{formatDate(poll.created_at)}</p>
              </div>
              <div>
                <Label className="text-gray-400">Last Updated</Label>
                <p className="mt-1 text-white">{formatDate(poll.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
