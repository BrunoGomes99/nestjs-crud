import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNicknameUnico } from "./isNicknameUnico.validator";

@Entity({name: 'usuarios'})
export class Usuario {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        //type: DataType.STRING,
        nullable: false,
    })
    //@IsNicknameUnico({
    //    message: "Esse nickname já foi cadastrado"
    //})
    @IsNotEmpty({
        message: "Campo obrigatório"
    })
    @IsString({
        message: "Nickname precisa ser uma string"
    })
    nickname: string;



    @Column({
        //type: DataType.STRING(60),
        nullable: false,
    })
    @IsNotEmpty({
        message: "Campo obrigatório"
    })
    @IsEmail({},{
        message: "Email inválido"
    })
    email: string;



    @Column({
        //type: DataType.STRING,
        nullable: false,
    })   
    // O decorator expose permite mudar o nome da variável para outro na hora da request. Vamos passar 'password' na request, mas continueramos trabalhar como 'senha' no código
    @Expose({
        name: 'password'
    })
    // Esse decorator tá informando que essa variável seja excluída no que chama de 'plano', 
    // ou seja, após mandar a senha na requisição a mesma é desconsiderada na hora do response, pra evitar que esse dado importante trafegue na rede
    @Exclude({
        toPlainOnly: true
    })
    @IsNotEmpty({
        message: "Campo obrigatório"
    })    
    senha: string;



    @Column({
        //type: DataType.STRING,
        nullable: false,
    })
    @Expose({
        name: 'fullName'
    })
    @IsNotEmpty({
        message: "Campo obrigatório"
    })
    nome: string;



    
    @Column({
        //type: DataType.DATE,
        nullable: false,
    })
    @Expose({
        name: 'joinDate'
    })
    dataEntrada: Date;
}