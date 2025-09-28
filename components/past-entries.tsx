"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Calendar, Smile, PenTool, Mic } from "lucide-react"
import { journalAPI, handleApiError } from "@/lib/api"
import type { JournalEntry } from "@/lib/api"

interface PastEntriesProps {
  onBack: () => void
}

export function PastEntries({ onBack }: PastEntriesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mood" | "date" | "type">("all")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Load entries on component mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true)
        const response = await journalAPI.getEntries(page, 10, {})
        setEntries(response.entries)
        setHasMore(response.pagination.page < response.pagination.pages)
      } catch (err) {
        console.error('Error loading entries:', err)
        setError(handleApiError(err))
        // Keep fallback entries when API fails
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [page])

  // Fallback entries if API fails
  const fallbackEntries = [
    {
      _id: "1",
      content: "Today I realized how much I've grown in the past year. The challenges that once seemed impossible now feel like stepping stones...",
      title: "Growth Reflection",
      mood: "😊",
      moodScore: 8,
      entryType: "free-write" as const,
      tags: ["growth", "reflection", "gratitude"],
      wordCount: 247,
      createdAt: "2024-01-07T00:00:00Z",
      updatedAt: "2024-01-07T00:00:00Z",
      isDraft: false,
      isPrivate: true
    },
    {
      _id: "2", 
      content: "😌 🌅 ☕ 📚 🧘‍♀️ 🌱 ✨",
      title: "Morning Vibes",
      mood: "😌",
      moodScore: 7,
      entryType: "emojis" as const,
      tags: ["morning", "peace", "routine"],
      wordCount: 0,
      createdAt: "2024-01-06T00:00:00Z",
      updatedAt: "2024-01-06T00:00:00Z",
      isDraft: false,
      isPrivate: true
    }
  ]

  const displayEntries = entries.length > 0 ? entries : fallbackEntries

  const getTypeIcon = (entryType: string) => {
    switch (entryType) {
      case "free-write":
        return PenTool
      case "emojis":
        return Smile
      case "voice":
        return Mic
      default:
        return PenTool
    }
  }

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      "😊": "bg-green-400",
      "😌": "bg-blue-400", 
      "😢": "bg-blue-600",
      "😡": "bg-red-400",
      "🤔": "bg-yellow-400",
      "✨": "bg-purple-400",
      "🌟": "bg-yellow-300",
      "🦋": "bg-pink-400",
      "🕊️": "bg-indigo-400",
      "🌱": "bg-green-300"
    }
    return moodColors[mood] || "bg-slate-400"
  }

  const filteredEntries = displayEntries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-slate-100">Past Entries</h1>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries, tags, or feelings..."
                className="pl-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
              />
            </div>

            <div className="flex space-x-2">
              {[
                { key: "all", label: "All", icon: Filter },
                { key: "date", label: "Date", icon: Calendar },
                { key: "mood", label: "Mood", icon: Smile },
                { key: "type", label: "Type", icon: PenTool },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={selectedFilter === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFilter(key as any)}
                  className={`transition-all duration-300 ${
                    selectedFilter === key
                      ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-100 border border-teal-400/30"
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Entries Timeline */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                        <div className="h-4 bg-slate-600 rounded w-32"></div>
                      </div>
                      <div className="h-4 bg-slate-600 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-600 rounded w-full"></div>
                      <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-slate-600 rounded-full w-16"></div>
                      <div className="h-6 bg-slate-600 rounded-full w-20"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const TypeIcon = getTypeIcon(entry.entryType)

              return (
                <Card
                  key={entry._id}
                  className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Entry Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`} />
                          <span className="text-sm text-slate-400">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-4 h-4 text-slate-400" />
                        {entry.wordCount > 0 && <span className="text-xs text-slate-400">{entry.wordCount} words</span>}
                      </div>
                    </div>

                    {/* Entry Preview */}
                    <div className="space-y-3">
                      <p className="text-slate-200 leading-relaxed group-hover:text-slate-100 transition-colors">
                        {entry.content.length > 200 ? entry.content.substring(0, 200) + '...' : entry.content}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <Card className="p-12 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-400/20 to-slate-500/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">No entries found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
