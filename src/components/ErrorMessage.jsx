import './ErrorMessage.css'

function ErrorMessage({ message }) {
  // Nothing to show until something goes wrong
  if (!message) {
    return null
  }

  return (
    // role="alert" makes screen readers announce the error as soon as it appears
    <div className="error-message" role="alert">
      <strong className="error-message__title">Oops!</strong>
      <p className="error-message__text">{message}</p>
    </div>
  )
}

export default ErrorMessage
