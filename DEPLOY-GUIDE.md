# 🚀 Guia de Deploy - GitHub Pages

## Passos para Deploy no GitHub Pages

### 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome do repositório: `task-manager` (ou qualquer nome)
4. Deixe como **Public**
5. Clique em **"Create repository"**

### 2. Fazer Push do Código

No terminal do Replit, execute:

```bash
# Inicializar Git (se ainda não estiver inicializado)
git init

# Adicionar remote do GitHub (substitua SEU-USUARIO e SEU-REPO)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Versão estática da aplicação Task Manager"

# Fazer push para o GitHub
git push -u origin main
```

Se pedir autenticação, use seu **Personal Access Token** do GitHub.

### 3. Configurar GitHub Pages

1. No repositório do GitHub, vá em **Settings** → **Pages**
2. Em **Source**, selecione **"GitHub Actions"**
3. O workflow será executado automaticamente!

Aguarde alguns minutos e sua aplicação estará disponível em:
```
https://SEU-USUARIO.github.io/SEU-REPO/
```

## ✅ Verificar Deploy

Após o deploy, você pode:

1. Ver o status do workflow em **Actions**
2. Acessar sua aplicação pelo link do GitHub Pages
3. Testar todas as funcionalidades

## 📝 Funcionalidades Disponíveis

- ➕ Criar quadros e tarefas
- ✏️ Editar nomes de quadros e tarefas
- 🗑️ Excluir quadros e tarefas
- 🔄 Arrastar e soltar tarefas entre quadros
- 💾 Salvamento automático no LocalStorage

## ⚠️ Importante

- Os dados são armazenados **apenas localmente** no navegador
- Limpar o cache do navegador apaga os dados
- Use o botão **"Limpar Dados"** para resetar a aplicação

## 🔧 Configurações Adicionais (Opcional)

### Domínio Customizado

1. No GitHub Pages, adicione seu domínio customizado
2. Configure o DNS do seu domínio

### Atualizar a Aplicação

Para fazer alterações e atualizar:

```bash
# Fazer alterações nos arquivos
# Depois:
git add .
git commit -m "Descrição das alterações"
git push
```

O GitHub Actions fará o deploy automático!

## 📊 Estrutura do Projeto

```
docs/                    # Pasta com a versão estática
├── index.html          # Página inicial
├── pages/
│   └── quadros/
│       └── index.html  # Aplicação principal
├── scripts/
│   ├── storage.js      # LocalStorage manager
│   └── quadros-static.js  # Lógica da aplicação
├── css/                # Estilos
└── assets/             # Imagens

.github/
└── workflows/
    └── deploy.yml      # GitHub Actions workflow
```

## 🆘 Resolução de Problemas

### Deploy não funciona
- Verifique se o workflow está habilitado em **Actions**
- Veja os logs do workflow para erros

### Página não carrega
- Certifique-se de que o GitHub Pages está configurado
- Aguarde alguns minutos após o primeiro deploy

### Dados não salvam
- Verifique se o navegador permite LocalStorage
- Não use modo anônimo/privado do navegador

## 📚 Recursos

- [GitHub Pages Docs](https://docs.github.com/pages)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [LocalStorage API](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

---

**Desenvolvido com ❤️ usando JavaScript puro**
