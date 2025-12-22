# DFD Platform - Diagrama de Fluxo de Dados

Plataforma completa para criação de Diagramas de Fluxo de Dados (DFD) para processos licitatórios, conforme Lei nº 14.133/2021.

## 🚀 Funcionalidades

- ✅ Formulário completo e validado
- ✅ Auto-salvamento automático
- ✅ Geração de PDF profissional
- ✅ Templates pré-configurados
- ✅ Validação inteligente
- ✅ IA assistente para melhoria de textos
- ✅ Exportação/Importação de dados
- ✅ Segurança avançada
- ✅ Atalhos de teclado
- ✅ Interface responsiva

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **PDF**: jsPDF
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0

## 🚀 Instalação e Desenvolvimento

1. Clone o repositório:
```bash
git clone <repository-url>
cd dfd-platform
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra http://localhost:8080 no seu navegador

## 🏗️ Build para Produção

1. Build do projeto:
```bash
npm run build
```

2. Preview do build:
```bash
npm run preview
```

## 🚀 Deploy no Vercel

### Configuração Automática

1. Faça push do código para o GitHub
2. Conecte o repositório ao Vercel
3. O Vercel detectará automaticamente o framework Vite
4. Configure as variáveis de ambiente (se necessário)
5. Deploy automático

### Configuração Manual

1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça o deploy:
```bash
vercel --prod
```

### Variáveis de Ambiente

Opcionalmente, configure o Vercel KV para rate limiting:

```bash
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Lint do código
- `npm run type-check` - Verificação de tipos

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas da aplicação
│   ├── lib/           # Utilitários e configurações
│   ├── hooks/         # Hooks customizados
│   └── utils/         # Funções utilitárias
├── api/               # API endpoints (Vercel Functions)
├── public/            # Arquivos estáticos
└── dist/              # Build de produção
```

## 🔒 Segurança

- Content Security Policy (CSP)
- Rate limiting
- CSRF protection
- Input validation
- XSS prevention
- Secure headers

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, entre em contato através do formulário na aplicação.