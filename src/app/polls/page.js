'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { PollsTableShimmer } from '@/components/shimmer/polls-table-shimmer';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function PollsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingVote, setIsUpdatingVote] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    duration_days: 7,
    options: [],
  });

  // Fetch polls from API
  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/polls');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch polls');
      }

      setPolls(data.polls || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError(err.message || 'Failed to load polls');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Calculate total votes from poll_options
  const getTotalVotes = (poll) => {
    if (!poll.poll_options || poll.poll_options.length === 0) return 0;
    return poll.poll_options.reduce((total, option) => total + (option.vote_count || 0), 0);
  };

  const handleView = (poll) => {
    router.push(`/polls/${poll.id}`);
  };

  const handleEdit = (poll) => {
    setSelectedPoll(poll);
    const options = poll.poll_options
      ? poll.poll_options
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map((opt) => ({
            id: opt.id,
            name: opt.name || '',
            description: opt.description || '',
            count: opt.vote_count || 0,
          }))
      : [];
    setEditFormData({
      title: poll.title || '',
      description: poll.description || '',
      status: poll.status || 'DRAFT',
      duration_days: poll.duration_days || 7,
      options: options,
    });
    setEditOpen(true);
  };

  // Poll options management in edit form
  const addEditOption = () => {
    setEditFormData({
      ...editFormData,
      options: [...editFormData.options, { id: null, name: '', description: '', count: 0 }],
    });
  };

  const removeEditOption = (index) => {
    if (editFormData.options.length > 2) {
      const newOptions = editFormData.options.filter((_, i) => i !== index);
      setEditFormData({ ...editFormData, options: newOptions });
    }
  };

  const updateEditOption = (index, field, value) => {
    const newOptions = [...editFormData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditFormData({ ...editFormData, options: newOptions });
  };

  // Real-time vote increment on option click
  const handleOptionVoteClick = async (poll, option) => {
    if (isUpdatingVote === option.id) return; // Prevent double clicks

    try {
      setIsUpdatingVote(option.id);

      // Optimistically update UI
      const updatedPolls = polls.map((p) => {
        if (p.id === poll.id) {
          return {
            ...p,
            poll_options: p.poll_options.map((opt) =>
              opt.id === option.id ? { ...opt, vote_count: (opt.vote_count || 0) + 1 } : opt
            ),
          };
        }
        return p;
      });
      setPolls(updatedPolls);

      // Update selected poll if it's the same
      if (selectedPoll && selectedPoll.id === poll.id) {
        const updatedPoll = updatedPolls.find((p) => p.id === poll.id);
        setSelectedPoll(updatedPoll);
      }

      // Send update to API
      const options = updatedPolls
        .find((p) => p.id === poll.id)
        .poll_options.map((opt, index) => ({
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

      // Refresh polls to get latest data
      await fetchPolls();

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
      await fetchPolls();

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

  const handleUpdatePoll = async () => {
    if (!selectedPoll || !selectedPoll.id) {
      addToast({
        variant: 'error',
        title: 'Error',
        description: 'No poll selected. Please try again.',
        duration: 3000,
      });
      return;
    }

    // Validation
    const validOptions = editFormData.options.filter((opt) => opt.name.trim() !== '');
    if (validOptions.length < 2) {
      addToast({
        variant: 'error',
        title: 'Validation Error',
        description: 'At least 2 options are required',
        duration: 3000,
      });
      return;
    }

    try {
      setIsUpdating(true);
      const pollId = selectedPoll.id;
      console.log('Updating poll with ID:', pollId);

      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          duration_days: parseInt(editFormData.duration_days),
          options: validOptions.map((opt, index) => ({
            id: opt.id,
            name: opt.name.trim(),
            description: opt.description?.trim() || null,
            count: parseInt(opt.count) || 0,
            vote_count: parseInt(opt.count) || 0,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update poll');
      }

      // Refresh polls list
      await fetchPolls();

      setEditOpen(false);
      setSelectedPoll(null);

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Poll Updated Successfully!',
        description: `"${editFormData.title}" has been updated.`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error updating poll:', err);
      const errorMessage = err.message || 'Failed to update poll';

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Update Poll',
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (poll) => {
    setSelectedPoll(poll);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPoll) return;

    try {
      const response = await fetch(`/api/polls/${selectedPoll.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete poll');
      }

      // Refresh polls list
      await fetchPolls();

      const deletedTitle = selectedPoll.title || 'Poll';
      setDeleteOpen(false);
      setSelectedPoll(null);

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Poll Deleted Successfully!',
        description: `"${deletedTitle}" has been permanently deleted.`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error deleting poll:', err);
      const errorMessage = err.message || 'Failed to delete poll';

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Delete Poll',
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / POLLS">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">ACTIVE PROTOCOLS</h1>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial">
              SYNC GLOBAL
            </Button>
            <Link href="/create-poll">
              <Button className="flex-1 sm:flex-initial">
                <Plus className="w-4 h-4 mr-2" />
                CREATE POLL
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-sm font-medium text-left text-gray-400">POLL TITLE / QUESTION</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">VOTES</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">STATUS</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">LAUNCH DATE</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <PollsTableShimmer />
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center">
                        <div className="mb-2 text-red-400">Error: {error}</div>
                        <Button variant="outline" onClick={fetchPolls} className="text-sm">
                          Retry
                        </Button>
                      </td>
                    </tr>
                  ) : polls.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        No polls found. Create your first poll to get started.
                      </td>
                    </tr>
                  ) : (
                    polls.map((poll) => (
                      <tr key={poll.id} className="border-b border-border hover:bg-accent/5">
                        <td className="p-4">
                          <div className="font-medium text-teal-400">{poll.title}</div>
                          {poll.episodes && (
                            <div className="mt-1 text-sm text-gray-400">
                              Episode: {poll.episodes.title || 'N/A'}
                              {poll.episodes.episode_number &&
                                ` (S${poll.episodes.season_number || '?'} EP${poll.episodes.episode_number})`}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-gray-500">ID: {poll.id}</div>
                        </td>
                        <td className="p-4 font-medium text-teal-400">{getTotalVotes(poll)}</td>
                        <td className="p-4">
                          <Badge
                            className={`${getStatusBadgeColor(poll.status)} transition-all duration-300 ease-in-out`}
                          >
                            {poll.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-400">{formatDate(poll.starts_at)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Details"
                              onClick={() => handleView(poll)}
                              className="hover:text-teal-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Dialog open={editOpen && selectedPoll?.id === poll.id} onOpenChange={setEditOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(poll)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                                <DialogHeader className="shrink-0">
                                  <DialogTitle>EDIT POLL</DialogTitle>
                                  <DialogDescription>Update poll information</DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 py-4 pr-2 space-y-4 overflow-y-auto">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-poll-title">Poll Title</Label>
                                    <Input
                                      id="edit-poll-title"
                                      value={editFormData.title}
                                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                      className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-poll-description">Description</Label>
                                    <Textarea
                                      id="edit-poll-description"
                                      value={editFormData.description}
                                      onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                      }
                                      className="min-h-[100px] bg-[#0a0a0a] border-border resize-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-poll-status">Status</Label>
                                      <Select
                                        value={editFormData.status}
                                        onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                                      >
                                        <SelectTrigger className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                                          <SelectItem value="LIVE">LIVE</SelectItem>
                                          <SelectItem value="ENDED">ENDED</SelectItem>
                                          <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-poll-duration">Duration (days)</Label>
                                      <Input
                                        id="edit-poll-duration"
                                        type="number"
                                        min="1"
                                        value={editFormData.duration_days}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, duration_days: e.target.value })
                                        }
                                        className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                  {/* Poll Options Editor */}
                                  <div className="pt-4 space-y-4 border-t border-border">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-gray-300">Poll Options</Label>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addEditOption}
                                        className="text-xs"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        ADD OPTION
                                      </Button>
                                    </div>
                                    <div className="space-y-3">
                                      {editFormData.options.map((option, index) => (
                                        <div
                                          key={index}
                                          className="p-3 space-y-3 rounded-md border border-border bg-[#0a0a0a]"
                                        >
                                          <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-teal-400">
                                              OPTION {index + 1}
                                            </Label>
                                            {editFormData.options.length > 2 && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeEditOption(index)}
                                                className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            <Input
                                              placeholder={`Option ${index + 1} name`}
                                              value={option.name}
                                              onChange={(e) => updateEditOption(index, 'name', e.target.value)}
                                              className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                            />
                                            <Textarea
                                              placeholder={`Option ${index + 1} description (optional)`}
                                              value={option.description || ''}
                                              onChange={(e) => updateEditOption(index, 'description', e.target.value)}
                                              className="min-h-[60px] bg-[#0a0a0a] border-border resize-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                            />
                                            <Input
                                              type="number"
                                              min="0"
                                              placeholder="Initial vote count"
                                              value={option.count || 0}
                                              onChange={(e) =>
                                                updateEditOption(index, 'count', parseInt(e.target.value) || 0)
                                              }
                                              className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {editFormData.options.length < 2 && (
                                      <p className="text-xs text-red-400">At least 2 options are required</p>
                                    )}
                                  </div>
                                </div>
                                <DialogFooter className="pt-4 mt-4 border-t shrink-0 border-border">
                                  <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isUpdating}>
                                    CANCEL
                                  </Button>
                                  <Button onClick={handleUpdatePoll} disabled={isUpdating}>
                                    {isUpdating ? 'UPDATING...' : 'SAVE CHANGES'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={deleteOpen && selectedPoll?.id === poll.id} onOpenChange={setDeleteOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Delete"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(poll)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>DELETE POLL</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this poll? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="rounded-md border border-border bg-[#0a0a0a] p-4">
                                    <p className="font-medium text-teal-400">{poll.title}</p>
                                    <p className="mt-1 text-sm text-gray-400">ID: {poll.id}</p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                    CANCEL
                                  </Button>
                                  <Button variant="destructive" onClick={confirmDelete}>
                                    DELETE POLL
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
