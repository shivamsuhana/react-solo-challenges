interface FormInputProps {
  label?: string                   
  id?: string                      
  value: string                    
  onChange: (value: string) => void 
  type?: string                    
  placeholder?: string             
  error?: string                  
}

export default function FormInput(props: FormInputProps) {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.id}>{props.label}</label>
      )}

      <input
        id={props.id}
        type={props.type ?? 'text'}  
        value={props.value}
        onChange={e => props.onChange(e.target.value)}  
        placeholder={props.placeholder}
      />

      {props.error && (
        <p id="task-form-error">{props.error}</p>
      )}
    </div>
  )
}