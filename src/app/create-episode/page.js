'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Plus, Save, Send, Trash2, Upload, Users } from 'lucide-react';
import { useState } from 'react';

export default function CreateEpisodePage() {
  const [status, setStatus] = useState('');
  const [characters, setCharacters] = useState(['']);
  const [locations, setLocations] = useState(['']);
  const [choices, setChoices] = useState([{ text: '', consequence: '' }]);
  const [tags, setTags] = useState(['']);
  const [mediaFiles, setMediaFiles] = useState([]);

  const addCharacter = () => {
    setCharacters([...characters, '']);
  };

  const removeCharacter = (index) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const updateCharacter = (index, value) => {
    const newCharacters = [...characters];
    newCharacters[index] = value;
    setCharacters(newCharacters);
  };

  const addLocation = () => {
    setLocations([...locations, '']);
  };

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const updateLocation = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const addChoice = () => {
    setChoices([...choices, { text: '', consequence: '' }]);
  };

  const removeChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const updateChoice = (index, field, value) => {
    const newChoices = [...choices];
    newChoices[index][field] = value;
    setChoices(newChoices);
  };

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

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / CREATE-EPISODE">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">FORGE NEW EPISODE</h1>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button variant="outline" disabled className="flex-1 sm:flex-initial">
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">SAVE DRAFT</span>
              <span className="sm:hidden">SAVE</span>
            </Button>
            <Button className="flex-1 sm:flex-initial">
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
                <Input id="episode-title" placeholder="Enter episode title..." className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="episode-number" className="text-gray-300">
                    EPISODE
                  </Label>
                  <Input id="episode-number" type="number" placeholder="001" className="bg-[#0a0a0a] border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season-number" className="text-gray-300">
                    SEASON
                  </Label>
                  <Input id="season-number" type="number" placeholder="1" className="bg-[#0a0a0a] border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-id" className="text-gray-300">
                  UNIQUE EPISODE ID
                </Label>
                <Input id="episode-id" placeholder="EP-S01-E001" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode-type" className="text-gray-300">
                  EPISODE TYPE
                </Label>
                <Select>
                  <SelectTrigger className="bg-[#0a0a0a] border-border">
                    <SelectValue placeholder="Select episode type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">MAIN STORY</SelectItem>
                    <SelectItem value="side">SIDE QUEST</SelectItem>
                    <SelectItem value="prologue">PROLOGUE</SelectItem>
                    <SelectItem value="epilogue">EPILOGUE</SelectItem>
                    <SelectItem value="interlude">INTERLUDE</SelectItem>
                    <SelectItem value="flashback">FLASHBACK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="runtime" className="text-gray-300">
                  RUNTIME (format: MM:SS or HH:MM:SS)
                </Label>
                <Input id="runtime" placeholder="42:15" className="bg-[#0a0a0a] border-border" />
                <p className="text-xs text-gray-500">Example: 42:15 or 1:30:45</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">PUBLISHING & VISIBILITY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300">
                  STATUS
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border">
                    <SelectValue placeholder="Select status" />
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
              {status === 'UPCOMING' && (
                <div className="space-y-2">
                  <Label htmlFor="release-date-upcoming" className="text-gray-300">
                    RELEASE DATE (for countdown timer)
                  </Label>
                  <Input id="release-date-upcoming" type="datetime-local" className="bg-[#0a0a0a] border-border" />
                </div>
              )}
              {status === 'LOCKED' && (
                <div className="space-y-2">
                  <Label htmlFor="clearance-level" className="text-gray-300">
                    CLEARANCE LEVEL REQUIRED
                  </Label>
                  <Input
                    id="clearance-level"
                    type="number"
                    min="1"
                    placeholder="5"
                    className="bg-[#0a0a0a] border-border"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="access-level" className="text-gray-300">
                  ACCESS LEVEL
                </Label>
                <Select>
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
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="restrict" className="text-base font-medium text-teal-400">
                  RESTRICT TO PREMIUM PASS HOLDERS
                </Label>
                <Switch id="restrict" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="age-restriction" className="text-base font-medium text-teal-400">
                  AGE RESTRICTED (18+)
                </Label>
                <Switch id="age-restriction" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Narrative Content */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">NARRATIVE CONTENT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="synopsis" className="text-gray-300">
                SYNOPSIS (Brief Summary)
              </Label>
              <Textarea
                id="synopsis"
                placeholder="Enter a brief synopsis of the episode..."
                className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full-narrative" className="text-gray-300">
                FULL NARRATIVE TEXT
              </Label>
              <Textarea
                id="full-narrative"
                placeholder="Enter the complete narrative content for this episode..."
                className="min-h-[300px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opening-quote" className="text-gray-300">
                OPENING QUOTE / TEASER
              </Label>
              <Textarea
                id="opening-quote"
                placeholder="Enter opening quote or teaser text..."
                className="min-h-[80px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ending-notes" className="text-gray-300">
                ENDING NOTES / CLOSING REMARKS
              </Label>
              <Textarea
                id="ending-notes"
                placeholder="Enter ending notes or closing remarks..."
                className="min-h-[80px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Characters & Locations */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-400">
                <Users className="w-5 h-5" />
                CHARACTERS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {characters.map((character, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Character ${index + 1} name`}
                    value={character}
                    onChange={(e) => updateCharacter(index, e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                  {characters.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCharacter(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addCharacter} className="w-full border-2 border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                ADD CHARACTER
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-400">
                <MapPin className="w-5 h-5" />
                LOCATIONS / SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Location ${index + 1} name`}
                    value={location}
                    onChange={(e) => updateLocation(index, e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                  {locations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLocation(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addLocation} className="w-full border-2 border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                ADD LOCATION
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Choices & Consequences */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">INTERACTIVE CHOICES & CONSEQUENCES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {choices.map((choice, index) => (
              <div key={index} className="space-y-3 p-4 border border-border rounded-md bg-[#0a0a0a]">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-teal-400">CHOICE {index + 1}</Label>
                  {choices.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChoice(index)}
                      className="w-8 h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Choice text..."
                    value={choice.text}
                    onChange={(e) => updateChoice(index, 'text', e.target.value)}
                    className="bg-[#111111] border-border"
                  />
                  <Textarea
                    placeholder="Consequence or outcome description..."
                    value={choice.consequence}
                    onChange={(e) => updateChoice(index, 'consequence', e.target.value)}
                    className="min-h-[80px] bg-[#111111] border-border resize-none"
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addChoice} className="w-full border-2 border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              ADD CHOICE BRANCH
            </Button>
          </CardContent>
        </Card>

        {/* Unlock Conditions & Prerequisites */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">UNLOCK CONDITIONS & PREREQUISITES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="required-episodes" className="text-gray-300">
                  REQUIRED PREVIOUS EPISODES (comma-separated IDs)
                </Label>
                <Input
                  id="required-episodes"
                  placeholder="EP-S01-E001, EP-S01-E002"
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum-level" className="text-gray-300">
                  MINIMUM CHARACTER/PLAYER LEVEL
                </Label>
                <Input id="minimum-level" type="number" placeholder="1" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="required-achievements" className="text-gray-300">
                  REQUIRED ACHIEVEMENTS (comma-separated)
                </Label>
                <Input
                  id="required-achievements"
                  placeholder="ACH-001, ACH-005"
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="required-items" className="text-gray-300">
                  REQUIRED ITEMS / ARTIFACTS
                </Label>
                <Input id="required-items" placeholder="ITEM-001, ARTIFACT-A" className="bg-[#0a0a0a] border-border" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="unlock-automatic" className="text-base font-medium text-teal-400">
                AUTO-UNLOCK WHEN CONDITIONS MET
              </Label>
              <Switch id="unlock-automatic" />
            </div>
          </CardContent>
        </Card>

        {/* Media Assets */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">MEDIA ASSETS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail-url" className="text-gray-300">
                THUMBNAIL IMAGE URL (Background image for episode card)
              </Label>
              <Input
                id="thumbnail-url"
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-[#0a0a0a] border-border"
              />
              <p className="text-xs text-gray-500">
                This image will be displayed as the background in the episode card
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="banner-url" className="text-gray-300">
                  BANNER IMAGE URL (optional)
                </Label>
                <Input
                  id="banner-url"
                  placeholder="https://example.com/banner.jpg"
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background-image-url" className="text-gray-300">
                  ADDITIONAL BACKGROUND URL (optional)
                </Label>
                <Input
                  id="background-image-url"
                  placeholder="https://example.com/background.jpg"
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-url" className="text-gray-300">
                  VIDEO / CINEMATIC URL (optional)
                </Label>
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4"
                  className="bg-[#0a0a0a] border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-url" className="text-gray-300">
                AUDIO / SOUNDTRACK URL (optional)
              </Label>
              <Input
                id="audio-url"
                placeholder="https://example.com/audio.mp3"
                className="bg-[#0a0a0a] border-border"
              />
            </div>
            <Button variant="outline" className="w-full border-2 border-dashed">
              <Upload className="w-4 h-4 mr-2" />
              UPLOAD MEDIA FILES
            </Button>
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

        {/* Additional Metadata */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">ADDITIONAL METADATA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author" className="text-gray-300">
                  AUTHOR / WRITER
                </Label>
                <Input id="author" placeholder="Author name" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editor" className="text-gray-300">
                  EDITOR
                </Label>
                <Input id="editor" placeholder="Editor name" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="word-count" className="text-gray-300">
                  WORD COUNT
                </Label>
                <Input id="word-count" type="number" placeholder="0" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reading-time" className="text-gray-300">
                  ESTIMATED READING TIME (minutes)
                </Label>
                <Input id="reading-time" type="number" placeholder="0" className="bg-[#0a0a0a] border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">
                INTERNAL NOTES (not visible to users)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any internal notes or reminders..."
                className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="featured" className="text-base font-medium text-teal-400">
                FEATURED EPISODE
              </Label>
              <Switch id="featured" />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
