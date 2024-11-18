import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

export type InputProps= Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> & {
    value: string,
    onChange: (val: string) => void,
}

export function Input({value, onChange, className, ...props}: InputProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>){
        onChange(event.target.value)
    }
    return <input {...props} value={value} className={className} onChange={handleChange}/>
}