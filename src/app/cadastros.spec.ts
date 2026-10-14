import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { Atores } from './atores/atores';
import { Classes } from './classes/classes';
import { Diretores } from './diretores/diretores';

// Verifica os botões e as respostas HTTP simuladas sem alterar o PostgreSQL.
for (const tipo of ['atores', 'classes', 'diretores']) {
  describe('Cadastro de ' + tipo, () => {
    const componente = tipo === 'atores' ? Atores : tipo === 'classes' ? Classes : Diretores;
    const url = 'http://localhost:8080/' + tipo;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [componente],
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
    });

    afterEach(() => {
      TestBed.inject(HttpTestingController).verify();
      vi.restoreAllMocks();
    });

    function preparar() {
      const fixture = TestBed.createComponent<Atores | Classes | Diretores>(componente);
      const http = TestBed.inject(HttpTestingController);
      fixture.detectChanges();
      const consulta = http.expectOne(url);
      expect(consulta.request.method).toBe('GET');
      consulta.flush([]);
      fixture.detectChanges();
      return { fixture, http, tela: fixture.componentInstance };
    }

    it('cadastra pelo formulário, edita e exclui pelos botões', async () => {
      const { fixture, http, tela } = preparar();
      await fixture.whenStable();
      const html = fixture.nativeElement as HTMLElement;
      const nome = html.querySelector('input')!;
      nome.value = 'Cadastro de teste';
      nome.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      html.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      const cadastro = http.expectOne(url);
      expect(cadastro.request.method).toBe('POST');
      const dados = { nome: 'Cadastro de teste' };
      expect(cadastro.request.body).toEqual(dados);
      const registro = { id: 1, ...dados };
      cadastro.flush(registro);
      http.expectOne(url).flush([registro]);
      fixture.detectChanges();
      expect(html.querySelector('tbody')!.textContent).toContain(dados.nome);
      expect(tela.formulario.nome).toBe('');

      html.querySelector<HTMLButtonElement>('tbody button')!.click();
      fixture.detectChanges();
      expect(tela.formulario).toEqual(registro);
      nome.value = 'Nome atualizado';
      nome.dispatchEvent(new Event('input'));
      expect(tela.registros[0].nome).toBe('Cadastro de teste');
      html.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      const edicao = http.expectOne(url + '/1');
      expect(edicao.request.method).toBe('PUT');
      expect(edicao.request.body).toEqual({ ...dados, nome: 'Nome atualizado' });
      edicao.flush({ ...registro, nome: 'Nome atualizado' });
      http.expectOne(url).flush([{ ...registro, nome: 'Nome atualizado' }]);
      fixture.detectChanges();

      const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);
      html.querySelectorAll<HTMLButtonElement>('tbody button')[1].click();
      http.expectNone(url + '/1');
      confirmar.mockReturnValue(true);
      html.querySelectorAll<HTMLButtonElement>('tbody button')[1].click();
      const exclusao = http.expectOne(url + '/1');
      expect(exclusao.request.method).toBe('DELETE');
      exclusao.flush(null);
      http.expectOne(url).flush([]);
      fixture.detectChanges();
      expect(tela.registros).toEqual([]);
      expect(html.textContent).toContain('Registro excluído com sucesso.');
    });

    it('exibe falha da API e preserva o formulário quando salvar falha', () => {
      const { fixture, http, tela } = preparar();
      tela.formulario.nome = 'Teste';
      tela.salvar();
      http.expectOne(url).flush({}, { status: 500, statusText: 'Erro' });
      fixture.detectChanges();
      expect(tela.formulario.nome).toBe('Teste');
      expect(tela.salvando).toBe(false);
      expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')!.textContent)
        .toContain('Não foi possível salvar');
      tela.listar();
      http.expectOne(url).error(new ProgressEvent('error'));
      fixture.detectChanges();
      expect(tela.carregando).toBe(false);
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Não foi possível carregar');
    });
  });
}
