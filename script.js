/* ==========================================================
   CONFIGURAÇÃO — edite aqui
   ========================================================== */

const CONFIG = {
  whatsapp: "5561999999999", // DDI + DDD + número, só dígitos
  //taxaEntrega: 0, // em reais. Use 0 para desativar
  loja: "Faruk Sorvetes e Açaí",
};

// Valem para os produtos com "adicionais: true"
const ADICIONAIS = [
  { nome: "Leite em pó", preco: 2 },
  { nome: "Granola extra", preco: 2 },
];

// foto: caminho da imagem, ex: "fotos/acai-premium.jpg"
// Deixe "" para mostrar a inicial do produto
// sub: subcategoria (opcional). Produtos com a mesma sub ficam juntos
const PRODUTOS = [
  {
    cat: "Açaí",
    sub: "Cascões",
    nome: "Cascão de Ninho",
    desc: "",
    foto: "fotos/cascao_ninho.png",
    tamanhos: [{ n: "padrão", p: 6 }],
    adicionais: false,
  },
  {
    cat: "Açaí",
    sub: "Cascões",
    nome: "Cascão Misto",
    desc: "",
    foto: "fotos/cascao_misto.png",
    tamanhos: [{ n: "padrão", p: 7 }],
    adicionais: false,
  },
  {
    cat: "Açaí",
    sub: "Cascões",
    nome: "Cascão de Açaí",
    desc: "",
    foto: "fotos/cascao_acai.png",
    tamanhos: [{ n: "padrão", p: 8 }],
    adicionais: false,
  },
  {
    cat: "Açaí",
    sub: "Cascões",
    nome: "Cestinha Cremosa",
    desc: "Vem com banana e leite condensado",
    foto: "fotos/cestinha_cremosa.png",
    tamanhos: [{ n: "padrão", p: 13.9 }],
    adicionais: false,
  },
  {
    cat: "Açaí",
    sub: "Faruk Classic",
    nome: "Açaí com Pistache",
    desc: "Polpa de açaí, banana, granola e mel (opcional).",
    foto: "",
    tamanhos: [
      { n: "300 ml", p: 15 },
      { n: "400 ml", p: 20 },
      { n: "500 ml", p: 24.9 },
    ],
    adicionais: true,
  },
  {
    cat: "Açaí",
    nome: "Açaí Premium",
    desc: "Açaí, morango, banana, granola e leite em pó.",
    foto: "",
    tamanhos: [
      { n: "300 ml", p: 20 },
      { n: "400 ml", p: 25 },
      { n: "500 ml", p: 30 },
    ],
    adicionais: true,
  },
  {
    cat: "Açaí",
    nome: "Faruk Especial",
    desc: "Açaí, frutas, granola, leite em pó e mel.",
    foto: "",
    tamanhos: [
      { n: "300 ml", p: 24.9 },
      { n: "400 ml", p: 29.9 },
      { n: "500 ml", p: 34.9 },
    ],
    adicionais: true,
  },
  {
    cat: "Sorvetes",
    nome: "Sorvete Soft",
    desc: "Sorvete cremoso de máquina.",
    foto: "",
    tamanhos: [{ n: "300 ml", p: 15 }],
    adicionais: false,
  },
  {
    cat: "Sorvetes",
    nome: "Sorvete de Morango",
    desc: "Sorvete cremoso sabor morango.",
    foto: "",
    tamanhos: [{ n: "300 ml", p: 12 }],
    adicionais: false,
  },
  {
    cat: "Milk-shake",
    nome: "Milk-shake 300 ml",
    desc: "Escolha o sabor ao pedir.",
    foto: "",
    tamanhos: [{ n: "300 ml", p: 14 }],
    adicionais: false,
  },
  {
    cat: "Milk-shake",
    nome: "Milk-shake 500 ml",
    desc: "Escolha o sabor ao pedir.",
    foto: "",
    tamanhos: [{ n: "500 ml", p: 19 }],
    adicionais: false,
  },
];

/* ==========================================================
   ESTADO E ATALHOS
   ========================================================== */

const $ = (seletor) => document.querySelector(seletor);

const categorias = [...new Set(PRODUTOS.map((p) => p.cat))];
let categoriaAtual = categorias[0];
let carrinho = [];

function brl(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function subtotal() {
  return carrinho.reduce((soma, item) => soma + item.unit * item.qtd, 0);
}

/* ==========================================================
   TELA PRINCIPAL: abas e lista de produtos
   ========================================================== */

function desenharAbas() {
  $("#abas").innerHTML = categorias
    .map(
      (cat) => `
        <button aria-pressed="${cat === categoriaAtual}" data-cat="${cat}">
          ${cat}
        </button>
      `,
    )
    .join("");

  $("#abas")
    .querySelectorAll("button")
    .forEach((botao) => {
      botao.onclick = () => {
        categoriaAtual = botao.dataset.cat;
        desenharAbas();
        desenharLista();
      };
    });
}

function htmlFoto(produto) {
  const conteudo = produto.foto
    ? `<img src="${produto.foto}" alt="${produto.nome}" loading="lazy">`
    : produto.nome[0];

  return `<div class="foto">${conteudo}</div>`;
}

function desenharLista() {
  const itens = PRODUTOS.map((produto, indice) => ({ produto, indice }))
    .filter((x) => x.produto.cat === categoriaAtual)
    // produtos sem subcategoria vêm primeiro
    .sort((a, b) => Boolean(a.produto.sub) - Boolean(b.produto.sub));

  let subAnterior = "";

  $("#lista").innerHTML = itens
    .map(({ produto, indice }) => {
      const menorPreco = Math.min(...produto.tamanhos.map((t) => t.p));
      const prefixo = produto.tamanhos.length > 1 ? "a partir de " : "";

      // mostra o título da subcategoria quando ela muda
      const titulo =
        produto.sub && produto.sub !== subAnterior
          ? `<h3 class="subtitulo">${produto.sub}</h3>`
          : "";
      subAnterior = produto.sub;

      return `
        ${titulo}
        <button class="item" data-i="${indice}">
          ${htmlFoto(produto)}
          <div>
            <h3>${produto.nome}</h3>
            <p>${produto.desc}</p>
            <span class="preco">${prefixo}${brl(menorPreco)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  $("#lista")
    .querySelectorAll(".item")
    .forEach((botao) => {
      botao.onclick = () => abrirProduto(Number(botao.dataset.i));
    });
}

/* ==========================================================
   JANELA (MODAL)
   ========================================================== */

function abrirModal(html) {
  $("#painel").innerHTML = html;
  $("#modal").classList.add("aberto");
}

function fecharModal() {
  $("#modal").classList.remove("aberto");
}

// Clicar fora da janela fecha
$("#modal").onclick = (evento) => {
  if (evento.target.id === "modal") fecharModal();
};

// Tecla Esc fecha
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") fecharModal();
});

/* ==========================================================
   DETALHE DO PRODUTO
   ========================================================== */

function abrirProduto(indice) {
  const produto = PRODUTOS[indice];
  let quantidade = 1;

  const htmlTamanhos = produto.tamanhos
    .map(
      (tamanho, k) => `
        <label class="opcao">
          <span>
            <input type="radio" name="tam" value="${k}" ${k === 0 ? "checked" : ""}>
            ${tamanho.n}
          </span>
          <span>${brl(tamanho.p)}</span>
        </label>
      `,
    )
    .join("");

  const htmlAdicionais = produto.adicionais
    ? `
        <h4>Adicionais</h4>
        ${ADICIONAIS.map(
          (adicional, k) => `
            <label class="opcao">
              <span>
                <input type="checkbox" name="ad" value="${k}">
                ${adicional.nome}
              </span>
              <span>+ ${brl(adicional.preco)}</span>
            </label>
          `,
        ).join("")}
      `
    : "";

  abrirModal(`
    <h2>${produto.nome}</h2>
    <p class="desc">${produto.desc}</p>

    <h4>Tamanho</h4>
    ${htmlTamanhos}

    ${htmlAdicionais}

    <label class="campo">
      Observação (opcional)
      <input id="obs" type="text" placeholder="Ex.: sem granola, sabor chocolate">
    </label>

    <div class="qtd">
      <button id="menos" aria-label="Diminuir">−</button>
      <strong id="qtd">1</strong>
      <button id="mais" aria-label="Aumentar">+</button>
    </div>

    <button class="btn" id="add"></button>
    <button class="btn sec" id="fechar">Cancelar</button>
  `);

  // Lê o que o cliente escolheu e calcula o preço unitário
  function lerEscolhas() {
    const indiceTamanho = Number(
      document.querySelector("input[name=tam]:checked").value,
    );
    const tamanho = produto.tamanhos[indiceTamanho];

    const adicionais = [...document.querySelectorAll("input[name=ad]:checked")].map(
      (caixa) => ADICIONAIS[Number(caixa.value)],
    );

    const somaAdicionais = adicionais.reduce((soma, a) => soma + a.preco, 0);

    return {
      tamanho,
      adicionais,
      unit: tamanho.p + somaAdicionais,
    };
  }

  function atualizarBotao() {
    const { unit } = lerEscolhas();
    $("#add").textContent = `Adicionar • ${brl(unit * quantidade)}`;
    $("#qtd").textContent = quantidade;
  }

  $("#painel")
    .querySelectorAll("input")
    .forEach((campo) => {
      campo.onchange = atualizarBotao;
    });

  $("#menos").onclick = () => {
    quantidade = Math.max(1, quantidade - 1);
    atualizarBotao();
  };

  $("#mais").onclick = () => {
    quantidade++;
    atualizarBotao();
  };

  $("#fechar").onclick = fecharModal;

  $("#add").onclick = () => {
    const { tamanho, adicionais, unit } = lerEscolhas();

    carrinho.push({
      nome: produto.nome,
      tamanho: tamanho.n,
      ads: adicionais.map((a) => a.nome),
      obs: $("#obs").value.trim(),
      qtd: quantidade,
      unit: unit,
    });

    fecharModal();
    atualizarBarra();
  };

  atualizarBotao();
}

/* ==========================================================
   BARRA "VER PEDIDO" (parte de baixo da tela)
   ========================================================== */

function atualizarBarra() {
  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  const palavra = totalItens === 1 ? "item" : "itens";

  $("#barra").classList.toggle("visivel", totalItens > 0);
  $("#barraQtd").textContent = `Ver pedido (${totalItens} ${palavra})`;
  $("#barraTotal").textContent = brl(subtotal());
}

$("#abrirCarrinho").onclick = abrirCarrinho;

/* ==========================================================
   CARRINHO E ENVIO PARA O WHATSAPP
   ========================================================== */

function abrirCarrinho() {
  if (carrinho.length === 0) return;

  abrirModal(`
    <h2>Seu pedido</h2>
    <div id="linhas"></div>

    <label class="campo">
      Seu nome
      <input id="nome" type="text" autocomplete="name">
    </label>

    <label class="campo">
      Como receber?
      <select id="tipo">
        <option value="entrega">Entrega</option>
        <option value="retirada">Retirada na loja</option>
      </select>
    </label>

    <label class="campo" id="campoEnd">
      Endereço de entrega
      <input id="end" type="text" autocomplete="street-address">
    </label>

    <label class="campo">
      Forma de pagamento
      <select id="pag">
        <option>Pix</option>
        <option>Cartão</option>
        <option>Dinheiro</option>
      </select>
    </label>

    <div class="total">
      <span>Total</span>
      <span id="total"></span>
    </div>

    <button class="btn zap" id="enviar">Enviar pedido no WhatsApp</button>
    <button class="btn sec" id="fechar">Voltar ao cardápio</button>
  `);

  // Redesenha lista de itens, endereço e total
  function redesenhar() {
    if (carrinho.length === 0) {
      fecharModal();
      atualizarBarra();
      return;
    }

    $("#linhas").innerHTML = carrinho
      .map((item, k) => {
        const detalhes = [...item.ads, item.obs].filter(Boolean).join(" • ");

        return `
          <div class="linha-carrinho">
            <div>
              ${item.qtd}× ${item.nome} (${item.tamanho})
              <small>${detalhes}</small>
            </div>
            <div style="text-align: right">
              ${brl(item.unit * item.qtd)}<br>
              <button data-k="${k}">remover</button>
            </div>
          </div>
        `;
      })
      .join("");

    $("#linhas")
      .querySelectorAll("button")
      .forEach((botao) => {
        botao.onclick = () => {
          carrinho.splice(Number(botao.dataset.k), 1);
          redesenhar();
          atualizarBarra();
        };
      });

    const entrega = $("#tipo").value === "entrega";
    const taxa = entrega ? CONFIG.taxaEntrega : 0;

    $("#campoEnd").style.display = entrega ? "block" : "none";
    $("#total").textContent = brl(subtotal() + taxa);
  }

  function montarMensagem(nome, entrega, endereco) {
    const taxa = entrega ? CONFIG.taxaEntrega : 0;

    const linhasItens = carrinho.map((item) => {
      let linha = `• ${item.qtd}x ${item.nome} (${item.tamanho})`;

      if (item.ads.length > 0) linha += ` + ${item.ads.join(", ")}`;
      if (item.obs) linha += ` — obs: ${item.obs}`;

      return linha + ` = ${brl(item.unit * item.qtd)}`;
    });

    const mensagem = [
      `*Novo pedido — ${CONFIG.loja}*`,
      "",
      ...linhasItens,
      "",
      `Subtotal: ${brl(subtotal())}`,
      entrega ? `Entrega: ${brl(taxa)}` : "Retirada na loja",
      `*Total: ${brl(subtotal() + taxa)}*`,
      "",
      `Nome: ${nome}`,
    ];

    if (entrega) mensagem.push(`Endereço: ${endereco}`);
    mensagem.push(`Pagamento: ${$("#pag").value}`);

    return mensagem.join("\n");
  }

  function enviarPedido() {
    const nome = $("#nome").value.trim();
    const endereco = $("#end").value.trim();
    const entrega = $("#tipo").value === "entrega";

    if (!nome) {
      $("#nome").focus();
      alert("Digite seu nome.");
      return;
    }

    if (entrega && !endereco) {
      $("#end").focus();
      alert("Digite o endereço de entrega.");
      return;
    }

    const texto = encodeURIComponent(montarMensagem(nome, entrega, endereco));
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${texto}`, "_blank");
  }

  $("#tipo").onchange = redesenhar;
  $("#fechar").onclick = fecharModal;
  $("#enviar").onclick = enviarPedido;

  redesenhar();
}

/* ==========================================================
   INÍCIO
   ========================================================== */

desenharAbas();
desenharLista();