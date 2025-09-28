"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Sparkles, Clock, Bell } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState({
    experience: "",
    topics: [] as string[],
    frequency: "",
    notifications: false,
    reminderTime: "19:00",
  })

  const steps = [
    {
      title: "Welcome to Echo Journal!",
      subtitle: "Your thoughts, echoing through time",
      content: (
        <div className="text-center space-y-8">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-300 to-purple-400 bg-clip-text text-transparent mb-4 font-mono">
              echo journal
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-300/20 to-purple-400/20 blur-xl rounded-full" />
          </div>
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-400/20 to-purple-400/20 rounded-full flex items-center justify-center border border-slate-600/50">
              <Sparkles className="w-12 h-12 text-teal-300" />
            </div>
            <p className="text-lg text-slate-300 max-w-md mx-auto font-mono">
              A safe space for your thoughts to grow, reflect, and echo through your personal journey of self-discovery
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Let's personalize your journey",
      subtitle: "Help us understand your journaling style",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200">Journaling experience:</h3>
            <div className="grid grid-cols-1 gap-3">
              {["Beginner", "Sometimes", "Regular"].map((option) => (
                <Card
                  key={option}
                  className={`p-4 cursor-pointer transition-all duration-300 border ${
                    preferences.experience === option
                      ? "glass-button border-teal-400/50 shadow-lg shadow-teal-400/20"
                      : "glass-effect hover:shadow-md"
                  }`}
                  onClick={() => setPreferences((prev) => ({ ...prev, experience: option }))}
                >
                  <p className="text-center font-medium text-slate-100">{option}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200">Preferred topics:</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Self-reflection", "Goals", "Gratitude", "Emotions", "Creativity"].map((topic) => (
                <Card
                  key={topic}
                  className={`p-3 cursor-pointer transition-all duration-300 border ${
                    preferences.topics.includes(topic)
                      ? "bg-purple-400/10 border-purple-400/30 shadow-lg shadow-purple-400/10"
                      : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/30"
                  } backdrop-blur-sm`}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      topics: prev.topics.includes(topic)
                        ? prev.topics.filter((t) => t !== topic)
                        : [...prev.topics, topic],
                    }))
                  }
                >
                  <p className="text-center text-sm font-medium text-slate-100">{topic}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "How often would you like to journal?",
      subtitle: "Let's find your perfect rhythm",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { value: "daily", label: "Daily", description: "Every day, building a strong habit", emoji: "🌅" },
              { value: "few-times-week", label: "A few times a week", description: "Regular but flexible", emoji: "📝" },
              { value: "weekly", label: "Weekly", description: "Once a week for deeper reflection", emoji: "🌙" },
              { value: "whenever", label: "Whenever I feel like it", description: "No pressure, just when inspired", emoji: "✨" },
            ].map((option) => (
              <Card
                key={option.value}
                className={`p-4 cursor-pointer transition-all duration-300 border ${
                  preferences.frequency === option.value
                    ? "glass-button border-teal-400/50 shadow-lg shadow-teal-400/20"
                    : "glass-effect hover:shadow-md"
                }`}
                onClick={() => setPreferences((prev) => ({ ...prev, frequency: option.value }))}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <div>
                    <p className="font-medium text-slate-100">{option.label}</p>
                    <p className="text-sm text-slate-400">{option.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Notification preferences",
      subtitle: "How would you like to be reminded?",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-teal-300" />
                <span className="text-lg font-medium text-slate-200">Daily reminders</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, notifications: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-400"></div>
              </label>
            </div>
          </div>

          {preferences.notifications && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-teal-300" />
                <span className="text-lg font-medium text-slate-200">Reminder time</span>
              </div>
              <input
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => setPreferences((prev) => ({ ...prev, reminderTime: e.target.value }))}
                className="w-full p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-100 focus:border-teal-400/50 focus:outline-none"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: "You're all set!",
      subtitle: "Ready to start your journaling journey?",
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400/20 to-purple-400/20 rounded-full flex items-center justify-center border border-slate-600/50">
              <Sparkles className="w-10 h-10 text-teal-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-200">Your first personalized prompt:</h3>
            <Card className="p-6 bg-gradient-to-r from-teal-400/10 to-purple-400/10 border border-teal-400/20 backdrop-blur-sm">
              <p className="text-lg text-slate-200 italic font-mono">
                "What brought you joy today, and how did it make you feel in the moment?"
              </p>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    console.log("Next step clicked, currentStep:", currentStep, "steps.length:", steps.length)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log("Calling onComplete()")
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  console.log("OnboardingFlow render - currentStep:", currentStep, "total steps:", steps.length)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="p-8 glass-effect shadow-2xl">
          <div className="space-y-8">
            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-teal-400 shadow-lg shadow-teal-400/50"
                      : index < currentStep
                        ? "bg-purple-400"
                        : "bg-slate-600"
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-100 font-mono">{steps[currentStep].title}</h2>
              <p className="text-slate-300">{steps[currentStep].subtitle}</p>
            </div>

            <div className="min-h-[300px] flex items-center justify-center">{steps[currentStep].content}</div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-slate-300 hover:text-slate-100 disabled:opacity-50"
              >
                Back
              </Button>

              <Button
                onClick={nextStep}
                className="glass-button text-white px-8 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                {currentStep === steps.length - 1 ? "Start Journaling" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}