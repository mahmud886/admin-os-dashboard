"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Lock, Play, Loader2 } from "lucide-react";
import Image from "next/image";

export default function PremiereClient({ episode }) {
  const [isLocked, setIsLocked] = useState(episode.has_password);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/episodes/${episode.id}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsLocked(false);
        addToast({
          variant: "success",
          title: "Access Granted",
          description: "Enjoy the premiere!",
          duration: 2000,
        });
      } else {
        addToast({
          variant: "error",
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      addToast({
        variant: "error",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Image with Blur */}
        {(episode.banner_image_url || episode.thumb_image_url) && (
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={episode.banner_image_url || episode.thumb_image_url}
              alt="Background"
              fill
              className="object-cover blur-md"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-md bg-[#111111]/90 border border-teal-900/30 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-teal-900/20 rounded-full flex items-center justify-center mb-4 border border-teal-500/30">
              <Lock className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide uppercase">
              {episode.title || "LOCKED EPISODE"}
            </h1>
            <p className="text-gray-400 text-sm">
              This premiere is password protected. Please enter the password to
              watch.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-teal-900/50 text-center text-lg tracking-widest focus:ring-teal-500 focus:border-teal-500 h-12"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 font-semibold tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)]"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  UNLOCKING...
                </>
              ) : (
                "UNLOCK PREMIERE"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Restricted Access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Video Player Section */}
      <div className="flex-1 flex flex-col relative">
        <div className="w-full h-full min-h-[60vh] md:h-[80vh] bg-black flex items-center justify-center relative group">
          {episode.video_url ? (
            <video
              src={episode.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain max-h-screen"
              poster={episode.banner_image_url || episode.thumb_image_url}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">Video source not available</p>
              <Image
                src={
                  episode.banner_image_url ||
                  episode.thumb_image_url ||
                  "/placeholder.jpg"
                }
                width={800}
                height={450}
                alt={episode.title}
                className="rounded opacity-50 max-w-full h-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Episode Info */}
      <div className="bg-[#0a0a0a] p-6 md:p-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-900/50 text-teal-400 px-3 py-1 rounded text-xs font-bold tracking-wider border border-teal-500/20">
                  {episode.unique_episode_id}
                </span>
                <span className="text-gray-400 text-sm font-medium tracking-wide">
                  S{episode.season_number?.toString().padStart(2, "0")} E
                  {episode.episode_number?.toString().padStart(2, "0")}
                </span>
                {episode.runtime && (
                  <span className="text-gray-500 text-sm">
                    • {episode.runtime}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                {episode.title}
              </h1>

              <div className="prose prose-invert max-w-3xl">
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {episode.description}
                </p>
              </div>

              {episode.tags && episode.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {episode.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
