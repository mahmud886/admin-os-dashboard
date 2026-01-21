'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateEpisodePage() {
  const router = useRouter();
  const { addToast } = useToast();

  // Basic Episode Information
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeDescription, setEpisodeDescription] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [episodeSeason, setEpisodeSeason] = useState('');
  const [episodeRuntime, setEpisodeRuntime] = useState('');
  const [notify, setNotify] = useState(false);
  const [uniqueEpisodeId, setUniqueEpisodeId] = useState('');

  // Visibility & Access
  const [visibility, setVisibility] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [releaseDateTime, setReleaseDateTime] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState('');
  const [ageRestricted, setAgeRestricted] = useState(false);

  // Media Assets
  const [thumbImageUrl, setThumbImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [additionalBackgroundImageUrl, setAdditionalBackgroundImageUrl] = useState('');

  // Dynamic Lists
  const [tags, setTags] = useState(['']);

  // Genre fields
  const [primaryGenre, setPrimaryGenre] = useState('');
  const [secondaryGenre, setSecondaryGenre] = useState('');

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Required fields
    if (!episodeTitle.trim()) {
      errors.push('Episode title is required');
    }
    if (!episodeNumber || episodeNumber === '') {
      errors.push('Episode number is required');
    }
    if (!episodeSeason || episodeSeason === '') {
      errors.push('Season number is required');
    }
    if (!uniqueEpisodeId.trim()) {
      errors.push('Unique episode ID is required');
    }

    // Validate unique episode ID format (optional pattern check)
    if (uniqueEpisodeId && !/^[A-Z0-9\-_]+$/i.test(uniqueEpisodeId)) {
      errors.push('Unique episode ID can only contain letters, numbers, hyphens, and underscores');
    }

    // Validate runtime format (MM:SS or HH:MM:SS)
    if (episodeRuntime && !/^(\d{1,2}):([0-5][0-9])(:([0-5][0-9]))?$/.test(episodeRuntime)) {
      errors.push('Runtime must be in format MM:SS or HH:MM:SS (e.g., 42:15 or 1:30:45)');
    }

    // Validate clearance level
    if (clearanceLevel && (isNaN(clearanceLevel) || parseInt(clearanceLevel) < 1)) {
      errors.push('Clearance level must be a number greater than 0');
    }

    // Validate URLs if provided
    const urlFields = [
      { name: 'Thumb Image URL', value: thumbImageUrl },
      { name: 'Banner Image URL', value: bannerImageUrl },
      { name: 'Video URL', value: videoUrl },
      { name: 'Audio URL', value: audioUrl },
      { name: 'Additional Background Image URL', value: additionalBackgroundImageUrl },
    ];

    urlFields.forEach((field) => {
      if (field.value && !/^https?:\/\/.+/.test(field.value)) {
        errors.push(`${field.name} must be a valid URL starting with http:// or https://`);
      }
    });

    return errors;
  };

  const handleSubmit = async (isDraft = false) => {
    // Clear previous errors
    setError('');
    setSuccess(false);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare episode data
      const episodeData = {
        title: episodeTitle.trim(),
        description: episodeDescription.trim() || null,
        episode_number: parseInt(episodeNumber),
        season_number: parseInt(episodeSeason),
        runtime: episodeRuntime.trim() || null,
        unique_episode_id: uniqueEpisodeId.trim(),
        visibility: visibility || 'DRAFT',
        access_level: accessLevel || 'free',
        release_datetime: releaseDateTime ? new Date(releaseDateTime).toISOString() : null,
        clearance_level: clearanceLevel ? parseInt(clearanceLevel) : 1,
        notify: notify || false,
        age_restricted: ageRestricted || false,
        thumb_image_url: thumbImageUrl.trim() || null,
        banner_image_url: bannerImageUrl.trim() || null,
        video_url: videoUrl.trim() || null,
        audio_url: audioUrl.trim() || null,
        additional_background_image_url: additionalBackgroundImageUrl.trim() || null,
        tags: tags.filter((tag) => tag.trim() !== ''),
        primary_genre: primaryGenre || null,
        secondary_genre: secondaryGenre === 'none' ? null : secondaryGenre || null,
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
        isDraft,
      };

      // Submit to API
      const response = await fetch('/api/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(episodeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create episode');
      }

      // Success
      setSuccess(true);
      setError('');

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Episode Created Successfully!',
        description: isDraft
          ? `"${episodeTitle}" has been saved as a draft.`
          : `"${episodeTitle}" has been published successfully.`,
        duration: 3000,
      });

      // Reset form
      resetForm();

      // Redirect to episodes page after a short delay
      setTimeout(() => {
        router.push('/episodes');
      }, 1500);
    } catch (err) {
      console.error('Error creating episode:', err);
      const errorMessage = err.message || 'Failed to create episode. Please try again.';
      setError(errorMessage);
      setSuccess(false);

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Create Episode',
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEpisodeTitle('');
    setEpisodeDescription('');
    setEpisodeNumber('');
    setEpisodeSeason('');
    setEpisodeRuntime('');
    setNotify(false);
    setUniqueEpisodeId('');
    setVisibility('');
    setAccessLevel('');
    setReleaseDateTime('');
    setClearanceLevel('');
    setAgeRestricted(false);
    setThumbImageUrl('');
    setBannerImageUrl('');
    setVideoUrl('');
    setAudioUrl('');
    setAdditionalBackgroundImageUrl('');
    setTags(['']);
    setPrimaryGenre('');
    setSecondaryGenre('none');
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / CREATE-EPISODE">
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/episodes')}
            className="text-gray-400 hover:text-teal-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO EPISODES
          </Button>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">FORGE NEW EPISODE</h1>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              className="flex-1 sm:flex-initial"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">SAVE DRAFT</span>
              <span className="sm:hidden">SAVE</span>
            </Button>
            <Button onClick={() => handleSubmit(false)} className="flex-1 sm:flex-initial" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">DEPLOY LIVE</span>
              <span className="sm:hidden">DEPLOY</span>
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

        {/* Success Message */}
        {success && (
          <div className="p-4 text-sm text-green-400 border rounded-md bg-green-950/30 border-green-500/50">
            <div className="mb-1 font-semibold">Success!</div>
            <div>Episode created successfully. Redirecting to episodes page...</div>
          </div>
        )}

        {/* Basic Episode Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">EPISODE METADATA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="episode-title" className="text-gray-300">
                  EPISODE TITLE <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="episode-title"
                  placeholder="e.g., The Awakening, Neon Shadows"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                  required
                  autoFocus
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">Enter a descriptive title for this episode</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-description" className="text-gray-300">
                  EPISODE DESCRIPTION
                </Label>
                <Textarea
                  id="episode-description"
                  placeholder="Provide a detailed description of the episode's plot, characters, and key events..."
                  value={episodeDescription}
                  onChange={(e) => setEpisodeDescription(e.target.value)}
                  className="min-h-[100px] bg-[#0a0a0a] border-border resize-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">Optional: Describe the episode's storyline and content</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="episode-number" className="text-gray-300">
                    EPISODE NUMBER <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="episode-number"
                    type="number"
                    placeholder="1, 2, 3..."
                    value={episodeNumber}
                    onChange={(e) => setEpisodeNumber(e.target.value)}
                    className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                    min="1"
                    required
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500">Which episode number in this season?</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season-number" className="text-gray-300">
                    SEASON NUMBER <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="season-number"
                    type="number"
                    placeholder="1, 2, 3..."
                    value={episodeSeason}
                    onChange={(e) => setEpisodeSeason(e.target.value)}
                    className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                    min="1"
                    required
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500">Which season does this episode belong to?</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-runtime" className="text-gray-300">
                  EPISODE RUNTIME
                </Label>
                <Input
                  id="episode-runtime"
                  placeholder="42:15 or 1:30:45"
                  value={episodeRuntime}
                  onChange={(e) => setEpisodeRuntime(e.target.value)}
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">
                  Format: MM:SS (e.g., 42:15) or HH:MM:SS (e.g., 1:30:45) - Optional
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-id" className="text-gray-300">
                  UNIQUE EPISODE ID <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="episode-id"
                  placeholder="EP-S01-E001"
                  value={uniqueEpisodeId}
                  onChange={(e) => setUniqueEpisodeId(e.target.value)}
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                  required
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">
                  Create a unique ID like EP-S01-E001 (Season 1, Episode 1). Must be unique across all episodes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">PUBLISHING & VISIBILITY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visibility" className="text-gray-300">
                  VISIBILITY STATUS
                </Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                    <SelectValue placeholder="Choose visibility status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">DRAFT - Hidden, work in progress</SelectItem>
                    <SelectItem value="AVAILABLE">AVAILABLE - Live and accessible</SelectItem>
                    <SelectItem value="UPCOMING">UPCOMING - Scheduled for release</SelectItem>
                    <SelectItem value="LOCKED">LOCKED - Requires clearance</SelectItem>
                    <SelectItem value="ARCHIVED">ARCHIVED - No longer active</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Control who can see this episode. Default: DRAFT</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access-level" className="text-gray-300">
                  ACCESS LEVEL
                </Label>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                    <SelectValue placeholder="Choose access level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">FREE - Available to all users</SelectItem>
                    <SelectItem value="premium">PREMIUM - Requires premium subscription</SelectItem>
                    <SelectItem value="vip">VIP EXCLUSIVE - VIP members only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Who can access this episode? Default: FREE</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="release-datetime" className="text-gray-300">
                  RELEASE DATE & TIME
                </Label>
                <Input
                  id="release-datetime"
                  type="datetime-local"
                  value={releaseDateTime}
                  onChange={(e) => setReleaseDateTime(e.target.value)}
                  onClick={(e) => {
                    // Open datetime picker on click
                    if (e.currentTarget.showPicker) {
                      try {
                        e.currentTarget.showPicker();
                      } catch (error) {
                        // Fallback if showPicker is not supported
                      }
                    }
                  }}
                  onFocus={(e) => {
                    // Open datetime picker on focus
                    if (e.currentTarget.showPicker) {
                      try {
                        e.currentTarget.showPicker();
                      } catch (error) {
                        // Fallback if showPicker is not supported
                      }
                    }
                  }}
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none cursor-pointer"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">Optional: Click to open calendar and time picker</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clearance-level" className="text-gray-300">
                  CLEARANCE LEVEL
                </Label>
                <Input
                  id="clearance-level"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={clearanceLevel}
                  onChange={(e) => setClearanceLevel(e.target.value)}
                  className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500">Security clearance required (1-5). Default: 1</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <Label htmlFor="notify" className="text-base font-medium text-teal-400">
                    NOTIFY USERS
                  </Label>
                  <p className="text-xs text-gray-500">Send notification when episode goes live</p>
                </div>
                <Switch id="notify" checked={notify} onCheckedChange={setNotify} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="age-restriction" className="text-base font-medium text-teal-400">
                    AGE RESTRICTED
                  </Label>
                  <p className="text-xs text-gray-500">Require age verification to access</p>
                </div>
                <Switch id="age-restriction" checked={ageRestricted} onCheckedChange={setAgeRestricted} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Assets */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">MEDIA ASSETS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumb-image-url" className="text-gray-300">
                THUMBNAIL IMAGE URL
              </Label>
              <Input
                id="thumb-image-url"
                placeholder="https://yoursite.com/images/thumbnails/episode-1.jpg"
                value={thumbImageUrl}
                onChange={(e) => setThumbImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">Small image shown in episode lists (recommended: 400x300px)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-image-url" className="text-gray-300">
                BANNER IMAGE URL
              </Label>
              <Input
                id="banner-image-url"
                placeholder="https://yoursite.com/images/banners/episode-1-banner.jpg"
                value={bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">Large header image for episode page (recommended: 1920x1080px)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-url" className="text-gray-300">
                VIDEO URL
              </Label>
              <Input
                id="video-url"
                placeholder="https://yoursite.com/videos/episode-1.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">Direct link to episode video file (MP4, WebM, etc.)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-url" className="text-gray-300">
                AUDIO URL
              </Label>
              <Input
                id="audio-url"
                placeholder="https://yoursite.com/audio/episode-1.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">Direct link to episode audio file (MP3, WAV, etc.)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-background-image-url" className="text-gray-300">
                ADDITIONAL BACKGROUND IMAGE URL
              </Label>
              <Input
                id="additional-background-image-url"
                placeholder="https://yoursite.com/images/backgrounds/episode-1-bg.jpg"
                value={additionalBackgroundImageUrl}
                onChange={(e) => setAdditionalBackgroundImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500">Optional background image for enhanced visual experience</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags & Categories */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">TAGS & CATEGORIES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Enter tag ${index + 1} (e.g., action, sci-fi, mystery)`}
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
                    autoComplete="off"
                  />
                  {tags.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(index)}
                      className="text-destructive hover:text-destructive"
                      title="Remove tag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addTag} className="w-full border-2 border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                ADD TAG
              </Button>
              <p className="text-xs text-gray-500">
                Add tags to help users find this episode (e.g., action, mystery, cyberpunk)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-genre" className="text-gray-300">
                PRIMARY GENRE
              </Label>
              <Select value={primaryGenre} onValueChange={setPrimaryGenre}>
                <SelectTrigger className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                  <SelectValue placeholder="Choose main genre..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyberpunk">CYBERPUNK</SelectItem>
                  <SelectItem value="sci-fi">SCIENCE FICTION</SelectItem>
                  <SelectItem value="fantasy">FANTASY</SelectItem>
                  <SelectItem value="thriller">THRILLER</SelectItem>
                  <SelectItem value="drama">DRAMA</SelectItem>
                  <SelectItem value="mystery">MYSTERY</SelectItem>
                  <SelectItem value="action">ACTION</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Main genre category for this episode</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-genre" className="text-gray-300">
                SECONDARY GENRE
              </Label>
              <Select value={secondaryGenre || 'none'} onValueChange={setSecondaryGenre}>
                <SelectTrigger className="bg-[#0a0a0a] border-border focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                  <SelectValue placeholder="Choose secondary genre (optional)..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">NONE - No secondary genre</SelectItem>
                  <SelectItem value="cyberpunk">CYBERPUNK</SelectItem>
                  <SelectItem value="sci-fi">SCIENCE FICTION</SelectItem>
                  <SelectItem value="fantasy">FANTASY</SelectItem>
                  <SelectItem value="thriller">THRILLER</SelectItem>
                  <SelectItem value="drama">DRAMA</SelectItem>
                  <SelectItem value="mystery">MYSTERY</SelectItem>
                  <SelectItem value="action">ACTION</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Optional: Additional genre category</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="min-w-[140px]"
            disabled={isSubmitting}
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
          <Button onClick={() => handleSubmit(false)} className="min-w-[140px]" disabled={isSubmitting}>
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
