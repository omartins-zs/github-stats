# Microserviço Privado de GitHub Stats

Um projeto puramente focado em uso privado para renderização das estatísticas do GitHub do usuário `omartins-zs`. Sem dependências inúteis, sem código para a comunidade e focado em alta performance.

Você tem **duas formas** de utilizar este projeto. Escolha a que preferir!

---

## 🚀 Opção 1: Uso via GitHub Actions (Sem Servidor)
Essa opção é a mais fácil. Não requer serviços externos como a Vercel. O próprio GitHub roda um script todo dia e atualiza uma imagem dentro dessa pasta.

### Como funciona:
1. Ao fazer push desta pasta para um repositório seu no GitHub, uma Action automática rodará todo dia à meia noite.
2. O script buscará suas estatísticas usando o seu `GITHUB_TOKEN` secreto que o repositório gera automaticamente.
3. A imagem será gerada na pasta `dist/stats.svg` e commitada sozinha no seu repositório.

### Como usar no seu perfil:
Basta ir no README do seu perfil e colocar a imagem gerada:
```html
<img src="https://raw.githubusercontent.com/omartins-zs/NOME_DO_SEU_REPOSITORIO/main/dist/stats.svg" alt="Meus Stats" />
```
*(Lembre-se de substituir `NOME_DO_SEU_REPOSITORIO` pelo nome real do repositório onde você colocou esse código).*

**Deseja trocar o tema?**
Abra o arquivo `.github/workflows/generate-stats.yml` e altere a linha `THEME: "dracula"` para um dos temas suportados: `radical`, `prussian`, `nord`, `default`, `dark` ou `dracula`.

---

## ⚡ Opção 2: Uso via Vercel (API em Tempo Real)
Essa opção cria uma API que você pode pingar de qualquer lugar, igualzinho o projeto original funcionava, porém 100% privada e com Edge Cache otimizado de 4 horas.

### Como realizar o Deploy:
1. Faça login na [Vercel](https://vercel.com/) com o seu GitHub.
2. Importe o repositório contendo este código.
3. Antes de clicar em **Deploy**, vá até **Environment Variables** e adicione:
   - **Key:** `GITHUB_TOKEN`
   - **Value:** `Crie um Personal Access Token no seu GitHub (Settings > Developer Settings) com permissão de leitura.`
4. Clique em **Deploy**.

### Como usar no seu perfil:
Com o projeto no ar, copie o link fornecido pela Vercel e adicione no seu README:
```html
<img src="https://SEU-APP-VERCEL.vercel.app/api/stats" alt="Meus Stats" />
```

Você pode mudar o tema diretamente via URL se preferir:
```html
<img src="https://SEU-APP-VERCEL.vercel.app/api/stats?theme=dracula" alt="Meus Stats" />
```

---

## 🛠️ Temas Disponíveis
* `default`
* `dark`
* `dracula`
* `radical`
* `prussian`
* `nord`
