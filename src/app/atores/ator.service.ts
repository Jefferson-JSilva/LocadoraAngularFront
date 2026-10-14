import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Ator {
  id?: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class AtorService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/atores';

  listar() {
    return this.http.get<Ator[]>(this.url);
  }

  salvar(dados: Ator) {
    // O ID define se estamos cadastrando ou editando um registro.
    const corpo = { nome: dados.nome };
    if (dados.id !== undefined) {
      return this.http.put<Ator>(this.url + '/' + dados.id, corpo);
    }
    return this.http.post<Ator>(this.url, corpo);
  }

  excluir(id: number) {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
