export interface ISanitizationLog {
  truncated_in: boolean;
  removed_zero_width: number;
  unicode_nfkc: boolean;
  homoglyph_folds: number;
  decoded?: string;
  clamped_runs: boolean;
  truncated_out: boolean;
  sanitizedAndDeobfuscated: boolean;
}

export interface IInjectedData {
  rawMessage: string;
  cleanedMessage: string;
  sanitizationLog: ISanitizationLog;
  thread_id?: string;
}