/* ============ EDITE AQUI ============ */
const CONFIG = {
  whatsapp: "5561999999999",   // DDI + DDD + número, só dígitos
  taxaEntrega: 5,              // R$ — 0 para desativar
  loja: "Faruk Sorvetes e Açaí"
};

// Adicionais valem para todos os produtos que listarem "adicionais"
const ADICIONAIS = [
  { nome: "Leite em pó", preco: 2 },
  { nome: "Granola extra", preco: 2 }
];

// foto: caminho da imagem, ex: "fotos/acai-premium.jpg" (deixe "" para usar o ícone)
const PRODUTOS = [
  { cat:"Açaí", nome:"Açaí Tradicional", desc:"Polpa de açaí, banana, granola e mel (opcional).", foto:"",
    tamanhos:[{n:"300 ml",p:15},{n:"400 ml",p:20},{n:"500 ml",p:24.9}], adicionais:true },
  { cat:"Açaí", nome:"Açaí Premium", desc:"Açaí, morango, banana, granola e leite em pó.", foto:"",
    tamanhos:[{n:"300 ml",p:20},{n:"400 ml",p:25},{n:"500 ml",p:30}], adicionais:true },
  { cat:"Açaí", nome:"Açaí Especial", desc:"Açaí, frutas, granola, leite em pó e mel.", foto:"",
    tamanhos:[{n:"300 ml",p:24.9},{n:"400 ml",p:29.9},{n:"500 ml",p:34.9}], adicionais:true },

  { cat:"Sorvetes", nome:"Sorvete Soft", desc:"Sorvete cremoso de máquina.", foto:"",
    tamanhos:[{n:"300 ml",p:15}], adicionais:false },
  { cat:"Sorvetes", nome:"Sorvete de Morango", desc:"Sorvete cremoso sabor morango.", foto:"",
    tamanhos:[{n:"300 ml",p:12}], adicionais:false },

  { cat:"Milk-shake", nome:"Milk-shake 300 ml", desc:"Escolha o sabor ao pedir.", foto:"",
    tamanhos:[{n:"300 ml",p:14}], adicionais:false },
  { cat:"Milk-shake", nome:"Milk-shake 500 ml", desc:"Escolha o sabor ao pedir.", foto:"",
    tamanhos:[{n:"500 ml",p:19}], adicionais:false }
];
/* ================================== */

const brl = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = s => document.querySelector(s);
const categorias = [...new Set(PRODUTOS.map(p => p.cat))];
let catAtual = categorias[0];
let carrinho = [];

function desenharAbas(){
  $("#abas").innerHTML = categorias.map(c =>
    `<button aria-pressed="${c===catAtual}" data-cat="${c}">${c}</button>`).join("");
  $("#abas").querySelectorAll("button").forEach(b => b.onclick = () => { catAtual = b.dataset.cat; desenharAbas(); desenharLista(); });
}

function fotoHtml(p){
  return `<div class="foto">${p.foto ? `<img src="${p.foto}" alt="${p.nome}" loading="lazy">` : p.nome[0]}</div>`;
}

function desenharLista(){
  $("#lista").innerHTML = PRODUTOS.map((p,i) => ({p,i})).filter(x => x.p.cat === catAtual).map(({p,i}) => {
    const min = Math.min(...p.tamanhos.map(t => t.p));
    return `<button class="item" data-i="${i}">${fotoHtml(p)}<div><h3>${p.nome}</h3><p>${p.desc}</p><span class="preco">${p.tamanhos.length>1?"a partir de ":""}${brl(min)}</span></div></button>`;
  }).join("");
  $("#lista").querySelectorAll(".item").forEach(b => b.onclick = () => abrirProduto(+b.dataset.i));
}

function abrirModal(html){ $("#painel").innerHTML = html; $("#modal").classList.add("aberto"); }
function fecharModal(){ $("#modal").classList.remove("aberto"); }
$("#modal").onclick = e => { if (e.target.id === "modal") fecharModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharModal(); });

function abrirProduto(i){
  const p = PRODUTOS[i];
  let qtd = 1;
  abrirModal(`
    <h2>${p.nome}</h2>
    <p class="desc">${p.desc}</p>
    <h4>Tamanho</h4>
    ${p.tamanhos.map((t,k) => `<label class="opcao"><span><input type="radio" name="tam" value="${k}" ${k===0?"checked":""}>${t.n}</span><span>${brl(t.p)}</span></label>`).join("")}
    ${p.adicionais ? `<h4>Adicionais</h4>` + ADICIONAIS.map((a,k) => `<label class="opcao"><span><input type="checkbox" name="ad" value="${k}">${a.nome}</span><span>+ ${brl(a.preco)}</span></label>`).join("") : ""}
    <label class="campo">Observação (opcional)<input id="obs" type="text" placeholder="Ex.: sem granola, sabor chocolate"></label>
    <div class="qtd"><button id="menos" aria-label="Diminuir">−</button><strong id="qtd">1</strong><button id="mais" aria-label="Aumentar">+</button></div>
    <button class="btn" id="add"></button>
    <button class="btn sec" id="fechar">Cancelar</button>`);

  const calc = () => {
    const t = p.tamanhos[+document.querySelector("input[name=tam]:checked").value];
    const ads = [...document.querySelectorAll("input[name=ad]:checked")].map(c => ADICIONAIS[+c.value]);
    const unit = t.p + ads.reduce((s,a) => s + a.preco, 0);
    return {t, ads, unit};
  };
  const atualizar = () => { $("#add").textContent = `Adicionar • ${brl(calc().unit * qtd)}`; $("#qtd").textContent = qtd; };
  $("#painel").querySelectorAll("input").forEach(el => el.onchange = atualizar);
  $("#menos").onclick = () => { qtd = Math.max(1, qtd-1); atualizar(); };
  $("#mais").onclick = () => { qtd++; atualizar(); };
  $("#fechar").onclick = fecharModal;
  $("#add").onclick = () => {
    const {t, ads, unit} = calc();
    carrinho.push({ nome:p.nome, tamanho:t.n, ads:ads.map(a=>a.nome), obs:$("#obs").value.trim(), qtd, unit });
    fecharModal(); atualizarBarra();
  };
  atualizar();
}

const subtotal = () => carrinho.reduce((s,i) => s + i.unit*i.qtd, 0);

function atualizarBarra(){
  const n = carrinho.reduce((s,i) => s + i.qtd, 0);
  $("#barra").classList.toggle("visivel", n > 0);
  $("#barraQtd").textContent = `Ver pedido (${n} ${n===1?"item":"itens"})`;
  $("#barraTotal").textContent = brl(subtotal());
}

function abrirCarrinho(){
  if (!carrinho.length) return;
  abrirModal(`
    <h2>Seu pedido</h2>
    <div id="linhas"></div>
    <label class="campo">Seu nome<input id="nome" type="text" autocomplete="name"></label>
    <label class="campo">Como receber?
      <select id="tipo"><option value="entrega">Entrega</option><option value="retirada">Retirada na loja</option></select>
    </label>
    <label class="campo" id="campoEnd">Endereço de entrega<input id="end" type="text" autocomplete="street-address"></label>
    <label class="campo">Forma de pagamento
      <select id="pag"><option>Pix</option><option>Cartão</option><option>Dinheiro</option></select>
    </label>
    <div class="total"><span>Total</span><span id="total"></span></div>
    <button class="btn zap" id="enviar">Enviar pedido no WhatsApp</button>
    <button class="btn sec" id="fechar">Voltar ao cardápio</button>`);

  const redesenhar = () => {
    if (!carrinho.length){ fecharModal(); atualizarBarra(); return; }
    $("#linhas").innerHTML = carrinho.map((it,k) => `
      <div class="linha-carrinho"><div>${it.qtd}× ${it.nome} (${it.tamanho})
        <small>${[...it.ads, it.obs].filter(Boolean).join(" • ")}</small></div>
        <div style="text-align:right">${brl(it.unit*it.qtd)}<br><button data-k="${k}">remover</button></div></div>`).join("");
    $("#linhas").querySelectorAll("button").forEach(b => b.onclick = () => { carrinho.splice(+b.dataset.k,1); redesenhar(); atualizarBarra(); });
    const entrega = $("#tipo").value === "entrega";
    $("#campoEnd").style.display = entrega ? "block" : "none";
    $("#total").textContent = brl(subtotal() + (entrega ? CONFIG.taxaEntrega : 0));
  };
  $("#tipo").onchange = redesenhar;
  $("#fechar").onclick = fecharModal;
  $("#enviar").onclick = () => {
    const nome = $("#nome").value.trim();
    const entrega = $("#tipo").value === "entrega";
    const end = $("#end").value.trim();
    if (!nome){ $("#nome").focus(); return alert("Digite seu nome."); }
    if (entrega && !end){ $("#end").focus(); return alert("Digite o endereço de entrega."); }
    const linhas = carrinho.map(it =>
      `• ${it.qtd}x ${it.nome} (${it.tamanho})` +
      (it.ads.length ? ` + ${it.ads.join(", ")}` : "") +
      (it.obs ? ` — obs: ${it.obs}` : "") +
      ` = ${brl(it.unit*it.qtd)}`);
    const taxa = entrega ? CONFIG.taxaEntrega : 0;
    const msg = [
      `*Novo pedido — ${CONFIG.loja}*`, "",
      ...linhas, "",
      `Subtotal: ${brl(subtotal())}`,
      entrega ? `Entrega: ${brl(taxa)}` : "Retirada na loja",
      `*Total: ${brl(subtotal()+taxa)}*`, "",
      `Nome: ${nome}`,
      entrega ? `Endereço: ${end}` : "",
      `Pagamento: ${$("#pag").value}`
    ].filter(l => l !== "" || true).join("\n");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  redesenhar();
}
$("#abrirCarrinho").onclick = abrirCarrinho;

desenharAbas(); desenharLista();
