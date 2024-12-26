import { CommandStatus, CommandTranslation } from "../api/dto/CommandDto"
import { ProductTranslation, ProductType } from "../api/dto/Product"

type ProductTypeOptions = {value: ProductType, label: string}[]

export const selectProductTypeOptions: ProductTypeOptions = Array.from(ProductTranslation.entries()).map(([value, label]) => ({
    value,
    label,
}))

type CommandStatusOptions = {value: CommandStatus, label: string}[]

export const selectCommandStatusOptions: CommandStatusOptions = Array.from(CommandTranslation.entries()).map(([value, label]) => ({
    value,
    label,
}))