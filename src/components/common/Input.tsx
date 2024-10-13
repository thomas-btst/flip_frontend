import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

export type InputProps<T> = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> & {
    value: T,
    onChange: (val: T) => void,
}

export function Input<T extends number | string>({value, onChange, ...props}: InputProps<T>) {
    function handleChange(event: ChangeEvent<HTMLInputElement>){
        const newValue = event.target.value;
        onChange((typeof value === 'number' ? Number(newValue) : newValue) as T)
    }
    return <input {...props} className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring focus:border-blue-300" value={value} onChange={handleChange}/>
}