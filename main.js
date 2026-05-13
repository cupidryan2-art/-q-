const CHAPTERS = [
  { id: 0,  title: "为什么学 Python？",          sub: "给 C++ 工程师的第一课", file: "ch0.html"  },
  { id: 1,  title: "Python 基础语法",            sub: "变量·类型·运算",       file: "ch1.html"  },
  { id: 2,  title: "控制流",                     sub: "条件·循环·推导式",     file: "ch2.html"  },
  { id: 3,  title: "内置数据结构",               sub: "list·dict·set·tuple", file: "ch3.html"  },
  { id: 4,  title: "函数与作用域",               sub: "def·lambda·闭包",     file: "ch4.html"  },
  { id: 5,  title: "模块与生态系统",             sub: "import·pip·venv",     file: "ch5.html"  },
  { id: 6,  title: "文件 I/O 与数据格式",        sub: "CSV·JSON·Excel",      file: "ch6.html"  },
  { id: 7,  title: "NumPy 数值计算",             sub: "ndarray·广播·向量化", file: "ch7.html"  },
  { id: 8,  title: "Pandas 数据处理",            sub: "DataFrame·筛选·排序", file: "ch8.html"  },
  { id: 9,  title: "数据清洗",                   sub: "缺失值·重复·异常值",  file: "ch9.html"  },
  { id: 10, title: "数据变换与聚合",             sub: "groupby·merge·特征",  file: "ch10.html" },
  { id: 11, title: "数据可视化",                 sub: "matplotlib·seaborn",  file: "ch11.html" },
  { id: 12, title: "机器学习基础",               sub: "sklearn·回归·分类",   file: "ch12.html" },
  { id: 13, title: "综合项目",                   sub: "端到端数据科学管道",   file: "ch13.html" },
];

const TOTAL = CHAPTERS.filter(c => c.file).length;

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentId = body.dataset.chapter !== undefined ? parseInt(body.dataset.chapter) : -1;

  const visited = new Set(JSON.parse(localStorage.getItem('py_visited') || '[]'));
  const done    = new Set(JSON.parse(localStorage.getItem('py_done')    || '[]'));

  if (currentId >= 0) {
    visited.add(currentId);
    localStorage.setItem('py_visited', JSON.stringify([...visited]));
  }

  function saveDone() { localStorage.setItem('py_done', JSON.stringify([...done])); }
  function countDone() { return done.size; }

  /* ── Sidebar ── */
  const list = document.querySelector('.chapter-list');
  if (list) {
    CHAPTERS.forEach(ch => {
      const li = document.createElement('li');
      li.className = 'chapter-item';
      const a = document.createElement('a');
      a.href = ch.file || '#';
      const classes = ['chapter-link'];
      if (!ch.file) classes.push('placeholder');
      else if (ch.id === currentId) classes.push('active');
      else if (done.has(ch.id))     classes.push('completed');
      else if (visited.has(ch.id))  classes.push('visited');
      a.className = classes.join(' ');
      a.innerHTML = `
        <span class="chapter-num">${String(ch.id).padStart(2,'0')}</span>
        <span class="chapter-link-text">${ch.title}</span>
        <span class="progress-dot"></span>`;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ── Progress bar (injected) ── */
  const sidebarLogo = document.querySelector('.sidebar-logo');
  let pBar = null;
  if (sidebarLogo) {
    pBar = document.createElement('div');
    pBar.className = 'sidebar-progress';
    pBar.innerHTML = `
      <div class="progress-track"><div class="progress-fill"></div></div>
      <div class="progress-label"></div>`;
    sidebarLogo.insertAdjacentElement('afterend', pBar);
  }
  function updateProgressBar() {
    if (!pBar) return;
    const n = countDone();
    const pct = Math.round((n / TOTAL) * 100);
    pBar.querySelector('.progress-fill').style.width = pct + '%';
    pBar.querySelector('.progress-label').textContent = `已完成 ${n} / ${TOTAL} 章`;
  }
  updateProgressBar();

  /* ── Mark-as-done ── */
  const doneBtn = document.getElementById('mark-done-btn');
  if (doneBtn && currentId >= 0) {
    if (done.has(currentId)) { doneBtn.textContent = '✓ 已标记完成'; doneBtn.classList.add('done-state'); }
    doneBtn.addEventListener('click', () => {
      if (done.has(currentId)) {
        done.delete(currentId);
        doneBtn.textContent = '标记为已完成';
        doneBtn.classList.remove('done-state');
        const lnk = list?.querySelector(`a[href="ch${currentId}.html"]`);
        if (lnk) { lnk.classList.remove('completed'); lnk.classList.add('active'); }
      } else {
        done.add(currentId);
        doneBtn.textContent = '✓ 已标记完成';
        doneBtn.classList.add('done-state');
        const lnk = list?.querySelector(`a[href="ch${currentId}.html"]`);
        if (lnk) lnk.classList.add('completed');
      }
      saveDone();
      updateProgressBar();
    });
  }

  /* ── Mobile menu ── */
  const toggle  = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
    overlay?.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
    sidebar.querySelectorAll('.chapter-link').forEach(l => l.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); }));
  }

  /* ── Copy buttons ── */
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.querySelector('code').innerText);
        btn.textContent = '已复制！';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 2000);
      } catch { btn.textContent = '出错了'; setTimeout(() => { btn.textContent = '复制'; }, 2000); }
    });
    block.appendChild(btn);
  });

  /* ── Highlight.js ── */
  if (typeof hljs !== 'undefined') document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

  /* ── Quiz renderer ── */
  const quizEl   = document.getElementById('quiz');
  const quizData = document.getElementById('quiz-data');
  if (quizEl && quizData) renderQuiz(quizEl, JSON.parse(quizData.textContent));

  function renderQuiz(container, questions) {
    container.innerHTML = '';
    container.className = 'quiz-container';
    const title = document.createElement('div');
    title.className = 'quiz-title';
    title.innerHTML = `<span class="quiz-badge">随堂测验</span> 检验一下你学到了什么`;
    container.appendChild(title);

    const state = questions.map(() => ({ selected: null, checked: false }));

    questions.forEach((q, qi) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      card.id = `q-${qi}`;
      card.innerHTML = `
        <div class="quiz-question"><span class="q-num">Q${qi + 1}.</span> ${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <button class="quiz-option" data-qi="${qi}" data-oi="${oi}">
              <span class="opt-letter">${'ABCD'[oi]}</span>
              <span class="opt-text">${opt}</span>
            </button>`).join('')}
        </div>
        <div class="quiz-feedback" hidden></div>
        <button class="quiz-check-btn" data-qi="${qi}" disabled>确认答案</button>`;
      container.appendChild(card);
    });

    const scoreCard = document.createElement('div');
    scoreCard.className = 'quiz-score';
    scoreCard.hidden = true;
    scoreCard.innerHTML = `<div class="score-inner"><div class="score-num" id="score-num">0 / ${questions.length}</div><div class="score-label">继续加油，每次犯错都是进步。</div></div>`;
    container.appendChild(scoreCard);

    container.addEventListener('click', e => {
      const optBtn = e.target.closest('.quiz-option');
      if (optBtn) {
        const qi = parseInt(optBtn.dataset.qi);
        if (state[qi].checked) return;
        card_for(qi).querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
        optBtn.classList.add('selected');
        state[qi].selected = parseInt(optBtn.dataset.oi);
        card_for(qi).querySelector('.quiz-check-btn').disabled = false;
        return;
      }
      const checkBtn = e.target.closest('.quiz-check-btn');
      if (checkBtn) {
        const qi = parseInt(checkBtn.dataset.qi);
        if (state[qi].checked || state[qi].selected === null) return;
        state[qi].checked = true;
        checkBtn.disabled = true;
        checkBtn.style.display = 'none';
        const correct = state[qi].selected === q_for(qi).answer;
        const feedback = card_for(qi).querySelector('.quiz-feedback');
        card_for(qi).querySelectorAll('.quiz-option').forEach((b, i) => {
          if (i === q_for(qi).answer) b.classList.add('correct');
          else if (i === state[qi].selected && !correct) b.classList.add('wrong');
        });
        feedback.hidden = false;
        feedback.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `<strong>${correct ? '✓ 正确！' : '✗ 不对哦。'}</strong> ${q_for(qi).explanation}`;
        if (state.every(s => s.checked)) {
          const score = state.filter((s, i) => s.selected === q_for(i).answer).length;
          scoreCard.hidden = false;
          document.getElementById('score-num').textContent = `${score} / ${questions.length}`;
          const lbl = scoreCard.querySelector('.score-label');
          if (score === questions.length) lbl.textContent = '满分！太棒了，继续下一章吧。🎯';
          else if (score >= questions.length / 2) lbl.textContent = '不错！看看上面的解析再往下走。';
          else lbl.textContent = '建议重读一遍本章，再来挑战。';
          scoreCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    function card_for(qi) { return container.querySelector(`#q-${qi}`); }
    function q_for(qi)    { return questions[qi]; }
  }
});
