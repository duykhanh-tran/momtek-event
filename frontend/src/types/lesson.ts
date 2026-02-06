export interface ContentItem {
  id: string;
  phrase: string;
  transcription?: string;
  translation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Lesson {
  id: string;
  title: string;       // Danh mục (Category)
  description: string; // Tên bài học
  slug: string;
  isFree: boolean;     // Trạng thái khóa học
  lyrics: string;
  videoPlatform: 'youtube' | 'tiktok';
  videoUrl: string;
  buttonLink?: string;
  content: ContentItem[]; // Danh sách câu thoại
}