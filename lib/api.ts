// API configuration and data interfaces

const API_BASE_URL = process.env.NEXT_PUBLIC_RAILWAY_URL || 'http://localhost:3001/api'

// Data interfaces
export interface JournalEntry {
  _id?: string
  content: string
  title?: string
  mood: string
  moodScore: number
  entryType: 'free-write' | 'quick-thoughts' | 'emojis' | 'voice'
  tags: string[]
  quickAnswers?: {
    feeling: string
    grateful: string
    challenges: string
  }
  selectedEmojis?: string[]
  wordCount: number
  createdAt: string
  updatedAt: string
  promptId?: string
  isDraft: boolean
  isPrivate: boolean
}

export interface Prompt {
  _id: string
  title: string
  question: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  usageCount: number
  priority: number
  isActive: boolean
}

export interface Analytics {
  date: string
  dailyMood: string
  moodScore: number
  entriesCount: number
  totalWordCount: number
  currentStreak: number
  longestStreak: number
  writingTime: string
}

export interface DashboardData {
  streak: {
    current: number
    longest: number
  }
  thisWeeksWord: string
  nextMilestone: {
    target: number
    progress: number
    current: number
  }
  weeklyMood: Array<{
    day: string
    emoji: string
    mood: number
  }>
  insights: {
    totalEntries: number
    totalWords: number
  }
}

// Journal entries API calls
export const journalAPI = {
  async getEntries(page = 1, limit = 10, filters = {}): Promise<{entries: JournalEntry[], pagination: any}> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })

    const response = await fetch(`${API_BASE_URL}/entries?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch entries')
    }

    return response.json()
  },

  async getEntry(id: string): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch entry')
    }

    return response.json()
  },

  async createEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error('Failed to create entry')
    }

    return response.json()
  },

  async updateEntry(id: string, entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      throw new Error('Failed to update entry')
    }

    return response.json()
  },

  async deleteEntry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete entry')
    }
  },

  async getEntryStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/entries/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch entry stats')
    }

    return response.json()
  }
}

// Prompts API calls
export const promptsAPI = {
  async getPrompts(page = 1, limit = 10, filters = {}): Promise<{prompts: Prompt[], pagination: any}> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })

    const response = await fetch(`${API_BASE_URL}/prompts?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch prompts')
    }

    return response.json()
  },

  async getRandomPrompt(category?: string, difficulty?: string): Promise<Prompt> {
    const queryParams = new URLSearchParams()
    if (category) queryParams.append('category', category)
    if (difficulty) queryParams.append('difficulty', difficulty)

    const response = await fetch(`${API_BASE_URL}/prompts/random?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch random prompt')
    }

    return response.json()
  },

  async getDailyPrompt(): Promise<Prompt> {
    const response = await fetch(`${API_BASE_URL}/prompts/daily`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch daily prompt')
    }

    return response.json()
  },

  async getPersonalizedPrompt(preferences: any): Promise<Prompt> {
    const queryParams = new URLSearchParams(preferences)

    const response = await fetch(`${API_BASE_URL}/prompts/personalized?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch personalized prompt')
    }

    return response.json()
  }
}

// Analytics API calls
export const analyticsAPI = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }

    return response.json()
  },

  async getMoodTimeline(days = 7): Promise<Analytics[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/mood-timeline?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch mood timeline')
    }

    return response.json()
  },

  async getStreakData(): Promise<{currentStreak: number, longestStreak: number}> {
    const response = await fetch(`${API_BASE_URL}/analytics/streak`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch streak data')
    }

    return response.json()
  },

  async getInsights(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/insights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch insights')
    }

    return response.json()
  },

  async getTimeCapsule(months = 6): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/time-capsule?months=${months}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch time capsule data')
    }

    return response.json()
  }
}

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Fallback data for when API is not available - minimal realistic defaults
export const fallbackData = {
  dashboard: {
    streak: { current: 0, longest: 0 },
    thisWeeksWord: "Reflection",
    nextMilestone: { target: 7, progress: 0, current: 0 },
    weeklyMood: [
      { day: "Mon", emoji: "🌱", mood: 5 },
      { day: "Tue", emoji: "🌱", mood: 5 },
      { day: "Wed", emoji: "🌱", mood: 5 },
      { day: "Thu", emoji: "🌱", mood: 5 },
      { day: "Fri", emoji: "🌱", mood: 5 },
      { day: "Sat", emoji: "🌱", mood: 5 },
      { day: "Sun", emoji: "🌱", mood: 5 }
    ],
    insights: { totalEntries: 0, totalWords: 0 }
  },
  prompt: {
    _id: "fallback",
    title: "Welcome to Your Journey",
    question: "What's on your mind today? Take a moment to reflect on your thoughts and feelings.",
    category: "welcome",
    difficulty: "beginner" as const,
    tags: ["welcome", "reflection", "mindfulness"],
    usageCount: 0,
    priority: 10,
    isActive: true
  }
}
