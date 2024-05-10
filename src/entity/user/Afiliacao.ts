export class Afiliacao {

    id_perfil: number;
    noime: string;
    endereco: string;
    cidade: string;
    bairro: string;
    uf: string;
    id_user: number;

    public constructor(data: any = {}) {
        this.id_perfil = data?.id_perfil || 0;
        this.noime = data?.noime || '';
        this.endereco = data?.endereco || '';
        this.cidade = data?.cidade || '';
        this.bairro = data?.bairro || '';
        this.uf = data?.uf || '';
        this.id_user = data?.id_user || 0;
    }
    
}