
import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onNewBid: () => void
  onSearch: () => void
  onNextBid: () => void
  onPrevBid: () => void
}

export const KeyboardShortcuts = ({ onNewBid, onSearch, onNextBid, onPrevBid }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key.toLowerCase()) {
        case 'n':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault()
            onNewBid()
          }
          break
        case '/':
          event.preventDefault()
          onSearch()
          break
        case 'arrowright':
          if (event.altKey) {
            event.preventDefault()
            onNextBid()
          }
          break
        case 'arrowleft':
          if (event.altKey) {
            event.preventDefault()
            onPrevBid()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onNewBid, onSearch, onNextBid, onPrevBid])

  return null
}
