import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NestResponseBuilder } from "../core/http/nestResponseBuilder";
import { UsuarioController } from "./usuario.controller";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

const dataAtual = new Date();
const usuariosList: Usuario[] = [
    new Usuario({ id: 1, nickname: 'Bruno99', nome: 'Bruno Gomes', email: 'bruno@teste.com.br', senha: '123', dataEntrada: dataAtual }),
    new Usuario({ id: 2, nickname: 'BGomes', nome: 'Bruno Gomes', email: 'teste@bruno.com.br', senha: '321', dataEntrada: dataAtual }),
]

const bodyNewUser: Usuario = {
    id: 3,
    nickname: "Bruno Novo",
    email: "bruno.gomes@fasters.com.br",
    nome: "Bruno Rocha Gomes",
    senha: "12345",
    dataEntrada: dataAtual
}

const updatedUser: Usuario = {
    id: 1,
    nickname: "Bruno modificado",
    email: "bruno.gomes@fasters.com.br",
    nome: "Bruno Rocha Gomes",
    senha: "12345",
    dataEntrada: dataAtual
}

const responseBuilderCreate = new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${bodyNewUser.nickname}`
                    })
                    .addBody(bodyNewUser)
                    .build();

const responseBuilderUpdate = new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${updatedUser.nickname}`
                    })
                    .addBody(updatedUser)
                    .build();

describe('UsuarioController', () => {
    let usuarioController: UsuarioController;
    let usuarioService: UsuarioService;

    beforeEach(async () => {
        // Instancia o novo módulo exclusivamente para testes
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuarioController],
            providers: [
                {
                    provide: UsuarioService,
                    useValue: { // O método mockResolvedValue irá passar um valor mocado do que deve ser o retorno gerado
                        listarUsuarios: jest.fn().mockResolvedValue(usuariosList),
                        buscarUsuariosPorId: jest.fn().mockResolvedValue(usuariosList[0]),
                        buscarUsuarioPorNickname: jest.fn().mockResolvedValue(usuariosList[0]),
                        criar: jest.fn().mockResolvedValue(responseBuilderCreate),
                        alterar: jest.fn().mockResolvedValue(responseBuilderUpdate),
                        apagar: jest.fn().mockResolvedValue(undefined),
                    }
                }
            ]
        }).compile();

        // Instancia um usuarioController e usuarioService
        usuarioController = module.get<UsuarioController>(UsuarioController);
        usuarioService = module.get<UsuarioService>(UsuarioService);
    });

    it('should be defined', () => {
        expect(usuarioController).toBeDefined();
        expect(usuarioService).toBeDefined();
    });

    describe('Listar usuarios', () => {
        it('should return an users model list successfully', async () => {
            // Act
            const result = await usuarioController.listarUsuarios();

            // Assert
            expect(result).toEqual(usuariosList);
            expect(typeof result).toEqual('object');
            expect(result[0].id).toEqual(usuariosList[0].id);
            expect(usuarioService.listarUsuarios).toHaveBeenCalledTimes(1); // Checa se o método foi chamado só 1 vez (é o esperado)
        });

        // Testando o comportamento da função ao ocorrer um erro
        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'listarUsuarios').mockRejectedValueOnce(new Error()); // mockRejectedValueOnce irá alterar o valor mocado da função 1 VEZ SÓ para o que é passado no parâmetro ao forçar um erro na função

            // Assert
            expect(usuarioController.listarUsuarios()).rejects.toThrowError(); // O rejects diz pra função que assim que der erro, o controller deve fazer: um throw error
        });
    });

    describe('Listar usuário por nickname', () => {
        it('should return one user by nickname', async () => {
            // Act
            const result = await usuarioController.buscarUsuarioPorNickname('Bruno99');

            // Assert
            expect(result).toEqual(usuariosList[0]);
            expect(usuarioService.buscarUsuarioPorNickname).toHaveBeenCalledTimes(1);
            expect(usuarioService.buscarUsuarioPorNickname).toHaveBeenCalledWith('Bruno99');            
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'buscarUsuarioPorNickname').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioController.buscarUsuarioPorNickname('Bruno99')).rejects.toThrowError();
        });
    });

    describe('Buscar usuário por id', () => {
        it('should return one user by id', async () => {
            // Act
            const result = await usuarioService.buscarUsuariosPorId(usuariosList[0].id);

            // Assert
            expect(result).toEqual(usuariosList[0]);
            expect(usuarioService.buscarUsuariosPorId).toHaveBeenCalledTimes(1);
            expect(usuarioService.buscarUsuariosPorId).toHaveBeenCalledWith(1);  // Passa o id '1' como parâmetro         
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'buscarUsuariosPorId').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioService.buscarUsuariosPorId(1)).rejects.toThrowError();
        });
    });

    describe('Criar usuário', () => {
        const body: Usuario = {
            id: 3,
            nickname: "Bruno Novo",
            email: "bruno.gomes@fasters.com.br",
            nome: "Bruno Rocha Gomes",
            senha: "12345",
            dataEntrada: dataAtual
        }

        it('should create a new usuario item successfully', async () => {

            const responseBuilder = new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${body.nickname}`
                    })
                    .addBody(body)
                    .build();

            // Act
            const result = await usuarioController.criar(body);            
            
            //Assert
            expect(result.body).toEqual(responseBuilder);
            expect(usuarioService.criar).toHaveBeenCalledTimes(1);
            expect(usuarioService.criar).toHaveBeenCalledWith(body); // Passa o parametro que é passado no endpoint
        })

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'criar').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioController.criar(body)).rejects.toThrowError();
        });
    });

    describe('Alterar usuário', () => {
        const body: Usuario = {
            id: 1,
            nickname: "Bruno modificado",
            email: "bruno.gomes@fasters.com.br",
            nome: "Bruno Rocha Gomes",
            senha: "12345",
            dataEntrada: dataAtual
        }

        it('should update an usuario item successfully', async () => {

            const responseBuilder = new NestResponseBuilder()
                    .addStatus(HttpStatus.CREATED)
                    .addHeaders({
                        'Location': `/users/${body.nickname}`
                    })
                    .addBody(body)
                    .build();

            // Act
            const result = await usuarioController.alterar(body);

            //Assert
            expect(result.body).toEqual(responseBuilder);
            expect(usuarioService.alterar).toHaveBeenCalledTimes(1);
            expect(usuarioService.alterar).toHaveBeenCalledWith(body); // Passa o parametro que é passado no endpoint
        })

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'alterar').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioController.alterar(body)).rejects.toThrowError();
        });
    });

    describe('Remover usuário', () => {
        it('should remove a user item successfully', async () => {
            // Act
            const result = await usuarioController.apagar('1');

            // Assert
            expect(result).toBeUndefined();
        });

        it('should throw an exception', () => {
            // Arrange
            jest.spyOn(usuarioService, 'apagar').mockRejectedValueOnce(new Error());

            // Assert
            expect(usuarioController.apagar('1')).rejects.toThrowError();
        });

    });

});