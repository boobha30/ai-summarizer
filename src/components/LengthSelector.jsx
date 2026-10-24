import './LengthSelector.css'

const lengths = ['Short', 'Medium', 'Detailed']

function LengthSelector({ length, onLengthChange }) {
  return (
    <section className="length-selector">
      {lengths.map((option) => (
        <button
          key={option}
          type="button"
          className={`length-selector__button ${
            length === option ? 'length-selector__button--active' : ''
          }`}
          onClick={() => onLengthChange(option)}
        >
          {option}
        </button>
      ))}
    </section>
  )
}

export default LengthSelector
