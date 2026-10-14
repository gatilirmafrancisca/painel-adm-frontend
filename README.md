# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Testar sem backend (modo demo)

Para ver as telas sem subir o backend, rode:

```bash
npm run dev:mock
```

Ou defina `VITE_MOCK_API=true` no seu `.env` e rode `npm run dev`.

No modo demo:

- o login aceita qualquer usuário e senha;
- `/gatos` e `/rifasolidaria` mostram dados de teste (`app/mocks/mockData.ts`);
- cadastrar e excluir gatos e números da rifa funciona, mas tudo fica só na memória e volta ao padrão quando a página é recarregada;
- um selo "MODO DEMO" aparece no canto da tela.

O modo demo só liga quando `VITE_MOCK_API` vale exatamente `true`. Sem a variável ele fica desligado, então não é preciso configurar nada em produção (Vercel).

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
