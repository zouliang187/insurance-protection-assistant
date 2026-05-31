# 产品数据字段草案

## 1. 设计原则

产品库不是销售榜单，而是条款信息结构化工具。

字段设计应服务于三个目标：

- 帮用户看懂保障质量
- 帮用户识别限制条件
- 帮平台形成透明、可复核的数据基础

## 2. 通用字段

| 字段 | 含义 |
| --- | --- |
| product_id | 产品唯一编号 |
| product_name | 产品名称 |
| insurer | 保险公司 |
| product_type | 产品类型 |
| version | 产品版本 |
| source_url | 条款或官方页面来源 |
| source_file | 条款文件 |
| data_updated_at | 数据更新日期 |
| status | 在售、停售、待核验 |
| notes | 数据备注 |

## 3. 投保条件字段

| 字段 | 含义 |
| --- | --- |
| min_entry_age | 最小投保年龄 |
| max_entry_age | 最大投保年龄 |
| max_renewal_age | 最高续保年龄 |
| occupation_limit | 职业限制 |
| region_limit | 地区限制 |
| social_insurance_required | 是否要求医保 |
| health_declaration_level | 健康告知严格程度 |
| health_declaration_summary | 健康告知摘要 |
| underwriting_type | 智能核保、人工核保、无核保等 |

## 4. 保障责任字段

| 字段 | 含义 |
| --- | --- |
| coverage_amount | 保额 |
| deductible | 免赔额 |
| reimbursement_rate | 报销比例 |
| inpatient_coverage | 住院医疗 |
| outpatient_coverage | 门急诊 |
| special_drug_coverage | 特药责任 |
| proton_heavy_ion | 质子重离子 |
| cancer_extra_coverage | 癌症额外责任 |
| accident_medical | 意外医疗 |
| death_disability | 身故伤残 |
| critical_illness_lump_sum | 重疾一次性给付 |

## 5. 医疗险重点字段

| 字段 | 含义 |
| --- | --- |
| reimbursement_scope | 社保内、社保外、进口药、自费药 |
| hospital_scope | 医院范围 |
| waiting_period | 等待期 |
| renewal_clause | 续保条款 |
| guaranteed_renewal_years | 保证续保年限 |
| premium_adjustment_rule | 费率调整规则 |
| claim_direct_billing | 是否支持直付或垫付 |
| pre_existing_condition_rule | 既往症规则 |
| excluded_diseases | 主要除外疾病 |

## 6. 惠民保重点字段

| 字段 | 含义 |
| --- | --- |
| city | 城市 |
| government_guidance | 是否有政府指导或支持 |
| enrollment_period | 参保期 |
| coverage_period | 保障期 |
| local_medical_insurance_required | 是否要求当地医保 |
| in_catalog_deductible | 医保目录内免赔额 |
| out_catalog_deductible | 医保目录外免赔额 |
| special_drug_list | 特药清单 |
| pre_existing_condition_pay_ratio | 既往症赔付比例 |
| healthy_people_pay_ratio | 非既往症赔付比例 |

## 7. 适配标签

标签只做辅助，不做绝对结论：

- 适合父母
- 适合高龄
- 健康告知较宽松
- 适合预算有限
- 适合医保补充
- 续保稳定性较强
- 免赔额较高
- 既往症限制较多
- 需重点核对健康告知

## 8. 风险提示字段

| 字段 | 含义 |
| --- | --- |
| key_limitations | 主要限制 |
| common_misunderstandings | 常见误解 |
| before_buy_checklist | 投保前核对清单 |
| not_suitable_for | 可能不适合人群 |
| manual_review_needed | 是否建议人工确认 |

## 9. 示例 JSON

```json
{
  "product_id": "medical_example_001",
  "product_name": "示例百万医疗险",
  "insurer": "示例保险公司",
  "product_type": "百万医疗险",
  "status": "待核验",
  "min_entry_age": 0,
  "max_entry_age": 60,
  "max_renewal_age": 100,
  "coverage_amount": 2000000,
  "deductible": 10000,
  "reimbursement_scope": "社保内外合理医疗费用",
  "guaranteed_renewal_years": 20,
  "health_declaration_level": "较严格",
  "key_limitations": [
    "需通过健康告知",
    "一般医疗责任有免赔额",
    "停售和续保条款需核对"
  ],
  "before_buy_checklist": [
    "确认既往症是否涉及健康告知",
    "确认是否有保证续保",
    "确认社保外用药是否覆盖",
    "确认父母年龄是否符合投保范围"
  ],
  "data_updated_at": "2026-05-21"
}
```
