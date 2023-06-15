import { Component, OnDestroy } from '@angular/core';
import { EMPTY, Subscription, catchError, debounceTime, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroService } from 'src/app/service/livro.service';
import { FormControl } from '@angular/forms';

const PAUSA_DIGITACAO = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  campoBusca  = new FormControl();
  livro: Livro;
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  constructor(private service: LivroService) { }

  /* livrosEncontrados$ = this.campoBusca.valueChanges //$ indica que é um observable por convenção
  .pipe(
    debounceTime(PAUSA_DIGITACAO),                                         //tempo de espera para fazer a requisição
    tap         (console.log),                                             //mostra no console o que está sendo digitado
    filter      ((valorDigitado) => valorDigitado.length >= 3),            //limita quantidade de carcteres
    switchMap   ((valorDigitado) => this.service.buscar(valorDigitado)),   //switchMap cancela a requisição anterior
    map         ((items) => this.LivrosResultadoParaLivros(items)),         //mapeia os itens retornado da api e transforma na minha entidade
    catchError  ((erro) => {                                                //tratamento de erro
      console.log(erro);
        //return throwError(()=>new Error(this.mensagemErro='Erro ao buscar livros')) // retorna um observable com o erro
      return EMPTY;                                                         //retorna um observable vazio
    })
  ); */
totalDeLivros$ = this.campoBusca.valueChanges //$ indica que é um observable por convenção
.pipe(
  debounceTime(PAUSA_DIGITACAO),                                            //tempo de espera para fazer a requisição
  tap          (console.log),                                               //mostra no console o que está sendo digitado
  filter       ((valorDigitado) => valorDigitado.length >= 3),              //limita quantidade de carcteres
  switchMap    ((valorDigitado) => this.service.buscar(valorDigitado)),     //switchMap cancela a requisição anterior
  map          (resultado => this.livrosResultado = resultado),   //pega o resultado da api e transforma em um array
  catchError   (erro => {                                               //tratamento de erro
    console.log(erro);
    return of();                                                         //retorna um observable vazio
  }),
);

  livrosEncontrados$ = this.campoBusca.valueChanges //$ indica que é um observable por convenção
  .pipe(
    debounceTime(PAUSA_DIGITACAO),                                          //tempo de espera para fazer a requisição
    tap          (console.log),                                             //mostra no console o que está sendo digitado
    filter       ((valorDigitado) => valorDigitado.length >= 3),            //limita quantidade de carcteres
    switchMap    ((valorDigitado) => this.service.buscar(valorDigitado)),   //switchMap cancela a requisição anterior
    map          ((resultado: LivrosResultado) => resultado.items??[]),     //pega o resultado da api e transforma em um array
    map          ((items) => this.LivrosResultadoParaLivros(items)),        //mapeia os itens retornado da api e transforma na minha entidade
    catchError   ((erro) => {                                               //tratamento de erro
      console.log(erro);
        return throwError(()=>new Error(this.mensagemErro='Erro ao buscar livros')) // retorna um observable com o erro
      //return EMPTY;                                                         //retorna um observable vazio
    })
  );

  LivrosResultadoParaLivros(items): Livro[] {
    const livros: Livro[] = [];
    items.forEach(item => {
      livros.push(this.livro = {
        title        : item.volumeInfo?.title,
        authors      : item.volumeInfo?.authors,
        publisher    : item.volumeInfo?.publisher,
        publishedDate: item.volumeInfo?.publishedDate,
        description  : item.volumeInfo?.description,
        previewLink  : item.volumeInfo?.previewLink,
        thumbnail    : item.volumeInfo?.imageLinks?.thumbnail
      })
    }
    )
    return livros;
  }
}