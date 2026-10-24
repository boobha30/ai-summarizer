import './HistoryPanel.css'

function HistoryPanel({ history, onSelect, onClear }) {
  function handleClear() {
    // Clearing can't be undone, so ask first
    if (window.confirm("Delete all saved summaries? This can't be undone.")) {
      onClear()
    }
  }

  return (
    <section className="history-panel">
      <div className="history-panel__header">
        <h2 className="history-panel__title">History</h2>
        {history.length > 0 && (
          <button type="button" className="history-panel__clear" onClick={handleClear}>
            Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="history-panel__empty">
          No summaries yet. Your summaries will show up here.
        </p>
      ) : (
        <ul className="history-panel__list">
          {history.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="history-panel__item"
                onClick={() => onSelect(entry)}
              >
                <span className="history-panel__preview">{entry.preview}</span>
                <span className="history-panel__meta">
                  {entry.length} · {new Date(entry.createdAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default HistoryPanel
