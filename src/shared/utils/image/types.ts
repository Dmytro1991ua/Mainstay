export type HandleImageDropParams = {
  files: File[];
  onSetPreviewImage: (preview: string | null) => void;
};
