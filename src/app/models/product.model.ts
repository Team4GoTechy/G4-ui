export interface Product {
    id?: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria?: string;
    categoriaId?: number;
    imagenUrl?: string;
}
