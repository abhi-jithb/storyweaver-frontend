export const STORYWEAVER_CATEGORIES = [
    'Animal Stories',
    'Family and Friends',
    'Adventure and Mystery',
    'Humour',
    'School Stories',
    'Scary',
    'Science',
    'Read-Aloud',
    'History and Culture',
    'Maths',
    'Social Issues',
    'Health and Hygiene',
    'Climate Change',
    'Social Emotional Learning',
    'Professions',
  ];
  
  
  export const STORYWEAVER_LEVELS = [
    'Level 1: Foundations',
    'Level 2: Early Reader',
    'Level 3: Intermediate',
    'Level 4: Advanced Reader',
  ];
  
  export function mapCategoryToStoryWeaver(category: string): string | null {
    const normalized = category.toLowerCase().trim();
  
    const categoryMap: Record<string, string> = {
      // Animal Stories
      'animal stories': 'Animal Stories',
      'animal story': 'Animal Stories',
      'animals': 'Animal Stories',
      'animal': 'Animal Stories',
  
      // Family and Friends
      'family and friends': 'Family and Friends',
      'family': 'Family and Friends',
      'friends': 'Family and Friends',
      'friendship': 'Family and Friends',
      'home': 'Family and Friends',
      'relationship': 'Family and Friends',
  
      // Adventure and Mystery
      'adventure and mystery': 'Adventure and Mystery',
      'adventure': 'Adventure and Mystery',
      'mystery': 'Adventure and Mystery',
      'journey': 'Adventure and Mystery',
      'explore': 'Adventure and Mystery',
      'sports': 'Adventure and Mystery',
  
      // Humour
      'humor': 'Humour',
      'humour': 'Humour',
      'funny': 'Humour',
      'silly': 'Humour',
      'joke': 'Humour',
  
      // School Stories
      'school stories': 'School Stories',
      'school': 'School Stories',
      'classroom': 'School Stories',
      'teacher': 'School Stories',
  
      // Scary
      'scary': 'Scary',
      'horror': 'Scary',
      'ghost': 'Scary',
      'spooky': 'Scary',
  
      // Science
      'science': 'Science',
      'stem': 'Science',
      'experiment': 'Science',
      'technology': 'Science',
  
      // Read-Aloud
      'read-aloud': 'Read-Aloud',
      'read aloud': 'Read-Aloud',
      'readaloud': 'Read-Aloud',
      'storytime': 'Read-Aloud',
  
      // History and Culture
      'history and culture': 'History and Culture',
      'history': 'History and Culture',
      'culture': 'History and Culture',
      'tradition': 'History and Culture',
      'fairy tale': 'History and Culture',
      'fairy tales': 'History and Culture',
      'folk tale': 'History and Culture',
      'folk tales': 'History and Culture',
      'fable': 'History and Culture',
      'fables': 'History and Culture',
      'myth': 'History and Culture',
      'legend': 'History and Culture',
      'religion': 'History and Culture',
      'art': 'History and Culture',
      'music': 'History and Culture',
  
      // Maths
      'maths': 'Maths',
      'math': 'Maths',
      'numbers': 'Maths',
      'counting': 'Maths',
  
      // Social Issues
      'social issues': 'Social Issues',
      'social issue': 'Social Issues',
      'social': 'Social Issues',
      'inequality': 'Social Issues',
      'poverty': 'Social Issues',
      'gender equality': 'Social Issues',
      'gender': 'Social Issues',
      'diversity': 'Social Issues',
      'disability': 'Social Issues',
  
      // Health and Hygiene
      'health and hygiene': 'Health and Hygiene',
      'health': 'Health and Hygiene',
      'hygiene': 'Health and Hygiene',
      'nutrition': 'Health and Hygiene',
  
      // Climate Change
      'climate change': 'Climate Change',
      'environment': 'Climate Change',
      'nature': 'Climate Change',
      'pollution': 'Climate Change',
  
      // Social Emotional Learning
      'social emotional learning': 'Social Emotional Learning',
      'sel': 'Social Emotional Learning',
      'emotion': 'Social Emotional Learning',
      'emotions': 'Social Emotional Learning',
      'feelings': 'Social Emotional Learning',
      'life skills': 'Social Emotional Learning',
  
      // Professions
      'professions': 'Professions',
      'profession': 'Professions',
      'jobs': 'Professions',
      'career': 'Professions',
    };
  
    for (const [key, value] of Object.entries(categoryMap)) {
      if (normalized === key || normalized.includes(key)) {
        return value;
      }
    }
  
    return null;
  }
  