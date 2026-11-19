# NovaStore — Loja Virtual React

Atividade acadêmica: loja virtual que consome a Fake Store API e permite cadastrar produtos localmente.

## Tecnologias
- React 18 com Create React App (`react-scripts`)
- PrimeReact (Card, Dialog, Button, InputText, InputNumber, Dropdown, InputTextarea, Toast)
- PrimeFlex para grid responsivo
- PrimeIcons
- Axios para requisições HTTP
- Fake Store API: https://fakestoreapi.com/products

## Como executar

Requisitos: Node.js 18 ou 20 LTS e npm.

1. Extraia o arquivo ZIP.
2. Abra o terminal dentro da pasta `loja-virtual-primereact`.
3. Execute `npm install`.
4. Execute `npm start`.
5. Acesse http://localhost:3000.

Para gerar a versão de produção: `npm run build`.

## Funcionalidades
- Busca de produtos com Axios e estados de carregamento/erro.
- Exibição de produtos em cards do PrimeReact.
- Componente `ProductCard` que recebe o produto por props.
- Componente `ProductList` que busca os dados e monta a vitrine.
- Formulário com validação para cadastrar novos produtos.
- Pesquisa por nome/descrição e filtro por categoria.
- Layout responsivo usando PrimeFlex e CSS.

## Observações importantes
- Os preços da Fake Store API são originalmente em dólares (USD). Nesta atividade são **exibidos em formato BRL sem conversão cambial**, exclusivamente para demonstração da interface. Não representam preços reais em reais.
- Os produtos cadastrados são adicionados **somente ao estado local do React**; desaparecem ao atualizar a página. A Fake Store API não persiste essas inclusões neste projeto.
- O botão com ícone de sacola nos cards é ilustrativo; não há carrinho ou checkout.
- É necessário acesso à internet para carregar os produtos externos.

## Estrutura
```
public/
  index.html
  placeholder.svg
src/
  components/
    AddProductForm.jsx
    ProductCard.jsx
    ProductList.jsx
  App.js
  index.js
  styles.css
```
