'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import episodesData from '@/data/episodes.json';
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePollPage() {
  const router = useRouter();
  const [episodeName, setEpisodeName] = useState('');
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollDuration, setPollDuration] = useState('');
  const [options, setOptions] = useState([
    { name: '', description: '', count: 0 },
    { name: '', description: '', count: 0 },
  ]);

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

  const handleSubmit = (isDraft = false) => {
    // TODO: Implement form submission
    console.log('Poll Data:', {
      episodeName,
      pollTitle,
      pollDescription,
      pollDuration,
      options,
      isDraft,
    });
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

        {/* Episode Selection */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">EPISODE SELECTION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="episode">SELECT EPISODE</Label>
              <Select value={episodeName} onValueChange={setEpisodeName}>
                <SelectTrigger id="episode" className="bg-[#0a0a0a] border-border">
                  <SelectValue placeholder="Choose an episode..." />
                </SelectTrigger>
                <SelectContent>
                  {episodesData.episodes.map((episode) => (
                    <SelectItem key={episode.id} value={episode.id}>
                      {episode.title} - {episode.episodeNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Enter poll title..."
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                className="bg-[#0a0a0a] border-border"
              />
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">POLL DURATION</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="Duration in days (e.g., 7)"
                value={pollDuration}
                onChange={(e) => setPollDuration(e.target.value)}
                className="bg-[#0a0a0a] border-border"
                min="1"
              />
              <p className="mt-2 text-xs text-gray-400">Enter number of days the poll will be active</p>
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
              placeholder="Describe the poll in detail..."
              value={pollDescription}
              onChange={(e) => setPollDescription(e.target.value)}
              className="min-h-[150px] bg-[#0a0a0a] border-border resize-none"
            />
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
                      placeholder={`Enter option ${index + 1} name...`}
                      value={option.name}
                      onChange={(e) => updateOption(index, 'name', e.target.value)}
                      className="bg-[#0a0a0a] border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`option-desc-${index}`} className="block mb-1 text-xs text-gray-400">
                      Option Description
                    </Label>
                    <Textarea
                      id={`option-desc-${index}`}
                      placeholder={`Describe option ${index + 1}...`}
                      value={option.description}
                      onChange={(e) => updateOption(index, 'description', e.target.value)}
                      className="min-h-[80px] bg-[#0a0a0a] border-border resize-none"
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
                      className="bg-[#0a0a0a] border-border"
                      min="0"
                    />
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
