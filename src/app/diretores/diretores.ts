import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Diretor, DiretorService } from './diretor.service';

@Component({
  selector: 'app-diretores',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './diretores.html',
})
export class Diretores implements OnInit {
  registros: Diretor[] = [];
  formulario: Diretor = { nome: '' };
  sucesso = '';
  erro = '';
  carregando = false;
  salvando = false;
  private service = inject(DiretorService);
  private detector = inject(ChangeDetectorRef);

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.carregando = true;
    this.service.listar().subscribe({
      next: (registros) => {
        this.registros = registros;
        this.carregando = false;
        // Atualiza a tela após a resposta HTTP no Angular sem Zone.js.
        this.detector.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os registros. Verifique se o Spring Boot está executando em localhost:8080.';
        this.carregando = false;
        this.detector.markForCheck();
      },
    });
  }

  salvar() {
    if (this.salvando || this.carregando) return;
    if (!this.formulario.nome.trim()) {
      this.erro = 'Informe o nome.';
      this.sucesso = '';
      return;
    }
    this.sucesso = '';
    this.erro = '';
    this.salvando = true;
    const dados = { ...this.formulario, nome: this.formulario.nome.trim() };
    this.service.salvar(dados).subscribe({
      next: () => {
        this.sucesso = dados.id !== undefined ? 'Registro atualizado com sucesso.' : 'Registro cadastrado com sucesso.';
        this.formulario = { nome: '' };
        this.salvando = false;
        this.listar();
        this.detector.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível salvar o registro. Verifique a API e tente novamente.';
        this.salvando = false;
        this.detector.markForCheck();
      },
    });
  }

  editar(registro: Diretor) {
    // A cópia evita alterar a tabela antes de salvar na API.
    this.formulario = { ...registro };
    this.sucesso = '';
    this.erro = '';
  }

  cancelar() {
    this.formulario = { nome: '' };
    this.sucesso = '';
    this.erro = '';
  }

  excluir(registro: Diretor) {
    if (this.salvando || this.carregando || registro.id === undefined) return;
    if (!confirm('Deseja excluir "' + registro.nome + '"?')) return;
    this.sucesso = '';
    this.erro = '';
    this.salvando = true;
    this.service.excluir(registro.id).subscribe({
      next: () => {
        if (this.formulario.id === registro.id) this.formulario = { nome: '' };
        this.sucesso = 'Registro excluído com sucesso.';
        this.salvando = false;
        this.listar();
        this.detector.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível excluir o registro. Verifique a API e tente novamente.';
        this.salvando = false;
        this.detector.markForCheck();
      },
    });
  }
}
