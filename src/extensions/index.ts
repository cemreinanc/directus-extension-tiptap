import type { AnyExtension, Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import type { CharacterCountOptions } from "@tiptap/extension-character-count";
import type { TextAlignOptions } from "@tiptap/extension-text-align";
import type { PlaceholderOptions } from "@tiptap/extension-placeholder";
import type { FocusOptions } from "@tiptap/extension-focus";
import type { TaskItemOptions } from "@tiptap/extension-task-item";
import type { TableOptions } from "@tiptap/extension-table";
import type { DeepPartial, Field } from "@directus/types";
import underline from "./underline";
import textAlign from "./text-align";
import characterCount from "./character-count";
import subscript from "./subscript";
import superscript from "./superscript";
import highlight from "./highlight";
import typography from "./typography";
import placeholder from "./placeholder";
import link from "./link";
import focus from "./focus";
import task from "./task";
import table from "./table";
import image from "./image";
import invisibleCharacters from "./invisible-characters";
import emoji from "./emoji";
import uniqueId, { type UniqueIDProps } from "./unique-id";

type ExtensionGroup = "mark" | "node" | "editor";

export const extensionsGroups: { group: ExtensionGroup; label: string }[] = [
  { group: "mark", label: "Marks" },
  { group: "node", label: "Nodes" },
  { group: "editor", label: "Editor" },
];

export type ExtensionsProps = {
  extensions: string[] | null;
  cdnURL: string | null;
  placeholder: PlaceholderOptions["placeholder"];
  characterCountLimit: CharacterCountOptions["limit"];
  characterCountMode: CharacterCountOptions["mode"];
  textAlignTypes: TextAlignOptions["types"];
  focusMode: FocusOptions["mode"];
  taskItemNested: TaskItemOptions["nested"];
  tableResizable: TableOptions["resizable"];
  emojiEnableEmoticons: boolean;
} & UniqueIDProps;

export interface ExtensionMeta<
  E extends AnyExtension = AnyExtension,
  O extends object = E["options"],
  P extends object = ExtensionsProps,
> {
  name: string;
  title: string;
  package: string;
  group: ExtensionGroup;
  options: DeepPartial<Field>[];
  load(props: P): PromiseLike<E> | E;
  defaults: Partial<O>;
}

export const extensionsMeta: ExtensionMeta[] = [
  // marks
  highlight,
  link,
  superscript,
  subscript,
  underline,
  // nodes
  table,
  image,
  task,
  textAlign,
  // editor
  placeholder,
  focus,
  typography,
  characterCount,
  // pro
  invisibleCharacters,
  emoji,
  uniqueId,
];

export async function loadExtensions(props: ExtensionsProps): Promise<Extensions> {
  const extensions: Extensions = [StarterKit];

  const exts = await Promise.all(
    extensionsMeta.filter((ext) => props.extensions?.includes(ext.name)).map((ext) => ext.load(props)),
  );

  extensions.push(...exts);

  return extensions;
}
