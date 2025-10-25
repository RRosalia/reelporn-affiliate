export type PostbackMethod = 'GET' | 'POST';
export type PostbackEvent = 'click' | 'registration' | 'conversion';

export interface Postback {
  id: string;
  url: string;
  method: PostbackMethod;
  events: PostbackEvent[];
  is_active: boolean;
  secret: string;
  headers: string[];
  body?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CreatePostbackRequest {
  url: string;
  method: PostbackMethod;
  events: PostbackEvent[];
  headers?: string[];
  body?: Record<string, string>;
}

export interface UpdatePostbackRequest {
  url?: string;
  method?: PostbackMethod;
  events?: PostbackEvent[];
  headers?: string[];
  body?: Record<string, string>;
}

export interface PostbackResponse {
  data: Postback;
}

export interface PostbacksListResponse {
  data: Postback[];
}
