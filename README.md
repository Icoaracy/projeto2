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

### Opção 1: Deploy Automático (Recomendado)

1. **Faça push do código para o GitHub:**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Configure no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - O Vercel detectará automaticamente o framework Vite
   - Clique em "Deploy"

3. **Configure variáveis de ambiente (opcional):**
   - No dashboard do Vercel, vá para Settings → Environment Variables
   - Adicione `KV_REST_API_URL` e `KV_REST_API_TOKEN` se usar rate limiting

### Opção 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI:**
```bash
# Via npm (recomendado)
npm install -g vercel

# Ou via npx (sem instalar globalmente)
npx vercel --version
```

2. **Faça o login no Vercel:**
```bash
vercel login
```

3. **Faça o deploy:**
```bash
# Deploy de desenvolvimento
vercel

# Deploy de produção
vercel --prod
```

### Opção 3: Deploy via npx (sem instalar)

```bash
# Deploy direto com npx
npx vercel --prod

# Ou se já tiver feito login antes
npx vercel login
npx vercel --prod
```

### Opção 4: Deploy via GitHub Actions (Automático)

1. Crie o arquivo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

2. Configure os secrets no GitHub:
   - `VERCEL_TOKEN`
   - `ORG_ID`
   - `PROJECT_ID`

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

## 🐛 Solução de Problemas

### "command not found: vercel"

**Solução 1: Instale globalmente**
```bash
npm install -g vercel
```

**Solução 2: Use npx**
```bash
npx vercel --prod
```

**Solução 3: Adicione ao PATH**
```bash
# Adicione ao seu ~/.bashrc ou ~/.zshrc
export PATH="$PATH:$(npm config get prefix)/bin"
```

**Solução 4: Use o Vercel Web**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub
   - Deploy automático

### Erros de Build

1. **Verifique o Node.js:**
```bash
node --version  # Deve ser >= 18
npm --version   # Deve ser >= 8
```

2. **Limpe o cache:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

3. **Verifique as dependências:**
```bash
npm audit fix
npm update
```

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, entre em contato através do formulário na aplicação.