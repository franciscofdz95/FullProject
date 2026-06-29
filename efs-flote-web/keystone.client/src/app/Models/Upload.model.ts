export interface UploadedFile {
  name: string;
  status: 'success' | 'error' | 'pending' | 'skipped';
  message?: string;
  exists?: boolean;
  overwriteConfirmed?: boolean;
  validations?: ValidationResult;
  showErrors?: boolean;
}

export interface UploadableFile extends File {
  exists?: boolean;
  overwriteConfirmed?: boolean;
  isContract?: boolean;
  contractCheckMessage?: string;
  uploadDisabled?: boolean;
}

export interface ValidationResult {
  details?: ValidationDetailsResult[];
  errors?: string[];
  withErrors?: boolean;
}

export interface ValidationDetailsResult {
  field?: string;
  message?: string;
}

export interface ContractCheckResult {
  fileName: string;
  sfabraNum?: string;
  effectiveDate?: string;
  exists: boolean;
  isContract: boolean;
  message?: string;
}

