import {
  BasicBlocksPlugin,
  BasicMarksPlugin,
} from "@platejs/basic-nodes/react";
import { MarkdownPlugin } from "@platejs/markdown";
import { ElementApi, type TNode } from "platejs";
import { createPlatePlugin } from "platejs/react";

import { generateDocumentNodeId } from "@/lib/document-model";

export const DocumentBlockIdPlugin = createPlatePlugin({
  key: "document-block-id",
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
  transforms: {
    normalizeNode([node, path]) {
      if (ElementApi.isElement(node) && editor.api.isBlock(node) && !node.id) {
        editor.tf.setNodes(
          {
            id: generateDocumentNodeId(),
          } satisfies Partial<TNode>,
          { at: path },
        );

        return;
      }

      normalizeNode([node, path]);
    },
  },
}));

export const ArticleEditorCorePlugins = [
  BasicBlocksPlugin,
  BasicMarksPlugin,
  MarkdownPlugin,
  DocumentBlockIdPlugin,
] as const;
