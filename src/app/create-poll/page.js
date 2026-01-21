'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreatePollPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [episodeName, setEpisodeName] = useState('');
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollDuration, setPollDuration] = useState('');
  const [options, setOptions] = useState([
    { name: '', description: '', count: 0 },
    { name: '', description: '', count: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch episodes from API
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setEpisodesLoading(true);
        const response = await fetch('/api/episodes');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch episodes');
        }

        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        addToast({
          variant: 'error',
          title: 'Failed to Load Episodes',
          description: err.message || 'Could not load episodes. Please refresh the page.',
          duration: 5000,
        });
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchEpisodes();
  }, [addToast]);

  const addOption = () => {
    setOptions([...options, { name: '', description: '', count: 0 }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = async (isDraft = false) => {
    // Clear previous errors
    setError('');

    // Validation
    if (!episodeName) {
      setError('Please select an episode');
      return;
    }
    if (!pollTitle.trim()) {
      setError('Poll title is required');
      return;
    }
    const validOptions = options.filter((opt) => opt.name.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare poll data
      const pollData = {
        episode_id: episodeName,
        title: pollTitle.trim(),
        description: pollDescription.trim() || null,
        duration_days: parseInt(pollDuration) || 7,
        status: isDraft ? 'DRAFT' : 'LIVE',
        isDraft,
        options: validOptions.map((opt) => ({
          name: opt.name.trim(),
          description: opt.description.trim() || null,
          count: parseInt(opt.count) || 0,
        })),
      };

      // Submit to API
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create poll');
      }

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Poll Created Successfully!',
        description: isDraft
          ? `"${pollTitle}" has been saved as a draft.`
          : `"${pollTitle}" has been published successfully.`,
        duration: 3000,
      });

      // Redirect to polls page
      setTimeout(() => {
        router.push('/polls');
      }, 1500);
    } catch (err) {
      console.error('Error creating poll:', err);
      const errorMessage = err.message || 'Failed to create poll. Please try again.';
      setError(errorMessage);

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Create Poll',
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / CREATE-POLL">
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
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
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">FORGE NEW PROTOCOL</h1>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting || episodesLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                  SAVING...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">SAVE DRAFT</span>
                  <span className="sm:hidden">SAVE</span>
                </>
              )}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting || episodesLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  DEPLOYING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">DEPLOY LIVE</span>
                  <span className="sm:hidden">DEPLOY</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-sm text-red-400 border rounded-md bg-red-950/30 border-red-500/50">
            <div className="mb-1 font-semibold">Error:</div>
            <div>{error}</div>
          </div>
        )}

        {/* Episode Selection */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">EPISODE SELECTION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="episode">
                SELECT EPISODE <span className="text-red-400">*</span>
              </Label>
              <Select value={episodeName} onValueChange={setEpisodeName} disabled={episodesLoading}>
                <SelectTrigger
                  id="episode"
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                >
                  <SelectValue placeholder={episodesLoading ? 'Loading episodes...' : 'Choose an episode...'} />
                </SelectTrigger>
                <SelectContent>
                  {episodes.length === 0 && !episodesLoading ? (
                    <SelectItem value="" disabled>
                      No episodes available
                    </SelectItem>
                  ) : (
                    episodes.map((episode) => (
                      <SelectItem key={episode.id} value={episode.id}>
                        {episode.title || 'Untitled'}
                        {episode.episode_number && ` - S${episode.season_number || '?'} EP${episode.episode_number}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Select the episode this poll is associated with</p>
            </div>
          </CardContent>
        </Card>

        {/* Poll Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">POLL TITLE</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Who should make the decision?"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoFocus
                autoComplete="off"
                required
              />
              <p className="mt-2 text-xs text-gray-400">Enter a clear and engaging poll question or title</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">POLL DURATION</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="7"
                value={pollDuration}
                onChange={(e) => setPollDuration(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                min="1"
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-gray-400">Number of days the poll will be active (default: 7 days)</p>
            </CardContent>
          </Card>
        </div>

        {/* Poll Description */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">POLL DESCRIPTION</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Provide context and details about this poll..."
              value={pollDescription}
              onChange={(e) => setPollDescription(e.target.value)}
              className="min-h-[150px] bg-[#0a0a0a] border-border resize-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-gray-400">
              Optional: Add details about the poll and what users are voting on
            </p>
          </CardContent>
        </Card>

        {/* Poll Options */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">POLL OPTIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {options.map((option, index) => (
              <div key={index} className="space-y-4 p-4 border border-border rounded-md bg-[#0a0a0a]">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-teal-400">OPTION {index + 1}</Label>
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="w-8 h-8 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`option-name-${index}`} className="block mb-1 text-xs text-gray-400">
                      Option Name
                    </Label>
                    <Input
                      id={`option-name-${index}`}
                      placeholder={`e.g., Option ${index + 1} name`}
                      value={option.name}
                      onChange={(e) => updateOption(index, 'name', e.target.value)}
                      className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`option-desc-${index}`} className="block mb-1 text-xs text-gray-400">
                      Option Description
                    </Label>
                    <Textarea
                      id={`option-desc-${index}`}
                      placeholder={`Optional: Describe this option in detail...`}
                      value={option.description}
                      onChange={(e) => updateOption(index, 'description', e.target.value)}
                      className="min-h-[80px] bg-[#0a0a0a] border-border resize-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`option-count-${index}`} className="block mb-1 text-xs text-gray-400">
                      Initial Vote Count
                    </Label>
                    <Input
                      id={`option-count-${index}`}
                      type="number"
                      placeholder="0"
                      value={option.count}
                      onChange={(e) => updateOption(index, 'count', parseInt(e.target.value) || 0)}
                      className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                      min="0"
                      autoComplete="off"
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional: Set initial vote count</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addOption} className="w-full border-2 border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              ADD OPTION
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="min-w-[140px]"
            disabled={isSubmitting || episodesLoading}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                SAVE DRAFT
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            className="min-w-[140px]"
            disabled={isSubmitting || episodesLoading}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                DEPLOYING...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                DEPLOY LIVE
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
