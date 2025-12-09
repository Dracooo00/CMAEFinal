// ====== Seletores ======
const btnConfig = document.getElementById('btnConfig');
const menuConfig = document.getElementById('menuConfig');
const btnPerfil = document.getElementById('btnPerfil');
const btnLogout = document.getElementById('btnLogout');

const turmasSection = document.getElementById('Turmas');
const perfilSection = document.getElementById('Perfil');
const novaTurmaSection = document.getElementById('NovaTurma');
const janelaTurmaSection = document.getElementById('JanelaTurma');

const btnVoltar = document.getElementById('btnVoltar');
const btnNovaTurma = document.getElementById('btnNovaTurma');
const btnCancelar = document.getElementById('btnCancelar');
const formNovaTurma = document.getElementById('FormNovaTurma');
const gridTurmas = document.getElementById('GridTurmas');
const buscaInput = document.getElementById('BuscaTurmas');

const sidebarTitulo = document.getElementById('SidebarTitulo');
const tbodyAlunos = document.getElementById('tbodyAlunos');
const btnVoltarTurmas = document.getElementById('btnVoltarTurmas');
const btnChamada = document.getElementById('btnChamada');
const btnAgenda = document.getElementById('btnAgenda');
const chamadaSection = document.getElementById('chamadaSection');
const agendaSection = document.getElementById('agendaSection');
const agendaInfo = document.getElementById('agendaInfo');

const formPerfil = document.getElementById('FormPerfil');
const formChamada = document.getElementById('formChamada');

// ====== Dados exemplo por turma ======
const baseAlunosPorTurma = {
  '1DS-SEDUC': [
    { nome: 'Rafael Almeida', ra: '000582943721-4', freq: { valor: '100%' } },
    { nome: 'Sabrina Lopes', ra: '000173849502-9', freq: { valor: '100%' } },
    { nome: 'Thiago Ramos', ra: '000928374615-2', freq: { valor: '50%' } },
    { nome: 'Vinícius Cardoso', ra: '000746291038-1', freq: { valor: '79%' } },
  ],
  '2DS-SEDUC': [
    { nome: 'Ana Paula', ra: '000111222333-4', freq: { valor: '100%' } },
    { nome: 'Carlos Eduardo', ra: '000222333444-5', freq: { valor: '75%' } },
  ],
  '3DS-SEDUC': [
    { nome: 'Marina Silva', ra: '000333444555-6', freq: { valor: '50%' } },
  ],
  '4DS-SEDUC': [
    { nome: 'Pedro Henrique', ra: '000444555666-7', freq: { valor: '100%' } },
  ],
};

// ====== Estado inicial ======
mostrarSecao('turmas'); // Turmas como tela inicial

// ====== Funções de navegação ======
function mostrarSecao(sec) {
  const mapa = {
    turmas: turmasSection,
    perfil: perfilSection,
    nova: novaTurmaSection,
    janelaTurma: janelaTurmaSection,
  };
  Object.values(mapa).forEach(el => el.style.display = 'none');
  mapa[sec].style.display = 'block';
}

function abrirPerfil() {
  mostrarSecao('perfil');
  menuConfig.style.display = 'none';
}

function abrirNovaTurma() {
  mostrarSecao('nova');
}

function voltarTurmas() {
  mostrarSecao('turmas');
}

// ====== Menu de configurações ======
btnConfig.addEventListener('click', () => {
  menuConfig.style.display = (menuConfig.style.display === 'block') ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
  if (!menuConfig.contains(e.target) && e.target !== btnConfig) {
    menuConfig.style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') menuConfig.style.display = 'none';
});

btnPerfil.addEventListener('click', abrirPerfil);



// ====== Turmas: busca e abertura de janela ======
buscaInput.addEventListener('input', function () {
  const termo = this.value.toLowerCase();
  const cards = gridTurmas.querySelectorAll('.CardTurma');
  cards.forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(termo) ? '' : 'none';
  });
});

// Abrir janela da turma ao clicar no card
gridTurmas.addEventListener('click', (e) => {
  const card = e.target.closest('.CardTurma');
  if (!card) return;
  document.querySelectorAll('.CardTurma').forEach(el => el.classList.remove('selecionado'));
  card.classList.add('selecionado');

  const codigo = card.dataset.codigo;
  const turno = card.dataset.turno;
  const materia = card.dataset.materia;

  abrirJanelaTurma({ codigo, turno, materia });
});

// ====== Nova turma: criar card dinamicamente ======
btnNovaTurma.addEventListener('click', abrirNovaTurma);
btnCancelar.addEventListener('click', voltarTurmas);

formNovaTurma.addEventListener('submit', (e) => {
  e.preventDefault();
  const codigo = document.getElementById('codigo').value.trim();
  const turno = document.getElementById('turno').value.trim();
  const materia = document.getElementById('materia').value.trim();
  if (!codigo || !turno || !materia) {
    alert('Preencha todos os campos para criar a turma.');
    return;
  }

  const novoCard = document.createElement('div');
  novoCard.className = 'CardTurma';
  novoCard.dataset.codigo = codigo;
  novoCard.dataset.turno = turno;
  novoCard.dataset.materia = materia;
  novoCard.innerHTML = `<h2>${codigo}</h2><p>${turno}</p><p>${materia}</p>`;
  gridTurmas.appendChild(novoCard);

  if (!baseAlunosPorTurma[codigo]) baseAlunosPorTurma[codigo] = [];

  formNovaTurma.reset();
  voltarTurmas();
});

// ====== Perfil ======
btnVoltar.addEventListener('click', voltarTurmas);

formPerfil.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  alert(`Perfil atualizado:\nNome: ${nome || '(sem alteração)'}\nEmail: ${email || '(sem alteração)'}\nSenha: ${senha ? '••••••' : '(não alterada)'}`);
  voltarTurmas();
});

// ====== Histórico de chamada por turma (Agenda) ======
function salvarChamadaNaAgenda(codigoTurma) {
  const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const chave = `agenda_${codigoTurma}`;
  const historico = JSON.parse(localStorage.getItem(chave)) || [];
  if (!historico.includes(hoje)) {
    historico.push(hoje);
    localStorage.setItem(chave, JSON.stringify(historico));
  }
}

function carregarAgenda(codigoTurma) {
  const chave = `agenda_${codigoTurma}`;
  const historico = JSON.parse(localStorage.getItem(chave)) || [];
  if (historico.length === 0) {
    agendaInfo.innerHTML = `<p>Nenhuma chamada registrada ainda para esta turma.</p>`;
  } else {
    agendaInfo.innerHTML = `
      <p>Chamada registrada nos seguintes dias:</p>
      <ul>
        ${historico.map(data => `<li>${formatarData(data)}</li>`).join('')}
      </ul>
    `;
  }
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ====== Janela da Turma (Chamada/Agenda) ======
btnVoltarTurmas.addEventListener('click', voltarTurmas);

// Alternância de abas dentro da janela da turma
btnChamada.addEventListener('click', function (e) {
  e.preventDefault();
  chamadaSection.style.display = 'block';
  agendaSection.style.display = 'none';
  this.classList.add('active');
  btnAgenda.classList.remove('active');
});
btnAgenda.addEventListener('click', function (e) {
  e.preventDefault();
  chamadaSection.style.display = 'none';
  agendaSection.style.display = 'block';
  this.classList.add('active');
  btnChamada.classList.remove('active');
});

// Faixas de cores conforme seu modelo
function corPercentual(valorNum) {
  if (valorNum === 100) return 'verde';
  if (valorNum === 79 || valorNum === 75) return 'amarelo';
  if (valorNum === 50) return 'vermelho';
  return valorNum >= 95 ? 'verde' : 'amarelo';
}

// Abrir a janela da turma preenchendo conteúdo
function abrirJanelaTurma({ codigo, turno, materia }) {
  sidebarTitulo.textContent = codigo;
  agendaInfo.textContent = `Agenda e compromissos da turma ${codigo} (${turno}, ${materia}).`;

  const lista = baseAlunosPorTurma[codigo] || [];

  tbodyAlunos.innerHTML = lista.map(item => {
    const valor = parseInt((item.freq?.valor || '100%').replace('%', ''), 10);
    const classeCor = corPercentual(isNaN(valor) ? 100 : valor);
    const bloqueado = item.freq?.bloqueado ? 'bloqueado' : '';
    return `
      <tr class="${bloqueado}" data-status="${bloqueado ? 'bloqueado' : 'normal'}">
        <td>${item.nome}</td>
        <td>${item.ra}</td>
        <td class="frequencia">
          <span class="lock" aria-hidden="true">🔒</span>
          <button type="button" class="pf-btn p">P</button>
          <button type="button" class="pf-btn f">F</button>
          <span class="percentual ${classeCor}">${item.freq?.valor || '100%'}</span>
          <button type="button" class="btn-a" title="Marcar Ausência">A</button>
        </td>
      </tr>
    `;
  }).join('');

  // Aba padrão
  chamadaSection.style.display = 'block';
  agendaSection.style.display = 'none';
  btnChamada.classList.add('active');
  btnAgenda.classList.remove('active');

  // Interações linha a linha
  Array.from(tbodyAlunos.querySelectorAll('tr')).forEach(tr => {
    const btnP = tr.querySelector('.pf-btn.p');
    const btnF = tr.querySelector('.pf-btn.f');
    const btnA = tr.querySelector('.btn-a');
    const lock = tr.querySelector('.lock');
    const percEl = tr.querySelector('.percentual');

    // Estados iniciais
    const isBlocked = tr.classList.contains('bloqueado');
    btnP.disabled = isBlocked;
    btnF.disabled = isBlocked;
    lock.style.opacity = isBlocked ? '1' : '0';
    if (isBlocked) btnA.classList.add('ativo');

    // P: presente
    btnP.addEventListener('click', () => {
      if (tr.classList.contains('bloqueado')) return;
      btnP.classList.add('selecionado');
      btnF.classList.remove('selecionado');
      const valor = 100;
      percEl.textContent = `${valor}%`;
      percEl.className = `percentual ${corPercentual(valor)}`;
    });

    // F: falta
    btnF.addEventListener('click', () => {
      if (tr.classList.contains('bloqueado')) return;
      btnF.classList.add('selecionado');
      btnP.classList.remove('selecionado');
      const valor = 50;
      percEl.textContent = `${valor}%`;
      percEl.className = `percentual ${corPercentual(valor)}`;
    });

    // A: ausente (bloqueia P/F e mostra cadeado). Toggle.
    btnA.addEventListener('click', () => {
      const bloqueado = tr.classList.toggle('bloqueado');
      tr.dataset.status = bloqueado ? 'bloqueado' : 'normal';
      lock.style.opacity = bloqueado ? '1' : '0';
      btnP.disabled = bloqueado;
      btnF.disabled = bloqueado;
      btnA.classList.toggle('ativo', bloqueado);

      const valor = bloqueado ? 75 : 100;
      percEl.textContent = `${valor}%`;
      percEl.className = `percentual ${corPercentual(valor)}`;
    });
  });

  // Carregar histórico da agenda desta turma
  carregarAgenda(codigo);

  // Guardar turma atual para uso no envio
  janelaTurmaSection.dataset.turmaAtual = codigo;

  mostrarSecao('janelaTurma');
}

// Envio da chamada: salva dia na agenda e mostra resumo
formChamada.addEventListener('submit', function(event) {
  event.preventDefault();
  const linhas = document.querySelectorAll('#tbodyAlunos tr');
  let resultado = 'Resultado da Chamada:\n\n';

  linhas.forEach(linha => {
    const nome = linha.children[0].textContent.trim();
    const ra = linha.children[1].textContent.trim();
    const freq = linha.querySelector('.frequencia .percentual')?.textContent.trim() || 'N/A';
    const bloqueado = linha.classList.contains('bloqueado') ? ' (ausência marcada)' : '';
    resultado += `${nome} / ${ra} / Frequência: ${freq}${bloqueado}\n`;
  });

  alert(resultado);

  // Salvar na agenda como dia concluído
  const codigoTurma = janelaTurmaSection.dataset.turmaAtual || sidebarTitulo.textContent;
  salvarChamadaNaAgenda(codigoTurma);

  // Atualizar visual da agenda após salvar
  carregarAgenda(codigoTurma);
});