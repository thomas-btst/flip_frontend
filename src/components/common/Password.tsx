import { Input, InputOptions } from "./Input";

export function Password<T extends string | number>(params: InputOptions<T>) {
    return (
        <Input
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Doit contenir au moins un nombre, une majuscule, une minuscule, et 8 charactères."
            {...params}
            required
        />
    )
}