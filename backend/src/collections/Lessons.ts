import type { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'day', 'isFree', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Danh mục bài tập',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Tên bài tập',
      type: 'text',
      required: true,
    },
    {
      name: 'day',
      label: 'Ngày học (Lịch Tết)',
      type: 'number',
      index: true, 
      admin: {
        position: 'sidebar',
        description: 'Nhập ngày hiển thị trên lịch (VD: 9, 10, ... 22).',
      },
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Tự động sinh ra từ Tên bài tập (để làm link)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.description) {
              return data.description.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'isFree',
      label: 'Học thử miễn phí',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Check vào đây nếu muốn bài này mở công khai cho tất cả mọi người.',
      },
    },
    {
      name: 'lyrics',
      label: 'Lời bài hát/Nội dung chi tiết',
      type: 'textarea',
      required: true,
    },
    {
      name: 'videoPlatform',
      label: 'Nền tảng Video',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'TikTok', value: 'tiktok' },
      ],
      defaultValue: 'youtube',
      required: true,
    },
    {
      name: 'videoUrl',
      label: 'Link Video',
      type: 'text',
      required: true,
      admin: {
        description: 'Dán link embed hoặc ID video',
      },
    },
    {
      name: 'buttonLink',
      label: 'Link nút bấm (Mua hàng/Xem thêm)',
      type: 'text',
      admin: {
        description: 'Đường link sẽ mở ra khi bấm nút dưới video',
      },
    },
    {
      name: 'content',
      label: 'Nội dung luyện tập',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: false, 
      },
      fields: [
        {
          name: 'phrase',
          label: 'Câu/Từ tiếng Anh',
          type: 'text',
          required: true,
        },
        {
          name: 'transcription',
          label: 'Phiên âm tiếng Việt',
          type: 'text',
        },
        {
          name: 'translation',
          label: 'Nghĩa tiếng Việt',
          type: 'text',
        },
        {
          name: 'difficulty',
          label: 'Độ khó',
          type: 'select',
          options: [
            { label: 'Dễ', value: 'easy' },
            { label: 'Trung bình', value: 'medium' },
            { label: 'Khó', value: 'hard' },
          ],
          defaultValue: 'easy',
        },
      ],
    },
  ],
}