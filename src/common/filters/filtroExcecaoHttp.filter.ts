import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AbstractHttpAdapter, HttpAdapterHost } from "@nestjs/core";

// Implementando um filtro de excessão sem depender do 'express'

@Catch() // O decorator catch aceita um tipo específico de Exception como parâmetro. Como não passamos nada, ele considera qualquer tipo de exceção
export class FiltroExcecaoHttp implements ExceptionFilter {

    private httpAdapter: AbstractHttpAdapter;

    constructor(adapterHost: HttpAdapterHost) {
        this.httpAdapter = adapterHost.httpAdapter;
    }

    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();

        const { status, body } = exception instanceof HttpException ? // Isso é um if inline
        {
            status: exception.getStatus(),
            body: exception.getResponse()
        }
        : // Senão
        {
            status: HttpStatus.INTERNAL_SERVER_ERROR, // Retorna o status 500
            body: {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp: new Date().toISOString(),
                message: exception.message,
                path: request.path
            }
        };

        // Retorna a exception criada
        this.httpAdapter.reply(response, body, status);
    }

}