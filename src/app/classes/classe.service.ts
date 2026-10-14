import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Classe {
  id?: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/classes';

  listar() {
    return this.http.get<Classe[]>(this.url);
  }

  salvar(dados: Classe) {
    // O ID define se estamos cadastrando ou editando um registro.
    const corpo = { nome: dados.nome };
    if (dados.id !== undefined) {
      return this.http.put<Classe>(this.url + '/' + dados.id, corpo);
    }
    return this.http.post<Classe>(this.url, corpo);
  }

  excluir(id: number) {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
