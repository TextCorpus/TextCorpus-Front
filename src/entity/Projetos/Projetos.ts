export class Projetos {
    titulo?: string;
    userid?: number;
    ano_inicial?: number;
    ano_final?: number;
    id_projeto?: number;

    public constructor(data: any = {}) {
        this.titulo = data?.titulo || '';
        this.userid = data?.userid || 0;
        this.ano_inicial = data?.ano_inicial || 0;
        this.ano_final = data?.ano_final || 0;
        this.id_projeto = data?.id_projeto || 0;
    }
}