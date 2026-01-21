'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { EpisodesTableShimmer } from '@/components/shimmer/episodes-table-shimmer';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'AVAILABLE':
      return 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500';
    case 'UPCOMING':
      return 'border-orange-500 bg-orange-500/50 text-orange-400 hover:bg-orange-500';
    case 'LOCKED':
      return 'border-white/50 bg-white/10 text-white hover:bg-white/20';
    case 'DRAFT':
      return 'border-gray-500 bg-gray-500/50 text-gray-400 hover:bg-gray-500';
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

export default function EpisodesPage() {
  const { addToast } = useToast();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch episodes from API
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/episodes');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch episodes');
        }

        setEpisodes(data.episodes || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        setError(err.message || 'Failed to load episodes');
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  const handleView = (episode) => {
    setSelectedEpisode(episode);
    setViewOpen(true);
  };

  const handleEdit = (episode) => {
    setSelectedEpisode(episode);
    // Initialize form data with current episode values
    setEditFormData({
      title: episode.title || '',
      episode_number: episode.episode_number || '',
      season_number: episode.season_number || '',
      runtime: episode.runtime || '',
      description: episode.description || '',
      visibility: episode.visibility || 'DRAFT',
      access_level: episode.access_level || 'free',
      release_datetime: episode.release_datetime ? new Date(episode.release_datetime).toISOString().slice(0, 16) : '',
      clearance_level: episode.clearance_level || 1,
      notify: episode.notify || false,
      age_restricted: episode.age_restricted || false,
      thumb_image_url: episode.thumb_image_url || '',
      banner_image_url: episode.banner_image_url || '',
      video_url: episode.video_url || '',
      audio_url: episode.audio_url || '',
      additional_background_image_url: episode.additional_background_image_url || '',
      tags: episode.tags || [],
      primary_genre: episode.primary_genre || '',
      secondary_genre: episode.secondary_genre || 'none',
      status: episode.status || 'DRAFT',
    });
    setEditOpen(true);
  };

  const handleUpdateEpisode = async () => {
    if (!selectedEpisode) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/episodes/${selectedEpisode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          // Convert 'none' back to null for secondary_genre
          secondary_genre: editFormData.secondary_genre === 'none' ? null : editFormData.secondary_genre,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update episode');
      }

      // Update the episode in the list
      setEpisodes(episodes.map((ep) => (ep.id === selectedEpisode.id ? { ...ep, ...data.episode } : ep)));

      setEditOpen(false);
      setSelectedEpisode(null);
      setEditFormData({});

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Episode Updated Successfully!',
        description: `"${editFormData.title || selectedEpisode.title}" has been updated.`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error updating episode:', err);
      const errorMessage = err.message || 'Failed to update episode';

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Update Episode',
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (episode) => {
    setSelectedEpisode(episode);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEpisode) return;

    try {
      const response = await fetch(`/api/episodes/${selectedEpisode.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete episode');
      }

      // Remove episode from state
      const deletedTitle = selectedEpisode.title || 'Episode';
      setEpisodes(episodes.filter((ep) => ep.id !== selectedEpisode.id));
      setDeleteOpen(false);
      setSelectedEpisode(null);

      // Show success toast
      addToast({
        variant: 'success',
        title: 'Episode Deleted Successfully!',
        description: `"${deletedTitle}" has been permanently deleted.`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error deleting episode:', err);
      const errorMessage = err.message || 'Failed to delete episode';

      // Show error toast
      addToast({
        variant: 'error',
        title: 'Failed to Delete Episode',
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / EPISODES">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">EPISODE MANAGEMENT</h1>
          <Link href="/create-episode">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              CREATE EPISODE
            </Button>
          </Link>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-sm font-medium text-left text-gray-400">EPISODE TITLE</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">EPISODE #</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">STATUS</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">RUNTIME</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">RELEASE DATE</th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <EpisodesTableShimmer />
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center">
                        <div className="mb-2 text-red-400">Error: {error}</div>
                        <Button variant="outline" onClick={() => window.location.reload()} className="text-sm">
                          Retry
                        </Button>
                      </td>
                    </tr>
                  ) : episodes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">
                        No episodes found. Create your first episode to get started.
                      </td>
                    </tr>
                  ) : (
                    episodes.map((episode) => (
                      <tr key={episode.id} className="border-b border-border hover:bg-accent/5">
                        <td className="p-4">
                          <div className="font-medium text-teal-400">
                            {episode.title || 'CLASSIFIED'}{' '}
                            {episode.episode_number ? `- EP ${episode.episode_number}` : ''}
                          </div>
                          <div className="mt-1 text-sm text-gray-400">ID: {episode.id}</div>
                          <div className="mt-1 text-xs text-gray-400">Unique ID: {episode.unique_episode_id}</div>
                          {episode.description && (
                            <div className="max-w-md mt-1 text-xs text-gray-500 line-clamp-1">
                              {episode.description}
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-medium text-teal-400">
                          S{episode.season_number || '?'} EP{episode.episode_number || '?'}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={`${getStatusBadgeColor(episode.visibility)} transition-all duration-300 ease-in-out`}
                          >
                            {episode.visibility}
                          </Badge>
                          {episode.access_level && (
                            <div className="mt-1 text-xs text-gray-400">
                              {episode.access_level.toUpperCase()} ACCESS
                            </div>
                          )}
                          {episode.visibility === 'LOCKED' && episode.clearance_level && (
                            <div className="mt-1 text-xs text-red-400">Level {episode.clearance_level} Required</div>
                          )}
                        </td>
                        <td className="p-4 text-gray-400">{episode.runtime || 'N/A'}</td>
                        <td className="p-4 text-gray-400">{formatDate(episode.release_datetime)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Dialog open={viewOpen && selectedEpisode?.id === episode.id} onOpenChange={setViewOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="View" onClick={() => handleView(episode)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    EPISODE {episode.episode_number}: {episode.title || 'CLASSIFIED'}
                                  </DialogTitle>
                                  <DialogDescription>Episode Details</DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-gray-400">Episode ID</Label>
                                      <p className="mt-1 font-mono text-xs text-teal-400">{episode.id}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Unique Episode ID</Label>
                                      <p className="mt-1 text-teal-400">{episode.unique_episode_id}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Season & Episode</Label>
                                      <p className="mt-1 text-white">
                                        Season {episode.season_number}, Episode {episode.episode_number}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Status</Label>
                                      <div className="mt-1">
                                        <Badge className={getStatusBadgeColor(episode.visibility)}>
                                          {episode.visibility}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Access Level</Label>
                                      <p className="mt-1 text-white">{episode.access_level?.toUpperCase() || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Runtime</Label>
                                      <p className="mt-1 text-white">{episode.runtime || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Release Date</Label>
                                      <p className="mt-1 text-white">{formatDate(episode.release_datetime)}</p>
                                    </div>
                                    {episode.clearance_level && (
                                      <div>
                                        <Label className="text-gray-400">Clearance Level</Label>
                                        <p className="mt-1 text-red-400">Level {episode.clearance_level} Required</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label className="text-gray-400">Age Restricted</Label>
                                      <p className="mt-1 text-white">{episode.age_restricted ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-400">Notify Users</Label>
                                      <p className="mt-1 text-white">{episode.notify ? 'Yes' : 'No'}</p>
                                    </div>
                                  </div>
                                  {episode.description && (
                                    <div>
                                      <Label className="text-gray-400">Description</Label>
                                      <p className="mt-1 text-white whitespace-pre-wrap">{episode.description}</p>
                                    </div>
                                  )}
                                  {episode.tags && episode.tags.length > 0 && (
                                    <div>
                                      <Label className="text-gray-400">Tags</Label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {episode.tags.map((tag, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {(episode.primary_genre || episode.secondary_genre) && (
                                    <div className="grid grid-cols-2 gap-4">
                                      {episode.primary_genre && (
                                        <div>
                                          <Label className="text-gray-400">Primary Genre</Label>
                                          <p className="mt-1 text-white">{episode.primary_genre}</p>
                                        </div>
                                      )}
                                      {episode.secondary_genre && (
                                        <div>
                                          <Label className="text-gray-400">Secondary Genre</Label>
                                          <p className="mt-1 text-white">{episode.secondary_genre}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setViewOpen(false)}>
                                    CLOSE
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={editOpen && selectedEpisode?.id === episode.id} onOpenChange={setEditOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(episode)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>EDIT EPISODE</DialogTitle>
                                  <DialogDescription>Update episode information</DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-title">Episode Title</Label>
                                      <Input
                                        id="edit-title"
                                        value={editFormData.title || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-number">Episode Number</Label>
                                      <Input
                                        id="edit-number"
                                        type="number"
                                        value={editFormData.episode_number || ''}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            episode_number: parseInt(e.target.value) || '',
                                          })
                                        }
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-season">Season Number</Label>
                                      <Input
                                        id="edit-season"
                                        type="number"
                                        value={editFormData.season_number || ''}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            season_number: parseInt(e.target.value) || '',
                                          })
                                        }
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-runtime">Runtime</Label>
                                      <Input
                                        id="edit-runtime"
                                        value={editFormData.runtime || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, runtime: e.target.value })}
                                        placeholder="42:15"
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-visibility">Visibility</Label>
                                      <Select
                                        value={editFormData.visibility || 'DRAFT'}
                                        onValueChange={(value) =>
                                          setEditFormData({ ...editFormData, visibility: value })
                                        }
                                      >
                                        <SelectTrigger className="bg-[#0a0a0a] border-border">
                                          <SelectValue />
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
                                      <Label htmlFor="edit-access-level">Access Level</Label>
                                      <Select
                                        value={editFormData.access_level || 'free'}
                                        onValueChange={(value) =>
                                          setEditFormData({ ...editFormData, access_level: value })
                                        }
                                      >
                                        <SelectTrigger className="bg-[#0a0a0a] border-border">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="free">FREE</SelectItem>
                                          <SelectItem value="premium">PREMIUM</SelectItem>
                                          <SelectItem value="vip">VIP EXCLUSIVE</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-release-datetime">Release Date & Time</Label>
                                      <Input
                                        id="edit-release-datetime"
                                        type="datetime-local"
                                        value={editFormData.release_datetime || ''}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, release_datetime: e.target.value })
                                        }
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-clearance-level">Clearance Level</Label>
                                      <Input
                                        id="edit-clearance-level"
                                        type="number"
                                        min="1"
                                        value={editFormData.clearance_level || 1}
                                        onChange={(e) =>
                                          setEditFormData({
                                            ...editFormData,
                                            clearance_level: parseInt(e.target.value) || 1,
                                          })
                                        }
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editFormData.description || ''}
                                      onChange={(e) =>
                                        setEditFormData({ ...editFormData, description: e.target.value })
                                      }
                                      className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-primary-genre">Primary Genre</Label>
                                      <Select
                                        value={editFormData.primary_genre || ''}
                                        onValueChange={(value) =>
                                          setEditFormData({ ...editFormData, primary_genre: value })
                                        }
                                      >
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
                                      <Label htmlFor="edit-secondary-genre">Secondary Genre</Label>
                                      <Select
                                        value={editFormData.secondary_genre || 'none'}
                                        onValueChange={(value) =>
                                          setEditFormData({
                                            ...editFormData,
                                            secondary_genre: value === 'none' ? null : value,
                                          })
                                        }
                                      >
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
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-thumb-image">Thumb Image URL</Label>
                                      <Input
                                        id="edit-thumb-image"
                                        value={editFormData.thumb_image_url || ''}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, thumb_image_url: e.target.value })
                                        }
                                        placeholder="https://example.com/thumbnail.jpg"
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-banner-image">Banner Image URL</Label>
                                      <Input
                                        id="edit-banner-image"
                                        value={editFormData.banner_image_url || ''}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, banner_image_url: e.target.value })
                                        }
                                        placeholder="https://example.com/banner.jpg"
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-video-url">Video URL</Label>
                                      <Input
                                        id="edit-video-url"
                                        value={editFormData.video_url || ''}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, video_url: e.target.value })
                                        }
                                        placeholder="https://example.com/video.mp4"
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-audio-url">Audio URL</Label>
                                      <Input
                                        id="edit-audio-url"
                                        value={editFormData.audio_url || ''}
                                        onChange={(e) =>
                                          setEditFormData({ ...editFormData, audio_url: e.target.value })
                                        }
                                        placeholder="https://example.com/audio.mp3"
                                        className="bg-[#0a0a0a] border-border"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center justify-between">
                                      <Label htmlFor="edit-notify" className="text-base font-medium text-teal-400">
                                        NOTIFY USERS
                                      </Label>
                                      <Switch
                                        id="edit-notify"
                                        checked={editFormData.notify || false}
                                        onCheckedChange={(checked) =>
                                          setEditFormData({ ...editFormData, notify: checked })
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor="edit-age-restricted"
                                        className="text-base font-medium text-teal-400"
                                      >
                                        AGE RESTRICTED
                                      </Label>
                                      <Switch
                                        id="edit-age-restricted"
                                        checked={editFormData.age_restricted || false}
                                        onCheckedChange={(checked) =>
                                          setEditFormData({ ...editFormData, age_restricted: checked })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setEditOpen(false);
                                      setEditFormData({});
                                      setSelectedEpisode(null);
                                    }}
                                    disabled={isUpdating}
                                  >
                                    CANCEL
                                  </Button>
                                  <Button onClick={handleUpdateEpisode} disabled={isUpdating}>
                                    {isUpdating ? (
                                      <>
                                        <div className="w-4 h-4 mr-2 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                                        UPDATING...
                                      </>
                                    ) : (
                                      'SAVE CHANGES'
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog
                              open={deleteOpen && selectedEpisode?.id === episode.id}
                              onOpenChange={setDeleteOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Delete"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(episode)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>DELETE EPISODE</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this episode? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="rounded-md border border-border bg-[#0a0a0a] p-4">
                                    <p className="font-medium text-teal-400">
                                      EPISODE {episode.episode_number}: {episode.title || 'CLASSIFIED'}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">ID: {episode.id}</p>
                                    <p className="mt-1 text-xs text-gray-500">Unique ID: {episode.unique_episode_id}</p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                    CANCEL
                                  </Button>
                                  <Button variant="destructive" onClick={confirmDelete}>
                                    DELETE EPISODE
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
