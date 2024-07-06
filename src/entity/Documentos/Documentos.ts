export class Documentos {
    userid?: number;
    id_documento?: number;
    anoPublicacao?: number;
    projetoId?: number;
    titulo?: string;
    discente?: string;
    orientador?: string;
    resumo?: string;
    documentos?: Documentos[]; // Adiciona a propriedade documentos

    public constructor(data: any = {}) {
        this.userid = data?.userid || 0;
        this.id_documento = data?.id_documento || 0;
        this.anoPublicacao = data?.anoPublicacao || 0;
        this.projetoId = data?.projetoId || 0;
        this.titulo = data?.titulo || '';
        this.discente = data?.discente || '';
        this.orientador = data?.orientador || '';
        this.resumo = data?.resumo || '';
        // Inicializa a propriedade documentos se estiver presente
        this.documentos = data?.documentos ? data.documentos.map((doc: any) => new Documentos(doc)) : [];
    }
}
