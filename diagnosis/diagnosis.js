const screens = {
  intro: document.getElementById("intro"),
  quiz: document.getElementById("quiz"),
  result: document.getElementById("result"),
};

const el = {
  startBtn: document.getElementById("startBtn"),
  backBtn: document.getElementById("backBtn"),
  nextBtn: document.getElementById("nextBtn"),
  retryBtn: document.getElementById("retryBtn"),

  sectionLabel: document.getElementById("sectionLabel"),
  qIndex: document.getElementById("qIndex"),
  qTotal: document.getElementById("qTotal"),
  progressFill: document.getElementById("progressFill"),

  questionText: document.getElementById("questionText"),
  choices: document.getElementById("choices"),

  scoreNum: document.getElementById("scoreNum"),
  gradeText: document.getElementById("gradeText"),
  meterFill: document.getElementById("meterFill"),
  resultStrength: document.getElementById("resultStrength"),
  resultNext: document.getElementById("resultNext"),
};

// ✅ ここをあなたの28問に差し替え
// type: "scale" (1-7), "single" (選択), "ab" (A/B), "text" (短文)
const QUESTIONS = [
  { section:"A", type:"scale", text:"私は自分自身の仕事を選ぶ上での価値観TOP3を、理由付きで説明できる" },
  { section:"A", type:"scale", text:"私は自分の強みを、具体的な行動レベルで説明できる" },
  
  {
    section:"B", type:"single",
    text:"直近3ヶ月で、自己分析のためにやったこと",
    options:[
      { label:"全く何もしていない", score:-3 },
      { label:"記事・動画を見た", score:0 },
      { label:"ワーク（自分史・モチベーショングラフ）をやった", score:3 },
      { label:"人に話してフィードバックをもらった", score:4 },
    ]
  },
  { section:"C", type:"ab", text:"年収は高いが裁量は小さい vs 年収は平均だが裁量が大きい", a:"A：年収は高いが、裁量は小さい", b:"B：年収は平均だが、裁量が大きい" },
  { section:"C", type:"ab", text:"安定した大企業 vs 不安定だが成長環境のベンチャー", a:"A：安定した大企業", b:"B：不安定だが成長環境のベンチャー" },

{ section:"C", type:"ab", text:"個人評価が明確 vs チーム評価が強い", a:"A：個人評価が明確", b:"B：チーム評価が強い" },

{ section:"C", type:"ab", text:"専門性が深まるが業界は狭い vs 汎用スキルが広がるが専門性は浅い", a:"A：専門性が深まるが、業界は狭い", b:"B：汎用スキルが広がるが、専門性は浅い" },

{ section:"C", type:"ab", text:"顧客と深く関わる仕事 vs 顧客接点は少ないが論理で価値を出す仕事", a:"A：顧客と深く関わる仕事", b:"B：顧客接点は少ないが、論理で価値を出す仕事" },

{ section:"C", type:"ab", text:"若いうちは多少無理してでも成長 vs 無理せず長期的に安定成長", a:"A：若いうちは多少無理してでも成長", b:"B：無理せず長期的に安定成長" },

{ section:"C", type:"ab", text:"ルールは厳しいが学びが多い vs 自由だが学びは自分次第", a:"A：ルールは厳しいが、学びが多い", b:"B：自由だが、学びは自分次第" },

{ section:"C", type:"ab", text:"短期成果型（営業・運用） vs 長期成果型（企画・戦略）", a:"A：短期成果型（営業・運用）", b:"B：長期成果型（企画・戦略）" },

  { section:"D", type:"text", text:"あなたの価値観TOP3を1語ずつ書いてください（例：成長／自由／信頼）" },
  {
  section: "D",type: "text",text: "あなたの強みを「行動が分かる1文」で書いてください（例：相手の話を要約し、次にやるべき行動を整理できる）"
}

];

const answers = new Array(QUESTIONS.length).fill(null);
let i = 0;

function show(which){
  Object.values(screens).forEach(s => s.classList.remove("is-active"));
  screens[which].classList.add("is-active");
}

function sectionName(s){
  return `セクション${s}`;
}

function render(){
  const q = QUESTIONS[i];

  el.sectionLabel.textContent = sectionName(q.section);
  el.qIndex.textContent = String(i + 1);
  el.qTotal.textContent = String(QUESTIONS.length);

  const pct = ((i) / (QUESTIONS.length - 1)) * 100;
  el.progressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;

  el.questionText.textContent = q.text;
  el.choices.innerHTML = "";

  // buttons
  el.backBtn.disabled = (i === 0);

  // render choices
  if (q.type === "scale"){
    // 1〜7
    const wrap = document.createElement("div");
    wrap.className = "choices";

    for (let v=1; v<=7; v++){
      const btn = document.createElement("button");
      btn.className = "choice";
      let label = "";
    if (v === 1) label = "（全く当てはまらない）";
    if (v === 7) label = "（非常に当てはまる）";

    btn.textContent = `${v}${label}`;
      if (answers[i] === v) btn.classList.add("is-selected");
      btn.onclick = () => {
        answers[i] = v;
        render();
      };
      wrap.appendChild(btn);
    }
    el.choices.appendChild(wrap);
  }

  if (q.type === "single"){
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = opt.label;
      if (answers[i] === idx) btn.classList.add("is-selected");
      btn.onclick = () => {
        answers[i] = idx;
        render();
      };
      el.choices.appendChild(btn);
    });
  }

  if (q.type === "ab"){
    ["a","b"].forEach((k, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = q[k];
      if (answers[i] === idx) btn.classList.add("is-selected");
      btn.onclick = () => {
        answers[i] = idx; // 0=A, 1=B
        render();
      };
      el.choices.appendChild(btn);
    });
  }

  if (q.type === "text"){
    const textarea = document.createElement("textarea");
    textarea.placeholder = "ここに入力（短文でOK）";
    textarea.value = answers[i] ?? "";
    textarea.style.width = "100%";
    textarea.style.minHeight = "110px";
    textarea.style.resize = "vertical";
    textarea.style.padding = "12px";
    textarea.style.borderRadius = "14px";
    textarea.style.border = "1px solid rgba(255,255,255,.12)";
    textarea.style.background = "rgba(255,255,255,.06)";
    textarea.style.color = "rgba(255,255,255,.92)";
    textarea.oninput = () => { answers[i] = textarea.value; };
    el.choices.appendChild(textarea);
  }
}

function canGoNext(){
  const q = QUESTIONS[i];
  const a = answers[i];
  if (q.type === "text") return (typeof a === "string" && a.trim().length > 0);
  return a !== null && a !== undefined;
}

// ざっくり採点（見た目確認用）
// ※あなたの「A最大32 / B最大32 / C最大24 / D最大12」に合わせてあとで精密化すればOK
function score(){
  let total = 0;

  QUESTIONS.forEach((q, idx) => {
    const a = answers[idx];

    if (q.type === "scale"){
      // 1〜7 を 0〜4点に近似（とりあえず）
      total += Math.round(((a - 1) / 6) * 4);
    }

    if (q.type === "single"){
      total += q.options[a]?.score ?? 0;
    }

    if (q.type === "ab"){
      // 一貫性判定は本来ロジック必要。とりあえず 2点固定
      total += 2;
    }

    if (q.type === "text"){
      const text = (a || "").trim();
      // 抽象語のみ判定などは後で。とりあえず文字数で加点
      if (text.length >= 20) total += 4;
      else if (text.length >= 8) total += 3;
      else total += 1;
    }
  });

  // 0〜100に丸め（仮）
  return Math.max(0, Math.min(100, Math.round((total / 40) * 100)));
}

function gradeLabel(s){
  if (s <= 39) return "5級：今すぐ自己分析するべき";
  if (s <= 54) return "4級：自己理解できていると勘違いしやすい";
  if (s <= 74) return "3級：努力は見えるが、まだ足りない";
  if (s <= 89) return "2級：就活実用レベル（もう一段深掘り）";
  return "1級：文句なし";
}

function renderResult(){
  const s = score();
  el.scoreNum.textContent = String(s);
  el.gradeText.textContent = `判定：${gradeLabel(s)}`;
  el.meterFill.style.width = `${s}%`;

  el.resultStrength.innerHTML = "";
  el.resultNext.innerHTML = "";

  const strengths = [
    "自己理解を言語化できている",
    "選択に「軸」を持ち始めている",
    "行動に落とす意識がある",
  ];
  const next = [
    "価値観→職種/業界への接続を強化",
    "弱みの対策を「習慣」にする",
    "就活の比較軸を1枚にまとめる",
  ];

  strengths.slice(0,2).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    el.resultStrength.appendChild(li);
  });
  next.slice(0,2).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    el.resultNext.appendChild(li);
  });
}

el.startBtn.onclick = () => {
  i = 0;
  show("quiz");
  render();
};

el.backBtn.onclick = () => {
  if (i > 0) i--;
  render();
};

// diagnosis.js 内のスコア計算が終わったあたりに追加
if (window.saveDiagnosisResult) {
    window.saveDiagnosisResult(currentScore, currentGrade); // 変数名はjsの定義に合わせて変えてください
}


el.nextBtn.onclick = () => {
  if (!canGoNext()){
    alert("回答を選んでから次へ進んでください");
    return;
  }
  if (i < QUESTIONS.length - 1){
    i++;
    render();
  } else {
    renderResult();
    show("result");
  }
};

el.retryBtn.onclick = () => {
  for (let k=0; k<answers.length; k++) answers[k] = null;
  i = 0;
  show("intro");
};

show("intro");
