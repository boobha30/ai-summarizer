import { useEffect, useState } from 'react'

const STORAGE_KEY = 'summary-history'
const MAX_ENTRIES = 20
const PREVIEW_LENGTH = 80

// Reads the saved history once when the app starts. localStorage can throw
// (e.g. blocked in private browsing) and the saved value could be broken JSON,
// so any problem just means "start with an empty history".
function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function useHistory() {
  // Passing the function (not calling it) means it only runs on the first render
  const [history, setHistory] = useState(loadHistory)

  // Save to localStorage every time the history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      // Saving can fail (storage full or blocked); the app still works, it just won't remember
      console.warn('Could not save history:', error)
    }
  }, [history])

  function addEntry({ text, length, summary }) {
    const trimmed = text.trim()
    const createdAt = Date.now()

    const entry = {
      id: createdAt,
      preview:
        trimmed.length > PREVIEW_LENGTH ? `${trimmed.slice(0, PREVIEW_LENGTH)}…` : trimmed,
      length,
      summary,
      createdAt,
    }

    // Newest first, and drop anything past the limit
    setHistory((previous) => [entry, ...previous].slice(0, MAX_ENTRIES))
  }

  function clearHistory() {
    setHistory([])
  }

  return { history, addEntry, clearHistory }
}

export default useHistory
