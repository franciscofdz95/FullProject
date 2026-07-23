export interface FtpFolder {
  name: string;
}

export interface FtpFile {
  fileName: string;
  lastModified: string;
  size: number;
}

export interface FtpFilePagination {
  folder: string;
  pageNumber: number;
  pageSize: number;
  forceRefresh?: boolean;
}
