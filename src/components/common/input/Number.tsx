import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, InputProps } from "./Input";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type InputNumberProps = Omit<InputProps, 'value' | 'onChange'> & {
    decimal: number,
    value?: string | undefined,
    onChange: (val: string | undefined) => void,
}

export function InputNumber({value, onChange, decimal = 0, ...props}: InputNumberProps) {
    function handleChange(value: string) {
        if(value.length === 0)
            onChange(undefined)
        else {
            let val = value.replace(',', '.')
            if(decimal === 0)
                val = val.replace('.', '')
            if(!Number.isNaN(+val) && +val >= 0 && (val.split('.', 2)[1]?.length ?? 0) <= decimal)
                onChange(val)
        }
    }
    return <div className="relative">
        <Input value={value ?? ""} onChange={handleChange} type="number" {...props}/>
        <button disabled={value === undefined} className="absolute right-4 inset-y-0 disabled:opacity-0" onClick={() => {onChange(undefined)}}>
            <FontAwesomeIcon className="text-lg text-gray-600" icon={faXmark}/>
        </button>
    </div>
}