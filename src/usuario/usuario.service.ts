import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Usuario } from "./usuario.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsuarioService {
    
    constructor (@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>) {}

    public async listarUsuarios(): Promise<Usuario[]> {
        return this.usuarioRepository.find();
    }
    
    public async buscarUsuariosPorId(idUsuario: number): Promise<Usuario> {
        return this.usuarioRepository.findOneBy({
            id: idUsuario
        });
    }

    public async buscarUsuarioPorNickname(nicknameUsuario: string): Promise<Usuario> {
        return this.usuarioRepository.findOne({
            //attributes: [ [ sequelize.fn('lower', sequelize.col('nickname')), 'nickname' ]], // Faz um select nos att 'nickname' do banco para transformá-los em toLower
            where: { nickname: nicknameUsuario.toLowerCase() }
        });
    }
    
    public async criar(usuario: Usuario): Promise<Usuario> {
        this.usuarioRepository.save(usuario);
        return usuario;
    }

    public async alterar(usuario: Usuario): Promise<Usuario> {
        this.usuarioRepository.save(usuario);
        return usuario;
    }

    public async apagar(usuario: Usuario) {
        this.usuarioRepository.remove(usuario);
    }

}