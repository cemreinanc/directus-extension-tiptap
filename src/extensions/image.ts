import type { IExtension } from "../extensions";
import { mergeAttributes, Node } from "@tiptap/core";
import { getPublicURL } from "../utils/get-root-path";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { id: string; alt?: string; filename?: string; title?: string }) => ReturnType;
    };
  }
}
export interface ImageOptions {
  publicURL: string;
  HTMLAttributes: Record<string, never>;
}

export const Image = Node.create<ImageOptions>({
  name: "image",
  inline: false,
  group: "block",
  draggable: true,

  addOptions() {
    return {
      publicURL: getPublicURL(),
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-directus-id"),
        renderHTML: (attributes) => {
          return {
            "data-directus-id": attributes.id,
          };
        },
      },
      alt: {
        default: null,
      },
      filename: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-directus-filename"),
        renderHTML: (attributes) => {
          if (!attributes.filename) {
            return {};
          }
          return {
            "data-directus-filename": attributes.filename,
          };
        },
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-directus-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const id = HTMLAttributes["data-directus-id"];
    const filename = HTMLAttributes["data-directus-filename"];
    const src = this.options.publicURL + "assets/" + id + (filename ? "/" + filename : "");
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { src })];
  },

  addCommands() {
    return {
      setImage:
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

const extension: IExtension<typeof Image> = {
  name: "image",
  title: "Image",
  package: "File Library",
  group: "node",
  defaults: {},
  options: [],
  load() {
    return Image;
  },
};

export default extension;
