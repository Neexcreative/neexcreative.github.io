This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Git: commit e push para o GitHub

Passo a passo para subir suas alterações para o repositório no GitHub.

### 1. Verificar o que foi alterado

```bash
git status
```

### 2. Adicionar os arquivos alterados

```bash
# adicionar arquivos específicos (recomendado)
git add caminho/do/arquivo.ts

# ou adicionar tudo que foi modificado/criado
git add .
```

### 3. Criar o commit

```bash
git commit -m "new services galery"
```

### 4. Enviar (push) para o GitHub

```bash
# primeira vez enviando a branch atual
git push -u origin nome-da-branch

# nas próximas vezes, só
git push
```

### Fluxo comum com branch e Pull Request

```bash
# criar e mudar para uma nova branch a partir da main
git checkout -b feature/minha-mudanca

# ... editar arquivos ...

git add .
git commit -m "Minha mudança"
git push -u origin feature/minha-mudanca
```

Depois do push, abra o GitHub (ou rode `gh pr create`) para abrir um Pull Request da sua branch para a `main`.

### Comandos úteis

```bash
git status          # ver arquivos modificados/não rastreados
git diff             # ver as diferenças antes de commitar
git log --oneline    # ver o histórico de commits
git pull             # atualizar sua branch com o que está no GitHub
```
