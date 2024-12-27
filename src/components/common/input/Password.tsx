import { Input, InputProps } from "./Input";

export function Password(params: InputProps) {
    return (
        <Input
            type="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$"
            title="Doit contenir au moins un nombre, une majuscule, une minuscule, un charactère spécial et 12 charactères."
            {...params}
            required
        />
    )
}