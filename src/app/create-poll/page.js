'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Send, Plus, Trash2 } from 'lucide-react';

export default function CreatePollPage() {
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / CREATE-POLL">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">FORGE NEW PROTOCOL</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" disabled className="flex-1 sm:flex-initial">
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">SAVE DRAFT</span>
              <span className="sm:hidden">SAVE</span>
            </Button>
            <Button className="flex-1 sm:flex-initial">
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">DEPLOY LIVE</span>
              <span className="sm:hidden">DEPLOY</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">QUERY TEXT</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What destiny shall the users choose?..."
                className="min-h-[200px] bg-[#0a0a0a] border-border resize-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">CONSENSUS PATHS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="bg-[#0a0a0a] border-border"
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addOption} className="w-full border-dashed border-2">
                <Plus className="h-4 w-4 mr-2" />
                ADD LOGIC BRANCH
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="restrict" className="text-base font-medium text-teal-400">
                RESTRICT TO PREMIUM PASS HOLDERS
              </Label>
              <Switch id="restrict" />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
