'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateEpisodePage() {
  const router = useRouter();

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

  const handleSubmit = (isDraft = false) => {
    // TODO: Implement form submission
    console.log('Episode Data:', {
      episodeTitle,
      episodeDescription,
      episodeNumber,
      episodeSeason,
      episodeRuntime,
      notify,
      uniqueEpisodeId,
      visibility,
      accessLevel,
      releaseDateTime,
      clearanceLevel,
      ageRestricted,
      thumbImageUrl,
      bannerImageUrl,
      videoUrl,
      audioUrl,
      additionalBackgroundImageUrl,
      tags,
      isDraft,
    });
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
            <Button variant="outline" onClick={() => handleSubmit(true)} className="flex-1 sm:flex-initial">
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">SAVE DRAFT</span>
              <span className="sm:hidden">SAVE</span>
            </Button>
            <Button onClick={() => handleSubmit(false)} className="flex-1 sm:flex-initial">
              <Send className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">DEPLOY LIVE</span>
              <span className="sm:hidden">DEPLOY</span>
            </Button>
          </div>
        </div>

        {/* Basic Episode Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">EPISODE METADATA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="episode-title" className="text-gray-300">
                  EPISODE TITLE
                </Label>
                <Input
                  id="episode-title"
                  placeholder="Enter episode title..."
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-description" className="text-gray-300">
                  EPISODE DESCRIPTION
                </Label>
                <Textarea
                  id="episode-description"
                  placeholder="Enter episode description..."
                  value={episodeDescription}
                  onChange={(e) => setEpisodeDescription(e.target.value)}
                  className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="episode-number" className="text-gray-300">
                    EPISODE NUMBER
                  </Label>
                  <Input
                    id="episode-number"
                    type="number"
                    placeholder="001"
                    value={episodeNumber}
                    onChange={(e) => setEpisodeNumber(e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season-number" className="text-gray-300">
                    EPISODE SEASON
                  </Label>
                  <Input
                    id="season-number"
                    type="number"
                    placeholder="1"
                    value={episodeSeason}
                    onChange={(e) => setEpisodeSeason(e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-runtime" className="text-gray-300">
                  EPISODE RUNTIME (format: MM:SS or HH:MM:SS)
                </Label>
                <Input
                  id="episode-runtime"
                  placeholder="42:15"
                  value={episodeRuntime}
                  onChange={(e) => setEpisodeRuntime(e.target.value)}
                  className="bg-[#0a0a0a] border-border"
                />
                <p className="text-xs text-gray-500">Example: 42:15 or 1:30:45</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-id" className="text-gray-300">
                  UNIQUE EPISODE ID
                </Label>
                <Input
                  id="episode-id"
                  placeholder="EP-S01-E001"
                  value={uniqueEpisodeId}
                  onChange={(e) => setUniqueEpisodeId(e.target.value)}
                  className="bg-[#0a0a0a] border-border"
                />
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
                  VISIBILITY
                </Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                    <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                    <SelectItem value="LOCKED">LOCKED</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                    <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access-level" className="text-gray-300">
                  ACCESS LEVEL
                </Label>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">FREE</SelectItem>
                    <SelectItem value="premium">PREMIUM</SelectItem>
                    <SelectItem value="vip">VIP EXCLUSIVE</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clearance-level" className="text-gray-300">
                  CLEARANCE LEVEL
                </Label>
                <Input
                  id="clearance-level"
                  type="number"
                  min="1"
                  placeholder="Enter clearance level"
                  value={clearanceLevel}
                  onChange={(e) => setClearanceLevel(e.target.value)}
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="notify" className="text-base font-medium text-teal-400">
                  NOTIFY USERS
                </Label>
                <Switch id="notify" checked={notify} onCheckedChange={setNotify} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="age-restriction" className="text-base font-medium text-teal-400">
                  AGE RESTRICTED
                </Label>
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
                THUMB IMAGE URL
              </Label>
              <Input
                id="thumb-image-url"
                placeholder="https://example.com/thumbnail.jpg"
                value={thumbImageUrl}
                onChange={(e) => setThumbImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-image-url" className="text-gray-300">
                BANNER IMAGE URL
              </Label>
              <Input
                id="banner-image-url"
                placeholder="https://example.com/banner.jpg"
                value={bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-url" className="text-gray-300">
                VIDEO URL
              </Label>
              <Input
                id="video-url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-url" className="text-gray-300">
                AUDIO URL
              </Label>
              <Input
                id="audio-url"
                placeholder="https://example.com/audio.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-background-image-url" className="text-gray-300">
                ADDITIONAL BACKGROUND IMAGE URL
              </Label>
              <Input
                id="additional-background-image-url"
                placeholder="https://example.com/background.jpg"
                value={additionalBackgroundImageUrl}
                onChange={(e) => setAdditionalBackgroundImageUrl(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
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
                    placeholder={`Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                  {tags.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(index)}
                      className="text-destructive hover:text-destructive"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-genre" className="text-gray-300">
                PRIMARY GENRE
              </Label>
              <Select>
                <SelectTrigger className="bg-[#0a0a0a] border-border">
                  <SelectValue placeholder="Select primary genre" />
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-genre" className="text-gray-300">
                SECONDARY GENRE (optional)
              </Label>
              <Select>
                <SelectTrigger className="bg-[#0a0a0a] border-border">
                  <SelectValue placeholder="Select secondary genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">NONE</SelectItem>
                  <SelectItem value="cyberpunk">CYBERPUNK</SelectItem>
                  <SelectItem value="sci-fi">SCIENCE FICTION</SelectItem>
                  <SelectItem value="fantasy">FANTASY</SelectItem>
                  <SelectItem value="thriller">THRILLER</SelectItem>
                  <SelectItem value="drama">DRAMA</SelectItem>
                  <SelectItem value="mystery">MYSTERY</SelectItem>
                  <SelectItem value="action">ACTION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => handleSubmit(true)} className="min-w-[140px]">
            <Save className="w-4 h-4 mr-2" />
            SAVE DRAFT
          </Button>
          <Button onClick={() => handleSubmit(false)} className="min-w-[140px]">
            <Send className="w-4 h-4 mr-2" />
            DEPLOY LIVE
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
