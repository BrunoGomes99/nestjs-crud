import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IsNicknameUnicoConstraint } from "./isNicknameUnico.validator";
import { UsuarioController } from "./usuario.controller";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    controllers: [UsuarioController],
    providers: [
        UsuarioService,
        IsNicknameUnicoConstraint // Define também as classes de validação do usuário
    ],
    exports: [TypeOrmModule]
})
export class UsuarioModule {

}