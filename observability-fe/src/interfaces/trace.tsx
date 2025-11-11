
export interface Trace {
  id: string;
  timestamp: Date;
  name: string;
  input: string;
  output: string;
  bookmarked?: boolean;
}