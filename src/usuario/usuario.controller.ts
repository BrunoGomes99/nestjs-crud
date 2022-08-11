import { Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, Param, Post, Put, Res } from "@nestjs/common";
import { NestResponse } from "src/core/http/nestResponse";
import { NestResponseBuilder } from "src/core/http/nestResponseBuilder";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

@Controller('users')
export class UsuarioController {
    
    constructor(private usuarioService: UsuarioService){}

    @Get()
    public async listarUsuarios(): Promise<Usuario[]> {
        return this.usuarioService.listarUsuarios();
    }

    @Get(':nickDoUsuario') // O 'nomeDoUsuario' é passado na url, dessa forma: /users/nomeDoUsuario
    public async buscarUsuarioPorNickname(@Param('nickDoUsuario') nicknameUsuario: string): Promise<Usuario> { 
        const usuarioEncontrado = this.usuarioService.buscarUsuarioPorNickname(nicknameUsuario);
        
        if (!!!usuarioEncontrado){
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "Usuário não encontrado."
            });
        }

        return usuarioEncontrado;
    }

    @Post()
    public async criar(@Body() usuario: Usuario /*, @Res() response*/) : Promise<NestResponse> { // Quando se chama a response com o decorator @Res, o método deve ser void e não retornar nada
        //console.log(usuario['dataValues']);
        const usuarioCriado = await this.usuarioService.criar(usuario);            
        
        return new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${usuarioCriado.nickname}`
                    })
                    .addBody(usuarioCriado)
                    .build();

        //response.status(HttpStatus.CREATED)
        //        .location(`users/${usuarioCriado.nickname}`)
        //        .json(usuarioCriado);
    }

    @Put()
    async alterar(@Body() usuario: Usuario): Promise<NestResponse> {
        let usuarioEncontrado = await this.usuarioService.buscarUsuariosPorId(usuario.id);
        
        if (!!!usuarioEncontrado){
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "Usuário não encontrado."
            });
        }        

        //usuarioEncontrado.dataEntrada = usuario.dataEntrada;
        usuarioEncontrado.nome = usuario.nome;
        usuarioEncontrado.email = usuario.email;
        usuarioEncontrado.senha = usuario.senha;
        usuarioEncontrado.nickname = usuario.nickname;
        const usuarioAlterado = await this.usuarioService.alterar(usuarioEncontrado);

        return new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${usuarioAlterado.nickname}`
                    })
                    .addBody(usuarioAlterado)
                    .build();
    }

    @Delete(':id')
    async apagar(@Param() params): Promise<void> {
        const usuarioEncontrado = await this.usuarioService.buscarUsuariosPorId(params.id);        
        if (!!!usuarioEncontrado){
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "Usuário não encontrado."
            });
        }

        this.usuarioService.apagar(usuarioEncontrado);
    }
}