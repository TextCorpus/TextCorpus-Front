import { Filiacao } from '../Filiacao/Filiacao';

export class  User {
    id_user: number;
    nome: string;
    email: string;
    senha: string;
    filiacoes: Filiacao[]; 
    
    constructor (data:any ={}) {

        this.id_user = data?.id_user || 0;
        this.nome = data?.nome || '';
        this.email = data?.email || '';
        this.senha = data?.senha || '';
        this.filiacoes = data?.filiacoes || [];

    }
  }