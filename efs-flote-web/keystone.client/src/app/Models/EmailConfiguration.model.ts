
export interface EmailConfig {
  email_Configuration_ID: number;
  process_Keyword: string;
  process_Name: string;
  from_Email: string;
  sub: string;
  to_Email: string;
  cc_Email: string;
  bcc_Email: string;
  body_Content: string;
  processOwner: string;
  total_count?: number;
}

export interface EmailConfigPagination {
  pageNumber: number;
  pageSize: number;
}
