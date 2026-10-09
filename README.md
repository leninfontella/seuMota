# SeuMota

O **SeuMota** é uma aplicação web simples para conectar pessoas que precisam de ajuda com tarefas do dia a dia a prestadores de serviço próximos, chamados de **Motas**.

O projeto foi desenvolvido somente com **HTML, CSS e JavaScript puro**, sem frameworks ou dependências obrigatórias.

## Funcionalidades

- Página inicial responsiva;
- cadastro e acesso de usuários;
- publicação e acompanhamento de tarefas;
- fluxo dedicado para prestadores de serviço;
- configurações de perfil;
- navegação e interações feitas com JavaScript puro.

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Estrutura do projeto

```text
seuMota/
├── assets/             # Imagens, ícones e outros recursos
├── css/                # Folhas de estilo
├── js/                 # Scripts da aplicação
├── pages/              # Páginas internas
│   └── providers/      # Páginas dos prestadores (Motas)
├── index.html          # Página inicial
└── README.md
```

> A estrutura pode variar conforme novas páginas e recursos forem adicionados.

## Como executar

Este é um projeto estático e não exige instalação de pacotes.

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` diretamente no navegador.

Para uma melhor experiência durante o desenvolvimento, execute o projeto com um servidor local. No VS Code, por exemplo, você pode usar a extensão **Live Server** e selecionar **Open with Live Server** no arquivo `index.html`.

Também é possível usar um servidor já disponível no seu ambiente, como:

```bash
npx serve .
```

Depois, acesse o endereço exibido no terminal.

## Desenvolvimento

Como o projeto não utiliza etapa de compilação, as alterações em arquivos HTML, CSS e JavaScript podem ser visualizadas recarregando a página no navegador.

Ao criar novas páginas, mantenha os caminhos relativos de imagens, estilos e scripts de acordo com o nível da pasta em que o arquivo se encontra.

## Status

Projeto em desenvolvimento.

## Licença

Este projeto ainda não possui uma licença definida.
