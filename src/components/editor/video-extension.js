import { Node, mergeAttributes } from '@tiptap/core';

export const Video = Node.create({
  name: 'video',

  group: 'block',

  selectable: true,

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'video-wrapper' },
      [
        'video',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          controls: true,
          preload: 'metadata',
          class: 'w-full rounded-lg border border-border',
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
