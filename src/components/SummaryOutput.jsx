import './SummaryOutput.css'

// Matches lines that start with "* " or "- " (the model's way of writing bullets)
const BULLET_PATTERN = /^[*-] /

// Splits the summary into blocks: runs of bullet lines become a list, and runs
// of normal lines become a paragraph. A blank line ends the current paragraph.
function splitIntoBlocks(summary) {
  const blocks = []

  for (const rawLine of summary.split('\n')) {
    const line = rawLine.trim()
    const lastBlock = blocks[blocks.length - 1]

    if (line === '') {
      // Push an empty marker so the next text line starts a new paragraph
      if (lastBlock && lastBlock.type !== 'break') {
        blocks.push({ type: 'break' })
      }
    } else if (BULLET_PATTERN.test(line)) {
      const item = line.replace(BULLET_PATTERN, '')
      if (lastBlock?.type === 'list') {
        lastBlock.items.push(item)
      } else {
        blocks.push({ type: 'list', items: [item] })
      }
    } else if (lastBlock?.type === 'text') {
      lastBlock.lines.push(line)
    } else {
      blocks.push({ type: 'text', lines: [line] })
    }
  }

  return blocks.filter((block) => block.type !== 'break')
}

function SummaryOutput({ summary }) {
  // Nothing to show until a summary arrives
  if (!summary) {
    return null
  }

  const blocks = splitIntoBlocks(summary)

  return (
    <section className="summary-output">
      <h2 className="summary-output__title">Summary</h2>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className="summary-output__list">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        ) : (
          // Lines are joined with "\n"; the CSS keeps those line breaks visible
          <p key={index} className="summary-output__text">
            {block.lines.join('\n')}
          </p>
        ),
      )}
    </section>
  )
}

export default SummaryOutput
