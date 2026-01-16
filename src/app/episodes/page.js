'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import episodesData from '@/data/episodes.json';

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
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = (episode) => {
    setSelectedEpisode(episode);
    setViewOpen(true);
  };

  const handleEdit = (episode) => {
    setSelectedEpisode(episode);
    setEditOpen(true);
  };

  const handleDelete = (episode) => {
    setSelectedEpisode(episode);
    setDeleteOpen(true);
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
                    <th className="p-4 text-left text-sm font-medium text-gray-400">EPISODE TITLE</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">EPISODE #</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">STATUS</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">RUNTIME</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">RELEASE DATE</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {episodesData.episodes.map((episode) => (
                    <tr key={episode.id} className="border-b border-border hover:bg-accent/5">
                      <td className="p-4">
                        <div className="font-medium text-teal-400">
                          {episode.title || 'CLASSIFIED'} {episode.episodeNumber ? `- EP ${episode.episodeNumber}` : ''}
                        </div>
                        <div className="mt-1 text-sm text-gray-400">ID: {episode.id}</div>
                        {episode.synopsis && (
                          <div className="mt-1 text-xs text-gray-500 line-clamp-1 max-w-md">{episode.synopsis}</div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-teal-400">EP {episode.episodeNumber}</td>
                      <td className="p-4">
                        <Badge
                          className={`${getStatusBadgeColor(episode.status)} transition-all duration-300 ease-in-out`}
                        >
                          {episode.status}
                        </Badge>
                        {episode.status === 'LOCKED' && episode.clearanceLevel && (
                          <div className="mt-1 text-xs text-red-400">Level {episode.clearanceLevel} Required</div>
                        )}
                      </td>
                      <td className="p-4 text-gray-400">{episode.runtime || 'N/A'}</td>
                      <td className="p-4 text-gray-400">{formatDate(episode.releaseDate)}</td>
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
                                  EPISODE {episode.episodeNumber}: {episode.title || 'CLASSIFIED'}
                                </DialogTitle>
                                <DialogDescription>Episode Details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-gray-400">Episode ID</Label>
                                    <p className="text-teal-400 mt-1">{episode.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Status</Label>
                                    <div className="mt-1">
                                      <Badge className={getStatusBadgeColor(episode.status)}>{episode.status}</Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Runtime</Label>
                                    <p className="text-white mt-1">{episode.runtime || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Release Date</Label>
                                    <p className="text-white mt-1">{formatDate(episode.releaseDate)}</p>
                                  </div>
                                  {episode.status === 'LOCKED' && episode.clearanceLevel && (
                                    <div>
                                      <Label className="text-gray-400">Clearance Level</Label>
                                      <p className="text-red-400 mt-1">Level {episode.clearanceLevel} Required</p>
                                    </div>
                                  )}
                                </div>
                                {episode.synopsis && (
                                  <div>
                                    <Label className="text-gray-400">Synopsis</Label>
                                    <p className="text-white mt-1">{episode.synopsis}</p>
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
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Episode Title</Label>
                                    <Input
                                      id="edit-title"
                                      defaultValue={episode.title}
                                      className="bg-[#0a0a0a] border-border"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-number">Episode Number</Label>
                                    <Input
                                      id="edit-number"
                                      defaultValue={episode.episodeNumber}
                                      className="bg-[#0a0a0a] border-border"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select defaultValue={episode.status}>
                                      <SelectTrigger className="bg-[#0a0a0a] border-border">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                                        <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                                        <SelectItem value="LOCKED">LOCKED</SelectItem>
                                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-runtime">Runtime</Label>
                                    <Input
                                      id="edit-runtime"
                                      defaultValue={episode.runtime || ''}
                                      placeholder="42:15"
                                      className="bg-[#0a0a0a] border-border"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-synopsis">Synopsis</Label>
                                  <Textarea
                                    id="edit-synopsis"
                                    defaultValue={episode.synopsis || ''}
                                    className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditOpen(false)}>
                                  CANCEL
                                </Button>
                                <Button onClick={() => setEditOpen(false)}>SAVE CHANGES</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={deleteOpen && selectedEpisode?.id === episode.id} onOpenChange={setDeleteOpen}>
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
                                    EPISODE {episode.episodeNumber}: {episode.title || 'CLASSIFIED'}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-400">ID: {episode.id}</p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                  CANCEL
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    // Handle delete logic here
                                    setDeleteOpen(false);
                                  }}
                                >
                                  DELETE EPISODE
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
