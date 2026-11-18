Cardápio Digital — Faruk Sorvetes e Açaí
Aplicação web de cardápio digital para uma loja de sorvetes e açaí. Permite visualizar produtos, escolher tamanhos e adicionais, montar um pedido e acompanhar o valor total pelo carrinho.
Funcionalidades
- Navegação por categorias de produtos.
- Exibição de nomes, descrições, fotos e preços.
- Seleção de tamanhos disponíveis.
- Seleção de adicionais por produto.
- Limite configurável de adicionais.
- Atualização automática do preço conforme as escolhas.
- Controle da quantidade de cada item.
- Carrinho com resumo dos produtos selecionados.
- Remoção de itens do carrinho.
- Cálculo automático do subtotal e total.
- Janelas modais para detalhes dos produtos e carrinho.
- Interface adaptável a diferentes larguras de tela.
Tecnologias
- HTML5: estrutura da aplicação.
- CSS3: estilização e layout.
- JavaScript: renderização dos produtos, interações e regras do carrinho.
- Google Fonts — Nunito: tipografia da interface.
Como executar
1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Abra index.html em um navegador.
Não é necessário instalar dependências ou configurar servidor para executar a versão atual.
Estrutura do projeto
cardapio-faruk/
├── fotos/
│   ├── imagens dos produtos
│   └── imagens do cabeçalho
├── index.html
├── script.js
├── style.css
└── README.md
Personalização
Os produtos e suas informações ficam no array PRODUTOS, em script.js. Nele é possível alterar:
- Categoria e subcategoria.
- Nome e descrição.
- Caminho da imagem.
- Tamanhos e preços.
- Disponibilidade de adicionais.
- Limite de adicionais por produto.
A lista de adicionais e seus preços fica no array ADICIONAIS, também em script.js.

As informações de configuração da loja ficam no objeto CONFIG.
Observações técnicas
- Os produtos são definidos diretamente no código JavaScript.
- O carrinho é mantido em memória durante a sessão da página.
- O projeto atual não utiliza banco de dados ou backend.
- Há configuração de número de WhatsApp, mas o envio do pedido pelo WhatsApp ainda não está implementado.
Objetivo
Projeto desenvolvido para praticar construção de interfaces web, manipulação do DOM, eventos JavaScript, organização de dados e implementação de regras de negócio no front-end.
