# Task Manager - Versão Estática

Uma aplicação Kanban para gerenciamento de tarefas, totalmente estática usando **HTML, CSS e JavaScript puro**. Os dados são armazenados localmente no navegador usando LocalStorage.

## 🚀 Características

- ✅ **100% Estático** - Funciona sem servidor backend
- ✅ **LocalStorage** - Dados persistem no navegador
- ✅ **Vanilla JavaScript** - Sem dependências externas
- ✅ **Drag & Drop** - HTML5 nativo
- ✅ **Responsivo** - Funciona em desktop e mobile
- ✅ **GitHub Pages Ready** - Deploy automático

## 📦 Estrutura do Projeto

```
docs/
├── index.html              # Página inicial
├── pages/
│   └── quadros/
│       └── index.html      # Aplicação principal
├── scripts/
│   ├── storage.js          # Gerenciamento LocalStorage
│   └── quadros-static.js   # Lógica da aplicação
├── css/                    # Estilos
└── assets/                 # Imagens e recursos
```

## 🛠️ Como Usar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. Abra o arquivo `docs/index.html` no navegador ou use um servidor local:
```bash
# Usando Python
python -m http.server 8000 -d docs

# Usando Node.js (npx)
npx serve docs

# Usando PHP
php -S localhost:8000 -t docs
```

3. Acesse: `http://localhost:8000`

## 🌐 Deploy no GitHub Pages

### Configuração Automática (GitHub Actions)

1. Faça push do código para o GitHub:
```bash
git add .
git commit -m "Versão estática da aplicação"
git push origin main
```

2. Habilite GitHub Pages:
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione **GitHub Actions**

3. O workflow será executado automaticamente e a aplicação estará disponível em:
   ```
   https://seu-usuario.github.io/seu-repo/
   ```

### Configuração Manual

Alternativamente, você pode configurar o GitHub Pages para servir a pasta `docs`:
1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Em **Branch**, selecione `main` e pasta `/docs`
4. Clique em **Save**

## 📝 Funcionalidades

### Gerenciar Quadros
- ➕ **Adicionar Quadro**: Clique em "Adicionar quadro"
- ✏️ **Editar Nome**: Clique no nome do quadro
- 🗑️ **Excluir Quadro**: Clique no ícone de lixeira

### Gerenciar Tarefas
- ➕ **Adicionar Tarefa**: Clique em "Adicionar tarefa" no quadro
- ✏️ **Editar Tarefa**: Clique no texto da tarefa
- 🗑️ **Excluir Tarefa**: Clique no ícone de lixeira
- 🔄 **Mover Tarefa**: Arraste e solte entre quadros

### Dados
- 💾 **Salvamento Automático**: Tudo é salvo automaticamente
- 🗑️ **Limpar Dados**: Use o botão "Limpar Dados" (canto superior direito)
- 📱 **Local ao Navegador**: Os dados são específicos do navegador/dispositivo

## ⚠️ Importante

- Os dados são armazenados **apenas localmente** no seu navegador
- Se limpar o cache do navegador, os dados serão perdidos
- Os dados não são sincronizados entre dispositivos
- Para backup, você pode exportar os dados do LocalStorage manualmente

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura e templates
- **CSS3** - Estilos e layout
- **Vanilla JavaScript (ES6+)** - Lógica da aplicação
- **LocalStorage API** - Persistência de dados
- **HTML5 Drag and Drop API** - Funcionalidade de arrastar e soltar
- **GitHub Actions** - CI/CD automático

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📞 Suporte

Se encontrar algum problema ou tiver sugestões, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando JavaScript puro**
