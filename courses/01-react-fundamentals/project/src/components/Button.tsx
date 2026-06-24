interface ButtonProps {
  children: React.ReactNode        // button ke andar ka text k liye
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger'  
  disabled?: boolean               
  id?: string                      
}

export default function Button(props: ButtonProps) {
  return (
    <button
      id={props.id}
      type={props.type ?? 'button'}   
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}  
    </button>
  )
}