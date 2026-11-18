# Drip Store — Projeto Final Front-end

Aplicação de loja virtual desenvolvida em React como projeto final do curso Geração Tech 4.0, com base no layout de referência da Digital College.

## Sobre o projeto

A Drip Store é uma aplicação demonstrativa de comércio eletrônico que permite navegar por produtos, consultar detalhes, gerenciar um carrinho e simular o processo de compra.

O projeto foi desenvolvido para aplicar conceitos de componentização, gerenciamento de estado, navegação entre páginas e persistência de dados no navegador.

## Tecnologias utilizadas

- React e JavaScript (JSX)
- Vite
- React Router DOM
- CSS
- Context API e React Hooks
- LocalStorage
- ViaCEP para consulta de endereços

## Funcionalidades

- Página inicial com produtos em destaque
- Catálogo com busca, filtros e ordenação
- Página de detalhes dos produtos
- Carrinho com controle de quantidades
- Cadastro, login e logout demonstrativos
- Lista de favoritos vinculada ao usuário
- Consulta de CEP e cálculo demonstrativo de frete
- Aplicação de cupons de desconto
- Checkout com simulação de Pix, cartão e boleto
- Histórico e detalhes dos pedidos
- Confirmação demonstrativa de pagamentos pendentes

## Como executar

**Pré-requisito:** Node.js compatível com a versão do Vite utilizada no projeto.

Clone o repositório:

```bash
git clone https://github.com/camilafmmarcal/geracaotech.git
```

Acesse a pasta da aplicação:

```bash
cd geracaotech/drip-store
```

Instale as dependências:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço local informado pelo Vite.

## Verificação técnica

Execute:

```bash
npm run lint
npm run build
```

Na revisão final de 18/11/2026, ambos os comandos foram executados com sucesso.

## Limitações

Este é um projeto acadêmico e demonstrativo.

- Não realiza cobranças reais.
- Não utiliza backend ou banco de dados em servidor.
- Dados de usuários, carrinho, favoritos e pedidos são armazenados localmente no navegador.
- O sistema de autenticação é demonstrativo e não deve ser utilizado em produção.
- Valores de frete, promoções e pagamentos são simulados.

## Referências

- [Projeto-base Digital Store](https://github.com/digitalcollegebr/projeto-digital-store)
- [Protótipo de referência no Figma](https://www.figma.com/design/nUk0ihM3x4u8JQtxUoAEJf/DRIP-STORE---DIGITAL-COLLEGE--Copy-?node-id=22-30)

## Autoria
Projeto individual — Geração Tech 4.0
Aluna: Camila Fontenele Meira Marçal
CPF: 041.661.733-67
