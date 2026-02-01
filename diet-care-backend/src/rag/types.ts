export type ChunkMetadata = {
  source: string;
  chapter?: string | null;
  topic?: string | null;
  language: string;
};

export type Chunk = {
  content: string;
  metadata: ChunkMetadata;
};

export type IngestOptions = {
  inputPath: string;
  source: string;
  language: string;
  dryRun?: boolean;
};
