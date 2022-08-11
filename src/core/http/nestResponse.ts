export class NestResponse {
    status: number;
    headers: Object;
    body: Object;

    constructor(response: NestResponse) {
        // A linha abaixo atribui ao atual objeto da classe NestResponse (this) os dados passados pelo construtor (response)
        // O método build do NestResponseBuilder passa o objeto NestResponse já carregao para o contrutor. É justamente ele que chega aqui na variável response
        Object.assign(this, response);
    }
}