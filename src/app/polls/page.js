'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import pollsData from '@/data/polls.json';

export default function PollsPage() {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = (poll) => {
    setSelectedPoll(poll);
    setViewOpen(true);
  };

  const handleEdit = (poll) => {
    setSelectedPoll(poll);
    setEditOpen(true);
  };

  const handleDelete = (poll) => {
    setSelectedPoll(poll);
    setDeleteOpen(true);
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
                    <th className="text-left p-4 text-sm font-medium text-gray-400">POLL TITLE / QUESTION</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">VOTES</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">STATUS</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">LAUNCH DATE</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pollsData.polls.map((poll) => (
                    <tr key={poll.id} className="border-b border-border hover:bg-accent/5">
                      <td className="p-4">
                        <div className="font-medium text-teal-400">{poll.title}</div>
                        <div className="text-sm text-gray-400 mt-1">ID: {poll.id}</div>
                      </td>
                      <td className="p-4 font-medium text-teal-400">{poll.votes}</td>
                      <td className="p-4">
                        <Badge className="border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out">
                          {poll.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-400">{poll.launchDate}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Dialog open={viewOpen && selectedPoll?.id === poll.id} onOpenChange={setViewOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="View" onClick={() => handleView(poll)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{poll.title}</DialogTitle>
                                <DialogDescription>Poll Details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-gray-400">Poll ID</Label>
                                    <p className="text-teal-400 mt-1">{poll.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Status</Label>
                                    <div className="mt-1">
                                      <Badge className="border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500">
                                        {poll.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Votes</Label>
                                    <p className="text-white mt-1">{poll.votes}</p>
                                  </div>
                                  <div>
                                    <Label className="text-gray-400">Launch Date</Label>
                                    <p className="text-white mt-1">{poll.launchDate}</p>
                                  </div>
                                </div>
                                {poll.question && (
                                  <div>
                                    <Label className="text-gray-400">Question</Label>
                                    <p className="text-white mt-1">{poll.question}</p>
                                  </div>
                                )}
                                {poll.options && poll.options.length > 0 && (
                                  <div>
                                    <Label className="text-gray-400">Options</Label>
                                    <ul className="mt-1 space-y-1">
                                      {poll.options.map((option, index) => (
                                        <li key={index} className="text-white">
                                          {index + 1}. {option}
                                        </li>
                                      ))}
                                    </ul>
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

                          <Dialog open={editOpen && selectedPoll?.id === poll.id} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(poll)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>EDIT POLL</DialogTitle>
                                <DialogDescription>Update poll information</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-poll-title">Poll Title</Label>
                                  <Input
                                    id="edit-poll-title"
                                    defaultValue={poll.title}
                                    className="bg-[#0a0a0a] border-border"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-poll-votes">Votes</Label>
                                  <Input
                                    id="edit-poll-votes"
                                    type="number"
                                    defaultValue={poll.votes}
                                    className="bg-[#0a0a0a] border-border"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-poll-launch">Launch Date</Label>
                                  <Input
                                    id="edit-poll-launch"
                                    defaultValue={poll.launchDate}
                                    className="bg-[#0a0a0a] border-border"
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
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    // Handle delete logic here
                                    setDeleteOpen(false);
                                  }}
                                >
                                  DELETE POLL
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
