import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsuarioService } from "./usuario.service";

@Injectable()
@ValidatorConstraint() // Deve omdocar qie a classe é um ValidatorConstraint
export class IsNicknameUnicoConstraint implements ValidatorConstraintInterface {
    
    constructor(private usuarioService: UsuarioService) {}

    validate(nickname: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        // Explicando os três exclamações da direita pra esquerda
        // Os dois primeiros exclamações (da dir para esq) convertem o valor booleano implicito do js para um valor explícito (True ou False).
        // Por exemplo, se o método não encontrasse o Usuario ele retornaria undefined (False implícito do js), mas após o !! ele vira False de fato
        // Por fim, o último exclamação é apenas a negação do valor, transformando True em False e vice-versa                
        return !!!this.usuarioService.buscarUsuarioPorNickname(nickname);
    }
}

export function IsNicknameUnico (validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) { // Os parâmetros são a classe da entidade que chama o decorator 'Usuario' e o noma da variável que a usa 'nickname'
        registerDecorator({
            target: object.constructor, // A instância do objeto que chama o decorator
            propertyName: propertyName, // O nome da variável que está usando esse decorator, no caso é o 'nickname'
            options: validationOptions, // As opções passadas no decorator, como 'message' por exemplo
            constraints: [], // Conjunto de regras que podemos definir para a validação
            validator: IsNicknameUnicoConstraint// Recebe uma função ou um tipo ValidatorConstraintInterface
        })
    }
}