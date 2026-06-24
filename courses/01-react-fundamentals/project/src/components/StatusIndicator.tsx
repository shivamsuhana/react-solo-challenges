interface StatusIndicatorProps {
  status: 'overdue' | 'due-today' | 'due-soon' | 'completed'  
}

export default function StatusIndicator(props: StatusIndicatorProps) {
  return (
    <span data-status={props.status}>
      {props.status === 'overdue' && 'Overdue'}
      {props.status === 'due-today' && 'Due Today'}
      {props.status === 'due-soon' && 'Due Soon'}
      {props.status === 'completed' && 'Completed'}
    </span>
  )
}