# Estado técnico — 12/09/2026

Projeto Next.js 16.2.10. Alterações locais, ainda não publicadas.

## Mudanças
- src/lib/metadata.ts centraliza OG/Twitter/canonical em todas as páginas, mantendo capas de artigos e título absoluto de Web Design.
- Template de title reduzido para assunto + Neex Creative.
- AnimateIn agora é HTML de servidor com animação CSS discreta. Conteúdo não depende de opacity:0/hidratação; framer-motion deixou de ser importado pelo site (pacote mantido para evitar alteração desnecessária no lockfile).
- Hero preserva o texto e quality=50 definidos no projeto; configura qualities [50,75], loading eager e fetchPriority high.
- Ícones liberados no robots; sitemap deixa de inventar lastmod a cada build.
- Markdown preserva a consulta q do blog e retorna no-store para navegador e CDNs.

## Validação
Build e lint passaram. As 17 rotas do sitemap passaram em metadados, HTML visível, Markdown, requisição com ETag do HTML e alternância de formato. Testados também busca com/sem resultados, 404 e imagem q=50. Menu e contato conferidos a 390 px. Sem nova pontuação de PageSpeed: melhorias ainda locais.

## Comandos reutilizáveis
Com o build em execução na porta 3199:

    node scripts/verify-seo.mjs

Para verificar uma implantação no PowerShell:

    $env:SITE_URL = 'https://URL-DO-PREVIEW'
    node scripts/verify-seo.mjs --strict-vary

## Pendência real de cache
O teste estrito falha enquanto o HTML perder Vary: Accept. Next.js 16.2.10 sobrescreve o cabeçalho das páginas, inclusive o declarado em next.config.ts. Issue confirmado: https://github.com/vercel/next.js/issues/85999.
As respostas Markdown têm no-store (Cache-Control, CDN-Cache-Control e Vercel-CDN-Cache-Control). Isso não comprova isolamento de todos os caches de produção. Resolver na camada final de entrega ou em versão do framework com correção verificada; não publicar alegando que a pendência está resolvida. Não foi aplicado patch em node_modules nem desabilitado o prerender de todo o site.

## Próxima etapa estrutural
Preservar alterações existentes do usuário, em especial Hero.tsx. Metadados de novas páginas devem usar withSocialMetadata e canonical próprio. Criar estudos de caso/autoria somente com informações reais. Privacidade depende de confirmação de práticas de formulário e retenção. Publicação e Search Console ainda pendentes.
