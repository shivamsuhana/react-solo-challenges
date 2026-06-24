interface BadgeProps {
  children: React.ReactNode        // badge ke andar ka text
  variant?: 'tag' | 'category' | 'priority' 
}

export default function Badge(props: BadgeProps) {
  return (
    <span data-variant={props.variant}>
      {props.children}
    </span>
  )
}