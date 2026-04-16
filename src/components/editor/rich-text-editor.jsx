"use client";

import { Video } from "@/components/editor/video-extension";
import { Button } from "@/components/ui/button";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  Video as VideoIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addVideo = () => {
    const url = window.prompt("Enter Video URL");

    if (url) {
      editor.commands.setVideo({ src: url });
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-[#1a1a1a] rounded-t-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={
          editor.isActive("link")
            ? "bg-teal-500/20 text-teal-400"
            : "text-gray-400"
        }
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        className="text-gray-400"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addYoutubeVideo}
        className="text-gray-400"
      >
        <YoutubeIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addVideo}
        className="text-gray-400"
      >
        <VideoIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        className="text-gray-400"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        className="text-gray-400"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, editable = true }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Video,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: content,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        className:
          "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-gray-300",
      },
    },
  });

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-[#111111]">
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
