// One Gutenberg block as WPGraphQL Content Blocks returns it (`editorBlocks(flat: false)`).
// `attributes` differs per block type, so each renderer reads only what it needs from it.
export interface EditorBlock {
  __typename: string;
  name: string;
  clientId: string;
  renderedHtml: string;
  attributes?: Record<string, unknown> | null;
  innerBlocks?: EditorBlock[] | null;
}

// What the post page shows: a titled section (a level-2 heading) and the blocks under it.
export interface PostSection {
  id: string;
  title: string;
  blocks: EditorBlock[];
}
