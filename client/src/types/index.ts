export interface Font {
  name: string;
  path: string;
  filename?: string;
  uploadedAt: string;
}

export interface FontRow {
  id: string;
  name: string;
  fontFile: string;
}

export interface FontGroup {
  id: string;
  title: string;
  fonts: FontRow[];
  createdAt: string;
  updatedAt?: string;
}
