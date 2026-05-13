const CHAPTERS = [
  { id: 0,  title: "Why Python?",                  sub: "C++ 开发者的第一眼", file: "ch0.html"  },
  { id: 1,  title: "Python Fundamentals",          sub: "基础语法",           file: "ch1.html"  },
  { id: 2,  title: "Control Flow",                 sub: "控制流",             file: "ch2.html"  },
  { id: 3,  title: "Data Structures",              sub: "数据结构",           file: "ch3.html"  },
  { id: 4,  title: "Functions & Scope",            sub: "函数与作用域",       file: "ch4.html"  },
  { id: 5,  title: "Modules & Ecosystem",          sub: "模块与生态",         file: "ch5.html"  },
  { id: 6,  title: "File I/O & Data Formats",      sub: "文件操作",           file: "ch6.html"  },
  { id: 7,  title: "NumPy",                        sub: "数值计算基础",       file: "ch7.html"  },
  { id: 8,  title: "Pandas: Working with Data",    sub: "数据处理",           file: "ch8.html"  },
  { id: 9,  title: "Data Cleaning",                sub: "数据清洗",           file: "ch9.html"  },
  { id: 10, title: "Transform & Aggregate",        sub: "数据变换",           file: "ch10.html" },
  { id: 11, title: "Data Visualization",           sub: "数据可视化",         file: "ch11.html" },
  { id: 12, title: "Machine Learning",             sub: "机器学习基础",       file: "ch12.html" },
  { id: 13, title: "Capstone Project",             sub: "综合项目",           file: "ch13.html" },
];

const TOTAL = CHAPTERS.filter(c => c.file).length; // 14

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const currentId = body.dataset.chapter !== undefined ? parseInt(body.dataset.chapter) : -1;

  /* ── Progress sets ── */
  const visited = new Set(JSON.parse(localStorage.getItem('py_visited') || '[]'));
  const done    = new Set(JSON.parse(localStorage.getItem('py_done')    || '[]'));

  if (currentId >= 0) {
    visited.add(currentId);
    localStorage.setItem('py_visited', JSON.stringify([...visited]));
  }

  /* ── Helpers ── */
  function saveDone() {
    localStorage.setItem('py_done', JSON.stringify([...done]));
  }

  function countDone() { return done.size; }

  /* ── Build sidebar ── */
  const list = document.querySelector('.chapter-list');
  if (list) {
    CHAPTERS.forEach(ch => {
      const li = document.createElement('li');
      li.className = 'chapter-item';

      const a = document.createElement('a');
      a.href = ch.file || '#';

      const classes = ['chapter-link'];
      if (!ch.file) classes.push('placeholder');
      else if (ch.id === currentId)   classes.push('active');
      else if (done.has(ch.id))       classes.push('completed');
      else if (visited.has(ch.id))    classes.push('visited');
      a.className = classes.join(' ');

      a.innerHTML = `
        <span class="chapter-num">${String(ch.id).padStart(2,'0')}</span>
        <span class="chapter-link-text">${ch.title}</span>
        <span class="progress-dot"></span>`;

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ── Inject progress bar into sidebar ── */
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
    pBar.querySelector('.progress-label').textContent = `${n} / ${TOTAL} chapters complete`;
  }
  updateProgressBar();

  /* ── Mark-as-done button ── */
  const doneBtn = document.getElementById('mark-done-btn');
  if (doneBtn && currentId >= 0) {
    if (done.has(currentId)) {
      doneBtn.textContent = '✓ Marked as complete';
      doneBtn.classList.add('done-state');
    }
    doneBtn.addEventListener('click', () => {
      if (done.has(currentId)) {
        done.delete(currentId);
        doneBtn.textContent = 'Mark as complete';
        doneBtn.classList.remove('done-state');
        // revert sidebar dot
        const link = list?.querySelector(`a[href="ch${currentId}.html"]`);
        if (link) { link.classList.remove('completed'); link.classList.add('active'); }
      } else {
        done.add(currentId);
        doneBtn.textContent = '✓ Marked as complete';
        doneBtn.classList.add('done-state');
        // update sidebar dot
        const link = list?.querySelector(`a[href="ch${currentId}.html"]`);
        if (link) link.classList.add('completed');
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
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
    sidebar.querySelectorAll('.chapter-link').forEach(lnk => {
      lnk.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    });
  }

  /* ── Copy buttons ── */
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');

    btn.addEventListener('click', async () => {
      const code = block.querySelector('code');
      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      } catch {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });

    block.appendChild(btn);
  });

  /* ── Highlight.js ── */
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  }

  /* ── Quiz renderer ── */
  const quizEl    = document.getElementById('quiz');
  const quizData  = document.getElementById('quiz-data');

  if (quizEl && quizData) {
    const questions = JSON.parse(quizData.textContent);
    renderQuiz(quizEl, questions);
  }

  function renderQuiz(container, questions) {
    container.innerHTML = '';
    container.className = 'quiz-container';

    const title = document.createElement('div');
    title.className = 'quiz-title';
    title.innerHTML = `<span class="quiz-badge">Quick Quiz</span> Test Your Understanding`;
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
        <button class="quiz-check-btn" data-qi="${qi}" disabled>Check Answer</button>`;

      container.appendChild(card);
    });

    // Score card (hidden until all checked)
    const scoreCard = document.createElement('div');
    scoreCard.className = 'quiz-score';
    scoreCard.hidden = true;
    scoreCard.innerHTML = `
      <div class="score-inner">
        <div class="score-num" id="score-num">0 / ${questions.length}</div>
        <div class="score-label">Keep going — each mistake is a data point. 📊</div>
      </div>`;
    container.appendChild(scoreCard);

    // Event delegation
    container.addEventListener('click', e => {
      // Select option
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

      // Check answer
      const checkBtn = e.target.closest('.quiz-check-btn');
      if (checkBtn) {
        const qi = parseInt(checkBtn.dataset.qi);
        if (state[qi].checked || state[qi].selected === null) return;

        state[qi].checked = true;
        checkBtn.disabled = true;
        checkBtn.style.display = 'none';

        const correct = (state[qi].selected === q_for(qi).answer);
        const feedback = card_for(qi).querySelector('.quiz-feedback');

        card_for(qi).querySelectorAll('.quiz-option').forEach((b, i) => {
          if (i === q_for(qi).answer) b.classList.add('correct');
          else if (i === state[qi].selected && !correct) b.classList.add('wrong');
        });

        feedback.hidden = false;
        feedback.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `
          <strong>${correct ? '✓ Correct!' : '✗ Not quite.'}</strong>
          ${q_for(qi).explanation}`;

        if (state.every(s => s.checked)) {
          const score = state.filter((s, i) => s.selected === q_for(i).answer).length;
          scoreCard.hidden = false;
          document.getElementById('score-num').textContent = `${score} / ${questions.length}`;
          const lbl = scoreCard.querySelector('.score-label');
          if (score === questions.length) lbl.textContent = 'Perfect! You nailed it. 🎯';
          else if (score >= questions.length / 2) lbl.textContent = 'Good effort — review the explanations above.';
          else lbl.textContent = 'Worth re-reading this chapter before moving on.';
          scoreCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    function card_for(qi) { return container.querySelector(`#q-${qi}`); }
    function q_for(qi)    { return questions[qi]; }
  }
});
