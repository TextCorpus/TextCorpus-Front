// src/types.ts

export interface User {
  id_user: number;
  nome: string;
  email: string;
  senha: string;
  afiliacoes: Afiliacao[];
}

export interface Afiliacao {
  nome: string;
  endereco: string;
  cidade: string;
  bairro: string;
  uf: string;
  id_user: number;
}

// Definição da interface Documento
export interface Documento {
  id_documento: number;
  anoPublicacao: number;
  titulo: string;
  discente: string;
  orientador: string;
  resumo: string;
  palavraChave?: string[]; // Adiciona o campo palavraChave como opcional
  projeto?: number; 
}


// Definição da interface Projeto
export interface Projeto {
  id_projeto: number;
  titulo: string;
  ano_inicial: number;
  ano_final: number;
  descritor: boolean;
  usuario: boolean;
  documentos: Documento[];
}

export type Item = {
  id: number;
  name: string;
  address: string;
  city: string;
  uf: string;
  isEditing: boolean;
};


// tipos para datatable

export interface DataTableProps {
  columns: Column[];
  fetchEndpoint: string;
  createEndpoint: string;
  updateEndpoint: string;
  deleteEndpoint: string;
  infoText?: string; // Texto opcional a ser exibido no cabeçalho
  dynamicSelectEndpoint?: string; // Endpoint opcional para o selectDinamic
  dynamicSelectValueField?: string; // Campo usado como valor no selectDinamic
  dynamicSelectLabelField?: string; // Campo usado como label no selectDinamic
}

// export interface Column {
//   key: string; // A chave do dado na linha (ex: id, nome)
//   label: string; // O rótulo exibido na tabela
//   isKey?: boolean; // Se é a chave principal da linha
//   editable: boolean; // Se o campo é editável
//   elementType: 'input' | 'select' | 'textarea' | 'radiogroup' | 'selectDinamic'; // Tipo de elemento no formulário
//   dataType?: 'text' | 'number'; // Tipo de dado esperado no input
//   options?: { value: string | number; label: string }[]; // Opções usadas para select e radiogroup
// }

export interface Column {
  key: string;
  label: string;
  editable: boolean;
  isKey: boolean;
  dataType: string;
  elementType: "input" | "select" | "textarea" | "radiogroup" | "selectDinamic" | string; // Permitir qualquer string
  options?: { value: string | number; label: string }[]; // Para selects
}



export interface RowData {
  [key: string]: string | number | null | any[]; // Os dados das linhas podem ser strings, números, ou até arrays no caso do selectDinamic
}


// export interface Column {
//   key: string;
//   label: string;
//   editable: boolean;
//   isKey: boolean;
//   dataType?: 'string' | 'number'; // Restringe dataType para ser 'string' ou 'number'
//   elementType?: 'input' | 'textarea' | 'radiogroup' | 'select' | 'selectDinamic'; // Define tipos de elementos permitidos
//   options?: { value: string; label: string }[]; // Lista de opções para selects ou radiogroups
// }

// export interface RowData {
//   [key: string]: any;
// }

// export interface DataTableProps {
//   columns: DataTableColumn[]; // Definição das colunas da tabela
//   fetchEndpoint: string; // Endpoint para buscar os dados da tabela
//   createEndpoint: string; // Endpoint para criar um novo item
//   updateEndpoint: string; // Endpoint para atualizar um item existente
//   deleteEndpoint: string; // Endpoint para excluir um item
//   dynamicSelectEndpoint?: string; // Novo prop: Endpoint para buscar as opções dinâmicas do selectDinamic
//   infoText?: string; // Texto de informação exibido na tabela (opcional)
// }

// construção de nuvens de palavras 
export interface Word {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
}



