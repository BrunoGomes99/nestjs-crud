import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { AbstractHttpAdapter, HttpAdapterHost } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { NestResponse } from "./nestResponse";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    private httpAdapter: AbstractHttpAdapter;

    constructor(adapterHost: HttpAdapterHost) {
        this.httpAdapter = adapterHost.httpAdapter;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle() // O método handle diz pro interceptor ir logo para o controller (não vai interceptar na entrada)
                   .pipe( // Já o pipe vai interceptar a resposta do controller, na saída
                        map( (controllerResponse: Object) => {
                            // Se a resposta for NestRepsponse precisamos fazer as devidas configurações
                            if (controllerResponse instanceof NestResponse) {
                                const contexto = context.switchToHttp();
                                const response = contexto.getResponse();
                                const { status, headers, body } = controllerResponse; // Vai mapear cada variável vinda de controllerResponse, pois elas tem o mesmo nome

                                // O método getOwnPropertyNames irá retornar o nome/label de todos os headers vindos do controllerResponse
                                const headersNames = Object.getOwnPropertyNames(headers);

                                headersNames.forEach(headerName => {
                                    // Retorna o valor do cabeçalho atual
                                    const headerValue = headers[headerName];
                                    this.httpAdapter.setHeader(response, headerName, headerValue);
                                });

                                // Define o status da resposta http
                                this.httpAdapter.status(response, status);

                                // retorna o corpo da response
                                return body;
                            }

                            //Se a response não for NestResponse, só retorna a resposta do controller direto
                            return controllerResponse
                        })
                   )
    }

}