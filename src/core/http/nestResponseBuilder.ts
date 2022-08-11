import { NestResponse } from "./nestResponse";

export class NestResponseBuilder {
    // Cria um esqueleto do objeto nestResponse
    private response: NestResponse = {
        status: 200,
        headers: {},
        body: {}
    }

    public addStatus(status: number) {
        this.response.status = status; // Atribui o status passado no controller ao objeto response criado acima
        return this; // Retorna a classe NestResponseBuilder atualizada (com  status adicionados) para que possa ser chamada novamente para adicionar os outros parâmetros (body e header) 
    }

    public addHeaders(headers: Object) {
        this.response.headers = headers;
        return this;
    }

    public addBody(body: Object) {
        this.response.body = body;
        return this;
    }

    public build() {
        // Essa função retorna uma nova instância do NestResponse mas com as informações que já foram carregadas na variável response
        return new NestResponse(this.response);
    }
}