export const STORYWEAVER_CATEGORIES = [
  'Fairy Tales',
  'Folk Tales',
  'Fables',
  'Adventure',
  'Animals',
  'Fantasy',
  'History',
  'Science',
  'Sports',
  'Mystery',
  'Humor',
  'Emotions',
  'Social Issues',
  'Nature',
  'Art & Music',
  'Culture',
  'Religion',
  'Diversity',
  'Disability',
  'Gender Equality',
  'Environment',
  'Life Skills',
  'Health',
  'Family',
  'Friendship',
  'School',
];

// StoryWeaver reading levels
export const STORYWEAVER_LEVELS = [
  'Level 1: Foundations',
  'Level 2: Early Reader',
  'Level 3: Intermediate',
  'Level 4: Advanced Reader',
];

// Map OPDS categories to StoryWeaver categories
export function mapCategoryToStoryWeaver(category: string): string | null {
  const normalized = category.toLowerCase().trim();
  
  const categoryMap: Record<string, string> = {
    'fairy tale': 'Fairy Tales',
    'folk tale': 'Folk Tales',
    'fable': 'Fables',
    'adventure': 'Adventure',
    'animal': 'Animals',
    'fantasy': 'Fantasy',
    'history': 'History',
    'science': 'Science',
    'sport': 'Sports',
    'mystery': 'Mystery',
    'humor': 'Humor',
    'emotion': 'Emotions',
    'social': 'Social Issues',
    'nature': 'Nature',
    'art': 'Art & Music',
    'music': 'Art & Music',
    'culture': 'Culture',
    'religion': 'Religion',
    'diversity': 'Diversity',
    'disability': 'Disability',
    'gender': 'Gender Equality',
    'environment': 'Environment',
    'skill': 'Life Skills',
    'health': 'Health',
    'family': 'Family',
    'friendship': 'Friendship',
    'school': 'School',
  };
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}
