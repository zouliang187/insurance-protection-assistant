const form = document.querySelector("#selectorForm");
const resultTitle = document.querySelector("#resultTitle");
const resultSummary = document.querySelector("#resultSummary");
const priorityList = document.querySelector("#priorityList");
const checklist = document.querySelector("#checklist");
const riskNote = document.querySelector("#riskNote");

const baseChecklist = [
  "确认父母医保是否正常参保，是否为当前居住地可用医保。",
  "整理近 2-5 年体检、门诊、住院、手术和长期用药记录。",
  "逐条核对健康告知，不要用“感觉没事”替代病历事实。",
  "确认是否保证续保、保证续保几年，以及停售后的处理方式。",
  "看清免赔额、报销比例、医院范围和社保外用药责任。",
  "确认既往症是否赔，赔付比例是否降低。"
];

const readingMap = {
  medical: "有医保后，再用商业医疗险补住院大额费用和社保外费用缺口。",
  accident: "意外险保费低，适合多数老人作为基础补充，但要看职业、年龄和意外医疗范围。",
  huimin: "惠民保投保门槛通常较低，适合作为高龄或带病人群的补充，但要重点看免赔额和既往症规则。",
  cancer: "防癌医疗或防癌险只覆盖特定疾病方向，不能替代完整医疗保障。"
};

function getFormValue(name) {
  const checked = form.querySelector(`[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

function getCheckedValues(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map((item) => item.value);
}

function setList(target, items) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function resolvePath(values) {
  const age = values.ageBand;
  const hasMedicalInfo = values.medicalInsurance === "yes";
  const lacksMedicalInfo = values.medicalInsurance === "unknown" || values.medicalInsurance === "no";
  const healthUnknown = values.healthStatus === "unknown";
  const healthNormal = values.healthStatus === "normal";
  const healthMinor = values.healthStatus === "minor";
  const healthSerious = values.healthStatus === "serious";
  const ageOlder = age === "66-70" || age === "71+";
  const ageMiddle = age === "61-65";
  const budgetLow = values.budget === "low";

  if (lacksMedicalInfo || healthUnknown) {
    return {
      code: "D",
      title: "先补齐医保和健康信息，再判断商业保障",
      summary: `${values.parentRole}的医保或健康信息还不清楚，暂时不适合直接下投保结论。先把基础信息确认清楚，能减少买错和告知错误。`,
      priorities: [
        "确认医保状态：先查职工医保或居民医保是否正常参保。",
        "收集健康资料：体检报告、门诊记录、住院记录、长期用药。",
        "再看低门槛补充：惠民保和意外险通常更容易先判断。",
        "健康情况明确后，再尝试百万医疗险或防癌类保障。"
      ],
      risk: "如果父母健康情况不清楚，不建议直接投保需要健康告知的产品；隐瞒或误告知会影响后续理赔。"
    };
  }

  if ((age === "50-55" || age === "56-60") && hasMedicalInfo && healthNormal && !budgetLow) {
    return {
      code: "A",
      title: "可优先尝试百万医疗险，同时补充意外险",
      summary: `${values.parentRole}年龄和健康情况相对友好，可以先看百万医疗险是否能正常承保，再用意外险补充日常意外风险。`,
      priorities: [
        `百万医疗险：${readingMap.medical}`,
        `意外险：${readingMap.accident}`,
        `惠民保：${readingMap.huimin}`,
        "已有保障复核：检查保单是否仍有效、续保条件是否稳定。"
      ],
      risk: "即使体检基本正常，也要逐条看健康告知；结节、息肉、血压、血糖、肝肾指标异常都可能影响承保。"
    };
  }

  if (ageMiddle || healthMinor) {
    return {
      code: "B",
      title: "百万医疗可以尝试，但健康告知要逐条核对",
      summary: `${values.parentRole}可能仍有机会配置百万医疗险，但核保不确定性增加。建议同时准备惠民保和意外险作为基础补充。`,
      priorities: [
        "百万医疗险：先看健康告知，必要时尝试智能核保或人工核保。",
        `惠民保：${readingMap.huimin}`,
        `意外险：${readingMap.accident}`,
        "防癌医疗或防癌险：如果百万医疗受限，可作为特定方向补充。"
      ],
      risk: "常见慢病或体检异常不等于一定买不了，但不能跳过告知。除外承保、加费、延期或拒保都需要提前接受。"
    };
  }

  if (ageOlder || healthSerious || budgetLow) {
    return {
      code: "C",
      title: "优先看惠民保、意外险和低门槛补充保障",
      summary: `${values.parentRole}更适合先确认医保和当地惠民保，再补充老年意外险。百万医疗险可能选择有限，不应作为唯一方案。`,
      priorities: [
        "基本医保：先保证基础医保不断缴、能正常使用。",
        `惠民保：${readingMap.huimin}`,
        `意外险：${readingMap.accident}`,
        `防癌医疗或防癌险：${readingMap.cancer}`
      ],
      risk: "高龄、重大疾病、住院或手术史会显著影响商业医疗险承保。重点看既往症是否赔、免赔额是否过高。"
    };
  }

  return {
    code: "B",
    title: "建议从基础保障组合开始核对",
    summary: `${values.parentRole}可以按医保、百万医疗、惠民保、意外险的顺序梳理，不急于比较具体产品价格。`,
    priorities: [
      "医保：确认参保和报销地。",
      "百万医疗险：核对健康告知和续保条件。",
      "惠民保：核对免赔额和既往症赔付。",
      "意外险：补充意外医疗、伤残和身故责任。"
    ],
    risk: "这是初步路径，不是销售建议。具体产品仍需回到条款、健康告知和核保结论。"
  };
}

function applyBudgetAdvice(path, budget) {
  if (budget === "low") {
    return {
      ...path,
      priorities: [
        "预算 300 元以内：先看医保是否正常，再看当地惠民保。",
        "补充老年意外险，重点看意外医疗是否包含社保外费用。",
        ...path.priorities.slice(0, 2)
      ]
    };
  }

  if (budget === "high") {
    return {
      ...path,
      priorities: [
        ...path.priorities,
        "预算较充足时，可进一步比较保证续保医疗险和防癌类保障，但仍以条款限制为准。"
      ]
    };
  }

  return path;
}

function updateResult() {
  const values = {
    parentRole: getFormValue("parentRole"),
    ageBand: getFormValue("ageBand"),
    medicalInsurance: getFormValue("medicalInsurance"),
    healthStatus: getFormValue("healthStatus"),
    budget: getFormValue("budget"),
    existingCoverage: getCheckedValues("existingCoverage")
  };

  const path = applyBudgetAdvice(resolvePath(values), values.budget);
  const hasExisting = values.existingCoverage.some((item) => item !== "不清楚或没有");
  const finalChecklist = hasExisting
    ? [
        "先把已有保单找出来，确认保障期限、续保、免责、免赔额和是否仍有效。",
        ...baseChecklist
      ]
    : baseChecklist;

  resultTitle.textContent = path.title;
  resultSummary.textContent = path.summary;
  riskNote.textContent = path.risk;
  setList(priorityList, path.priorities);
  setList(checklist, finalChecklist);
}

function syncCoverageCheckboxes(event) {
  if (event.target.name !== "existingCoverage") {
    return;
  }

  const noneOption = form.querySelector('input[value="不清楚或没有"]');
  const selectedExisting = [...form.querySelectorAll('input[name="existingCoverage"]:checked')].filter(
    (item) => item.value !== "不清楚或没有"
  );

  if (event.target.value === "不清楚或没有" && event.target.checked) {
    selectedExisting.forEach((item) => {
      item.checked = false;
    });
  }

  if (event.target.value !== "不清楚或没有" && event.target.checked) {
    noneOption.checked = false;
  }

  if (![...form.querySelectorAll('input[name="existingCoverage"]:checked')].length) {
    noneOption.checked = true;
  }
}

function drawRiskCanvas() {
  const canvas = document.querySelector("#riskCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fbf7";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#dcebe4";
  ctx.beginPath();
  ctx.arc(420, 80, 86, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f2dcc2";
  ctx.beginPath();
  ctx.arc(112, 328, 118, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#176f59";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(92, 278);
  ctx.bezierCurveTo(190, 214, 237, 204, 305, 146);
  ctx.bezierCurveTo(344, 112, 382, 102, 432, 110);
  ctx.stroke();

  const nodes = [
    { x: 92, y: 278, label: "医保", color: "#315f8f" },
    { x: 220, y: 208, label: "健康", color: "#176f59" },
    { x: 316, y: 146, label: "预算", color: "#b47a2b" },
    { x: 432, y: 110, label: "路径", color: "#0f4f40" }
  ];

  nodes.forEach((node) => {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 31, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  });

  ctx.fillStyle = "#1c2422";
  ctx.font = "800 28px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("父母保障路径", 54, 58);

  ctx.fillStyle = "#5f6f6b";
  ctx.font = "18px sans-serif";
  ctx.fillText("从基础信息开始，逐步缩小选择范围", 54, 92);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#dce6e1";
  ctx.lineWidth = 2;
  roundRect(ctx, 282, 254, 178, 92, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0f4f40";
  ctx.font = "800 18px sans-serif";
  ctx.fillText("输出清单", 306, 286);
  ctx.fillStyle = "#5f6f6b";
  ctx.font = "15px sans-serif";
  ctx.fillText("险种优先级", 306, 313);
  ctx.fillText("投保前核对", 306, 336);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

form.addEventListener("change", (event) => {
  syncCoverageCheckboxes(event);
  updateResult();
});

drawRiskCanvas();
updateResult();
