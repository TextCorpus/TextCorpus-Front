import { Afiliacao } from './Afiliacao';

export class  User {
    id_user: number;
    nome: string;
    email: string;
    senha: string;
    filiacoes: Afiliacao[]; 
    
    constructor (data:any ={}) {

        this.id_user = data?.id_user || 0;
        this.nome = data?.nome || '';
        this.email = data?.email || '';
        this.senha = data?.senha || '';
        this.filiacoes = data?.filiacoes || [];

        if (data?.afiliacoes && Array.isArray(data?.afiliacoes)) {
            for (const afiliacao of data?.afiliacoes) {
                this.filiacoes.push(new Afiliacao(afiliacao));
            }
        }
    }
  }