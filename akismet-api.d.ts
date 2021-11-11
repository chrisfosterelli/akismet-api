declare module "akismet-api" {
  // Type definitions for akismet-api 5.2.1
  // Definitions by: Jason Florentino https://github.com/jasonflorentino

  // Main Akismet Client Class
  export class AkismetClient {
    constructor(options: AkismetClientOptions);

    verifyKey(callback?: () => void): void;

    checkSpam(comment: Comment, callback?: () => void): boolean;
    submitSpam(comment: Comment, callback?: () => void): void;
    submitHam(comment: Comment, callback?: () => void): void;
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