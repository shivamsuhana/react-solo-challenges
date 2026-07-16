/** Stub: Complete Challenge 12 (Error and Loading UX) per README. */
// ErrorDisplay — reusable error component
interface ErrorDisplayProps {
  error: string       
  onRetry?: () => void 
}

export default function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <div data-testid="error-display">
      <p>{props.error}</p>

      {props.onRetry && (
        <button
          data-testid="retry-btn"
          onClick={props.onRetry}
        >
          Retry
        </button>
      )}
    </div>
  )
}