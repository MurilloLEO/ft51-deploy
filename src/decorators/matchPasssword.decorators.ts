import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({
    name: 'MatchPasssword',
    async: false,
})
export class MatchPasssword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments){
        if(password !== (args.object as any)[args.constraints[0]]) {
            return false;
        }
        return true;

    }
    defaultMessage(validationArguments?: ValidationArguments): string {
            return 'El password y la confirmacion no coinciden'
        }
}
    
