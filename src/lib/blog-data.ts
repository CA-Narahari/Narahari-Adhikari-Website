export interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
}
