import { ChangeEvent } from "react";

interface InputOptions<T>{
    value: T,
    onChange: (val: T) => void,
}

export function Input<T extends number | string>({value, onChange}: InputOptions<T>) {
    function handleChange(event: ChangeEvent<HTMLInputElement>){
        const newValue = event.target.value;
        onChange((typeof value === 'number' ? Number(newValue) : newValue) as T)
    }
    return <input value={value} onChange={handleChange}/>
}