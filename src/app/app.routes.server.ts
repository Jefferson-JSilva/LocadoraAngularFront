import { RenderMode, ServerRoute } from '@angular/ssr';
// Os cadastros consultam a API no navegador, sem depender dela durante o build.
export const serverRoutes: ServerRoute[] = [
  { path: 'atores', renderMode: RenderMode.Client },
  { path: 'classes', renderMode: RenderMode.Client },
  { path: 'diretores', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
