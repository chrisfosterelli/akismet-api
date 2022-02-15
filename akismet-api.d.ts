declare module "akismet-api" {
  // Main Akismet Client Class
  export class AkismetClient {
    constructor(options: AkismetClientOptions);

    verifyKey(
      callback?: (err: Error, isValid: boolean) => void
    ): Promise<boolean>;

    checkSpam(
      comment: Comment,
      callback?: (err: Error, isSpam: boolean) => void
    ): Promise<boolean>;

    submitSpam(
      comment: Comment,
      callback?: (err: Error) => void
    ): Promise<void>;

    submitHam(
      comment: Comment,
      callback?: (err: Error) => void
    ): Promise<void>;
  }

  // Legacy props
  export type Client = AkismetClient;
  export type client = (options: AkismetClientOptions) => AkismetClient;

  // Types
  interface AkismetClientOptions {
    blog: string;
    key: string;
    host?: string;
    protocol?: string;
    version?: string;
    userAgent?: string;
  
    blog_lang?: string;
    lang?: string; // Alias for prev prop 
    
    blog_charset?: string;
    charset?: string; // Alias for prev prop 
  }

  // Require only one of these two types
  type Comment = (CommentWithIP) | (CommentWithUserIP);

  // BaseComment with either `ip` or `user_up`
  type CommentWithIP = { ip: string; } & BaseComment;
  type CommentWithUserIP = { user_ip: string; } & BaseComment;

  // BaseComment is composed of Allowed Keys, all optional
  type BaseComment = 
    Partial<Record<CommentKeys, string>> 
    & Partial<Record<TestKeys, boolean | string>>;

  // Allowed Keys
  type TestKeys = 'is_test' | 'isTest';
  
  type CommentKeys = 'user_ip' | 'ip'
    | 'user_agent' | 'useragent'
    | 'referrer' | 'referer'
    | 'comment_author' | 'name'
    | 'comment_author_email' | 'email'
    | 'comment_content' | 'content'
    | 'comment_type' | 'type'
    | 'comment_date_gmt' | 'date'
    | 'permalink'
    | 'comment_post_modified_gmt' | 'permalinkDate'
    | 'comment_author_url' | 'url'
    | 'user_role' | 'role';
}