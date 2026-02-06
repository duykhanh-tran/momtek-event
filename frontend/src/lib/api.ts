import axios from 'axios';
import { Lesson } from '@/types/lesson';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getLessons = async (): Promise<Lesson[]> => {
  try {
    const res = await axios.get(`${API_URL}/api/lessons`);
    return res.data.docs;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
};

export const getLessonBySlug = async (slug: string): Promise<Lesson | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/lessons?where[slug][equals]=${slug}`);
    if (res.data.docs.length > 0) {
      return res.data.docs[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching lesson detail:', error);
    return null;
  }
};