import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Diretor {
  id?: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class DiretorService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/diretores';

  listar() {
    return this.http.get<Diretor[]>(this.url);
  }

  salvar(dados: Diretor) {
    // O ID define se estamos cadastrando ou editando um registro.
    const corpo = { nome: dados.nome };
    if (dados.id !== undefined) {
      return this.http.put<Diretor>(this.url + '/' + dados.id, corpo);
    }
    return this.http.post<Diretor>(this.url, corpo);
  }

  excluir(id: number) {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
