import { Page, Produto, ProdutoRequest } from "../types/produto";
import { del, get, post, put } from "./api";

export function getProducts(pageNumber: number, filter: string): Promise<Page<Produto>> {
  return get<Page<Produto>>(`/produtos/filtro?page=${pageNumber}&size=10&filtro=${filter}`);
}

export function getProductById(id: string): Promise<Produto> {
  return get<Produto>(`/produtos/${id}`);
}

export function createProduct(product: ProdutoRequest): Promise<Produto> {
  return post<Produto>(`/produtos`, product);
}

export function updateProduct(id: string, product: ProdutoRequest): Promise<Produto> {
  return put<Produto>(`/produtos/${id}`, product);
}

export function deleteProduct(id: string): Promise<void> {
  return del(`/produtos/${id}`);
}

export function isLastPage(page: Page<Produto>): boolean {
  return page.page.number + 1 >= page.page.totalPages;
}
