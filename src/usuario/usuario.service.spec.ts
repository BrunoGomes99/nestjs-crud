import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

const dataAtual = new Date();
const usuariosList: Usuario[] = [
    new Usuario({ id: 1, nickname: 'Bruno99', nome: 'Bruno Gomes', email: 'bruno@teste.com.br', senha: '123', dataEntrada: dataAtual }),
    new Usuario({ id: 2, nickname: 'BGomes', nome: 'Bruno Gomes', email: 'teste@bruno.com.br', senha: '321', dataEntrada: dataAtual }),
]

const usuarioUpdated: Usuario = new Usuario({ 
    id: 1, 
    nickname: 'Nexbru', 
    nome: 'Bruno Gomes', 
    email: 'bruno@teste.com.br', 
    senha: '123', 
    dataEntrada: dataAtual 
});

describe('UsuarioService', () => {    
    let usuarioService: UsuarioService;
    let usuarioRepository: Repository<Usuario>;

    beforeEach(async () => {
        // Instancia o novo módulo exclusivamente para testes
        const module: TestingModule = await Test.createTestingModule({            
            providers: [
                UsuarioService,
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: { // O método mockResolvedValue irá passar um valor mocado do que deve ser o retorno gerado
                        find: jest.fn().mockResolvedValue(usuariosList),
                        findOneBy: jest.fn().mockResolvedValue(usuariosList[0]),
                        findOne: jest.fn().mockResolvedValue(usuariosList[0]),
                        save: jest.fn().mockResolvedValue(usuariosList[0]),
                        remove: jest.fn().mockResolvedValue(undefined),
                    }                    
                }
            ]
        }).compile();

        // Instancia um usuarioRepository e usuarioService
        usuarioService = module.get<UsuarioService>(UsuarioService);
        usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    });

    it('should be defined', () => {
        expect(usuarioRepository).toBeDefined();
        expect(usuarioService).toBeDefined();
    });

    describe('Listar usuários', () => {
        it('should return an users list', async () => {
            // Act
            const result = await usuarioService.listarUsuarios();

            //Assert
            expect(result).toEqual(usuariosList);
            expect(usuarioRepository.find).toHaveBeenCalledTimes(1);
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'find').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.listarUsuarios()).rejects.toThrowError();
        });
    });
    
    describe('Buscar usuário por Id', () => {
        it('should return an user by id', async () => {
            // Act
            const result = await usuarioService.buscarUsuariosPorId(1);

            //Assert
            expect(result).toEqual(usuariosList[0]);
            expect(usuarioRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({"id": 1});
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'findOneBy').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.buscarUsuariosPorId(1)).rejects.toThrowError();
        });
    });

    describe('Buscar usuário por nickname', () => {
        it('should return an user by nickname', async () => {
            // Act
            const result = await usuarioService.buscarUsuarioPorNickname("Bruno99");

            //Assert
            expect(result).toEqual(usuariosList[0]);
            expect(usuarioRepository.findOne).toHaveBeenCalledTimes(1);            
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'findOne').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.buscarUsuarioPorNickname("Bruno99")).rejects.toThrowError();
        });
    });

    describe('Criar usuário', () => {
        const body: Usuario = { id: 1, nickname: 'Bruno99', nome: 'Bruno Gomes', email: 'bruno@teste.com.br', senha: '123', dataEntrada: dataAtual }
        
        it('should create a new user', async () => {

            // Act
            const result = await usuarioService.criar(body);

            //Assert
            expect(result).toEqual(usuariosList[0]);
            expect(usuarioRepository.save).toHaveBeenCalledTimes(1);            
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'save').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.criar(body)).rejects.toThrowError();
        });
    });

    describe('Alterar usuário', () => {    
        const body: Usuario = { 
            id: 1, 
            nickname: 'Nexbru', 
            nome: 'Bruno Gomes', 
            email: 'bruno@teste.com.br', 
            senha: '123', 
            dataEntrada: dataAtual 
        };

        it('should update an user', async () => {
            
            // Arrange
            jest.spyOn(usuarioRepository, 'save').mockRejectedValueOnce(usuarioUpdated);

            // Act
            const result = await usuarioService.alterar(body);

            //Assert
            expect(result).toEqual(usuarioUpdated);
            expect(usuarioRepository.save).toHaveBeenCalledTimes(1);            
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'save').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.alterar(body)).rejects.toThrowError();
        });
    });

    describe('Excluir usuário', () => {    
        const body: Usuario = { 
            id: 1, 
            nickname: 'Bruno99', 
            nome: 'Bruno Gomes', 
            email: 'bruno@teste.com.br', 
            senha: '123', 
            dataEntrada: dataAtual 
        };

        
        it('should remove an user', async () => {        
            // Act
            const result = await usuarioService.apagar(body);

            //Assert
            expect(result).toBeUndefined();
            expect(usuarioRepository.remove).toHaveBeenCalledTimes(1);
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioRepository, 'remove').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.apagar(body)).rejects.toThrowError();
        });
    });
});