/* ===== Mock Data — Deterministic demo data for all three journeys ===== */

export const USER = {
  name: 'Demo User',
  avatar: 'SS',
  netWorth: 2450000,
  bankBalance: 1250000,
  investments: 1200000,
};

/* ---------- LOAN ---------- */
export const LOAN_DECISION = {
  id: 'PL-284761',
  product: 'loan',
  category: 'personal_loan',
  decision: { status: 'not_approved', label: 'Not Approved' },
  date: '2026-09-21',
  requested_amount: 250000,
  confidence: 0.78,
  disclaimer: 'Likely factors based on available information; not the official decision rationale.',
};

export const LOAN_PROFILE = {
  credit_utilisation: 71,
  available_credit: 150000,
  used_credit: 106500,
  late_payments_6m: 2,
  credit_history_months: 14,
  outstanding_balance: 31950,
  monthly_income: 65000,
  requested_amount: 250000,
  debt_to_income: 0.49,
  active_accounts: 3,
};

export const LOAN_FACTORS = [
  {
    id: 'credit_score',
    label: 'Credit score',
    impact: 'high',
    value: 680,
    unit: '',
    description: 'Your credit score is below the example lending threshold used for this demonstration.',
    whyItMatters: 'Credit scores are a primary signal used by lenders to assess overall creditworthiness and default risk.',
    evidence: {
      fields: [
        { label: 'Reported score', value: '680' },
        { label: 'Bureau', value: 'Example Bureau' },
        { label: 'Data updated', value: '20 Sep 2026' },
        { label: 'Source', value: 'Credit profile data' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.34 },
    actions: ['improve_credit_score'],
  },
  {
    id: 'credit_utilisation',
    label: 'High credit utilisation',
    impact: 'high',
    value: 71,
    unit: '%',
    description: 'A large portion of your available revolving credit is currently being used.',
    whyItMatters: 'Using a large portion of available revolving credit can indicate limited remaining borrowing capacity.',
    evidence: {
      fields: [
        { label: 'Current utilisation', value: '71%' },
        { label: 'Available credit', value: '₹2.00L' },
        { label: 'Used credit', value: '₹1.42L' },
        { label: 'Calculation', value: '1.42 ÷ 2.00 × 100 = 71%' },
        { label: 'Source', value: 'Application / account information' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.31 },
    actions: ['reduce_outstanding_balance'],
  },
  {
    id: 'late_payments',
    label: 'Recent payment pattern',
    impact: 'high',
    value: 2,
    unit: 'late payments',
    description: 'The application data shows 2 late payments within the last 6 months.',
    whyItMatters: 'Recent missed or delayed payments indicate higher immediate repayment risk.',
    evidence: {
      fields: [
        { label: 'Late payments (6 months)', value: '2' },
        { label: 'Last late payment', value: 'Aug 2026' },
        { label: 'Source', value: 'Repayment history' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.27 },
    actions: ['make_timely_payments'],
  },
  {
    id: 'debt_to_income',
    label: 'Debt-to-income ratio',
    impact: 'medium', // Stored as medium, can visually show as medium/high if needed
    value: 48,
    unit: '%',
    description: 'Your estimated monthly debt obligations consume 48% of your income.',
    whyItMatters: 'A high DTI suggests you may have less disposable income available for new loan EMIs.',
    evidence: {
      fields: [
        { label: 'Estimated DTI', value: '48%' },
        { label: 'Monthly income', value: '₹65,000' },
        { label: 'Est. obligations', value: '₹31,200' },
        { label: 'Source', value: 'Derived financial signals' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.22 },
    actions: ['increase_income_or_reduce_debt'],
  },
  {
    id: 'credit_history',
    label: 'Length of credit history',
    impact: 'medium',
    value: 14,
    unit: 'months',
    description: 'Your credit history spans approximately 14 months.',
    whyItMatters: 'Lenders prefer longer credit histories to better understand long-term financial behavior.',
    evidence: {
      fields: [
        { label: 'Credit history', value: '14 months' },
        { label: 'First account', value: 'Jul 2025' },
        { label: 'Source', value: 'Credit profile data' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.18 },
    actions: ['maintain_accounts'],
  },
  {
    id: 'recent_enquiries',
    label: 'Recent credit enquiries',
    impact: 'medium',
    value: 4,
    unit: 'in 6 months',
    description: 'There have been 4 recent credit enquiries on your profile.',
    whyItMatters: 'Multiple recent applications can signal credit-seeking behavior and potential financial stress.',
    evidence: {
      fields: [
        { label: 'Recent enquiries', value: '4' },
        { label: 'Period', value: 'Last 6 months' },
        { label: 'Source', value: 'Credit profile data' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.14 },
    actions: ['limit_new_credit_applications'],
  },
  {
    id: 'outstanding_debt',
    label: 'Existing outstanding debt',
    impact: 'medium',
    value: 240000,
    unit: '₹',
    description: 'Your total current outstanding debt is approximately ₹2.4 lakh.',
    whyItMatters: 'High existing debt balances limit your capacity to take on additional borrowing.',
    evidence: {
      fields: [
        { label: 'Total outstanding', value: '₹2.40L' },
        { label: 'Data period', value: 'Current reported balances' },
        { label: 'Source', value: 'Existing debt information' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.12 },
    actions: ['pay_down_existing_debt'],
  },
  {
    id: 'income_stability',
    label: 'Income stability',
    impact: 'low',
    isPositive: true,
    value: 'Stable',
    unit: 'pattern',
    description: 'You have a consistent monthly income pattern.',
    whyItMatters: 'Stable income provides confidence in your ability to make regular monthly payments.',
    evidence: {
      fields: [
        { label: 'Income pattern', value: 'Stable' },
        { label: 'Verified', value: 'Yes' },
        { label: 'Source', value: 'Application information' },
      ],
    },
    explanation: { type: 'shap', contribution: 0.08 },
    actions: [],
  },
];

export const LOAN_WHATIF_CONFIG = {
  groups: [
    {
      id: 'credit_profile',
      label: 'Credit Profile',
      variables: ['credit_score', 'credit_utilisation', 'recent_enquiries', 'credit_history']
    },
    {
      id: 'repayment_behaviour',
      label: 'Repayment Behaviour',
      variables: ['late_payments']
    },
    {
      id: 'financial_capacity',
      label: 'Financial Capacity',
      variables: ['monthly_income', 'outstanding_balance', 'debt_to_income']
    }
  ],
  variables: {
    credit_score: { 
      id: 'credit_score', label: 'Credit score', current: 680, min: 300, max: 900, unit: '', step: 1,
      type: 'slider', direction: 'higher_is_better' 
    },
    credit_utilisation: { 
      id: 'credit_utilisation', label: 'Credit utilisation', current: 71, min: 0, max: 100, unit: '%', step: 1,
      type: 'slider', direction: 'lower_is_better' 
    },
    recent_enquiries: { 
      id: 'recent_enquiries', label: 'Recent credit enquiries', current: 4, min: 0, max: 10, unit: '', step: 1,
      type: 'stepper', direction: 'lower_is_better' 
    },
    credit_history: { 
      id: 'credit_history', label: 'Length of credit history', current: 14, min: 6, max: 120, unit: ' months', step: 1,
      type: 'slider', direction: 'higher_is_better' 
    },
    late_payments: { 
      id: 'late_payments', label: 'Late payments', current: 2, min: 0, max: 6, unit: '', step: 1,
      type: 'stepper', direction: 'lower_is_better' 
    },
    monthly_income: { 
      id: 'monthly_income', label: 'Monthly income', current: 65000, min: 20000, max: 200000, unit: '₹', step: 5000,
      type: 'slider_numeric', direction: 'higher_is_better' 
    },
    outstanding_balance: { 
      id: 'outstanding_balance', label: 'Outstanding balance', current: 31950, min: 0, max: 500000, unit: '₹', step: 5000,
      type: 'slider_numeric', direction: 'lower_is_better' 
    },
    debt_to_income: { 
      id: 'debt_to_income', label: 'Debt-to-income ratio', current: 48, min: 0, max: 100, unit: '%', step: 1,
      type: 'slider', direction: 'lower_is_better' 
    }
  }
};

export const LOAN_PLAN = {
  duration: 60,
  highPriorityCount: 3,
  mediumPriorityCount: 2,
  totalActions: 8,
  profileSnapshot: {
    credit_utilisation: '71%',
    late_payments: '2',
    outstanding_balance: '₹31,950'
  },
  topPriority: {
    id: 'reduce_utilisation',
    factorId: 'credit_utilisation',
    title: 'Reduce credit utilisation',
    priority: 'HIGH',
    currentValue: 71,
    targetValue: 45,
    unit: '%',
    whyItMatters: 'Utilisation was one of the stronger signals identified in your explanation.',
    action: 'Reduce revolving credit balances where practical.',
    timeframe: 'Weeks 1–4',
    status: 'not_started',
    estimatedImpact: 'High'
  },
  topThree: [
    'Keep every upcoming payment on time.',
    'Reduce revolving credit utilisation where financially manageable.',
    'Avoid unnecessary new credit applications.'
  ],
  timeline: [
    {
      week: 'Week 1',
      label: 'Understand & prepare',
      tasks: [
        { id: 't1', text: 'Review current outstanding balances', done: true },
        { id: 't2', text: 'Review upcoming payment due dates', done: true },
        { id: 't3', text: 'Enable payment reminders/autopay where appropriate', done: false },
        { id: 't4', text: 'Review credit report for possible errors', done: false }
      ]
    },
    {
      week: 'Week 2',
      label: 'Start reducing utilisation',
      tasks: [
        { id: 't5', text: 'Make a manageable payment toward revolving balances', done: false },
        { id: 't6', text: 'Avoid unnecessary new credit applications', done: false }
      ]
    },
    {
      week: 'Week 3–4',
      label: 'Build consistency',
      tasks: [
        { id: 't7', text: 'Keep all payments on time', done: false },
        { id: 't8', text: 'Track utilisation', done: false },
        { id: 't9', text: 'Avoid increasing outstanding balances unnecessarily', done: false }
      ]
    },
    {
      week: 'Week 5–6',
      label: 'Review progress',
      tasks: [
        { id: 't10', text: 'Check whether balances are trending downward', done: false },
        { id: 't11', text: 'Review repayment consistency', done: false },
        { id: 't12', text: 'Reassess monthly budget', done: false }
      ]
    },
    {
      week: 'Week 7–8',
      label: 'Reassess',
      tasks: [
        { id: 't13', text: 'Review updated financial signals when new data is available', done: false },
        { id: 't14', text: 'Compare current profile with original profile', done: false },
        { id: 't15', text: 'Decide whether another application is appropriate', done: false }
      ]
    }
  ],
  controlledFactors: [
    'Payment consistency',
    'Outstanding balances',
    'Credit utilisation',
    'New credit applications',
    'Payment reminders',
    'Budget allocation'
  ],
  slowFactors: [
    'Length of credit history',
    'Historical late payments',
    'Existing enquiry history'
  ],
  preApplication: [
    'Confirm recent payments are up to date',
    'Review your current outstanding balances',
    'Check your updated credit information',
    'Review your affordability',
    'Confirm the requested loan amount is appropriate',
    'Review the lender\'s current eligibility criteria'
  ]
};

export const LOAN_PROGRESS = {
  startDate: '2026-09-20',
  duration: 60,
  planProgress: {
    completedActions: 4,
    totalActions: 8,
    highPriorityCompleted: 2,
    highPriorityTotal: 3,
    nextMilestone: 'Week 4 review'
  },
  completedTasks: [
    { id: 't1', title: 'Payment reminder enabled', date: '21 Sep', factor: 'Payment consistency' },
    { id: 't2', title: '₹5,000 balance payment', date: '24 Sep', factor: 'Outstanding balance' },
    { id: 't3', title: 'Reviewed credit enquiries', date: '26 Sep', factor: 'Credit profile' },
    { id: 't4', title: 'Maintained payment schedule', date: 'Current', factor: 'Payment consistency' }
  ],
  nextActions: [
    { id: 'n1', title: 'Keep upcoming payment on time', due: '05 Oct', priority: 'HIGH' },
    { id: 'n2', title: 'Review utilisation', due: '12 Oct', priority: 'HIGH' },
    { id: 'n3', title: 'Complete Week 4 check-in', due: '19 Oct', priority: 'MEDIUM' }
  ],
  signals: [
    {
      id: 'credit_utilisation',
      label: 'Credit utilisation',
      start: 77,
      current: 42,
      target: 40,
      unit: '%',
      direction: 'lower_is_better',
      history: [77, 70, 65, 55, 42],
      updated: '2 days ago'
    },
    {
      id: 'outstanding_balance',
      label: 'Outstanding balance',
      start: 31950,
      current: 21500,
      target: 18000,
      unit: '₹',
      direction: 'lower_is_better',
      history: [31950, 26950, 21500],
      updated: '24 Sep 2026'
    },
    {
      id: 'payment_consistency',
      label: 'Payment consistency',
      startStr: '2 late payments',
      currentStr: '5 / 6 on time',
      targetStr: '6 / 6',
      unit: '',
      statusOverride: 'NEEDS ATTENTION',
      customAction: 'One more consistent payment cycle to reach your selected target.',
      updated: '5 days ago'
    },
    {
      id: 'credit_history',
      label: 'Credit history',
      start: 14,
      current: 16,
      target: null,
      unit: ' months',
      direction: 'higher_is_better',
      statusOverride: 'GRADUAL CHANGE',
      customAction: 'Credit history changes naturally over time.',
      updated: '01 Oct 2026'
    }
  ],
  journey: [
    { date: '20 Sep', status: 'completed', text: 'Plan started' },
    { date: '24 Sep', status: 'completed', text: 'Balance payment' },
    { date: '26 Sep', status: 'completed', text: 'Credit review' },
    { date: '03 Oct', status: 'current', text: 'Current progress' },
    { date: '19 Oct', status: 'pending', text: 'Week 4 review' },
    { date: '20 Nov', status: 'pending', text: 'Day 60 reassessment' }
  ],
  milestones: [
    { label: 'Utilisation <40%', current: '42%' },
    { label: '6/6 payments on time', current: '5/6' },
    { label: 'Day 60 review', current: '20 Nov 2026' }
  ]
};

/* ---------- INSURANCE ---------- */
export const INSURANCE_DECISION = {
  id: 'CL-839274',
  product: 'insurance',
  category: 'motor_insurance',
  decision: { status: 'partially_approved', label: 'Partially Approved' },
  date: '2026-09-18',
  claimed_amount: 84500,
  approved_amount: 61250,
  confidence: 0.85,
  disclaimer: 'Illustrative explanation based on the available policy and claim information. Final settlement depends on the applicable policy and insurer assessment.',
};

export const INSURANCE_FACTORS = [
  {
    id: 'coverage_limit',
    label: 'Coverage limit',
    impact: 'high',
    value: 75000,
    unit: '₹',
    description: 'Your policy coverage is ₹75,000, which is less than the claimed amount.',
    evidence: {
      fields: [
        { label: 'Policy coverage', value: '₹75,000' },
        { label: 'Claim submitted', value: '₹84,500' },
        { label: 'Difference', value: '₹9,500' },
      ],
    },
  },
  {
    id: 'depreciation',
    label: 'Depreciation applied',
    impact: 'medium',
    value: 8250,
    unit: '₹',
    description: 'Standard depreciation of ₹8,250 was applied based on vehicle age.',
    evidence: {
      fields: [
        { label: 'Depreciation amount', value: '₹8,250' },
        { label: 'Vehicle age', value: '3 years' },
        { label: 'Rate applied', value: 'Standard' },
      ],
    },
  },
  {
    id: 'deductible',
    label: 'Deductible',
    impact: 'medium',
    value: 5000,
    unit: '₹',
    description: 'A ₹5,000 deductible was applied as per your policy.',
    evidence: {
      fields: [
        { label: 'Policy deductible', value: '₹5,000' },
        { label: 'Applied to', value: 'Current claim' },
      ],
    },
  },
  {
    id: 'documentation',
    label: 'Claim documentation',
    impact: 'low',
    value: 1,
    unit: 'document pending',
    description: '1 supporting document has not yet been submitted.',
    evidence: {
      fields: [
        { label: 'Documents submitted', value: '4 of 5' },
        { label: 'Pending', value: 'Repair estimate' },
      ],
    },
  },
];

export const INSURANCE_WHATIF_CONFIG = {
  variables: [
    { id: 'coverage_limit', label: 'Coverage limit', current: 75000, min: 50000, max: 200000, unit: '₹', step: 5000 },
    { id: 'deductible', label: 'Deductible', current: 5000, min: 0, max: 10000, unit: '₹', step: 500 },
  ],
};

export const INSURANCE_PLAN = {
  title: 'My Coverage Plan',
  steps: [
    { id: 1, week: 'Step 1', task: 'Review current coverage', done: true },
    { id: 2, week: 'Step 2', task: 'Check deductible', done: true },
    { id: 3, week: 'Step 3', task: 'Submit pending document', done: false },
    { id: 4, week: 'Step 4', task: 'Review exclusions', done: false },
    { id: 5, week: 'Step 5', task: 'Review coverage before renewal', done: false },
  ],
};

export const INSURANCE_PROGRESS = {
  started: '2026-09-18',
  metrics: [
    { id: 'claim_submitted', label: 'Claim submitted', from: '', to: '✓', unit: '', improving: true },
    { id: 'documents_verified', label: 'Documents verified', from: '', to: '4/5', unit: '', improving: true },
    { id: 'assessment_completed', label: 'Assessment completed', from: '', to: '✓', unit: '', improving: true },
    { id: 'partial_settlement', label: 'Partial settlement', from: '', to: '₹61,250', unit: '', improving: true },
  ],
};

/* ---------- MUTUAL FUNDS ---------- */
export const MF_PORTFOLIO_STATE = {
  id: 'MF-471920',
  totalValue: 480000,
  lastUpdated: '02 Oct 2026',
  status: 'Needs review',
  primarySignal: 'High equity concentration',
  confidence: 0.82,
  goal: {
    name: 'Wealth creation',
    horizon: '10+ years'
  },
  allocation: {
    equity: 82,
    debt: 12,
    other: 6
  },
  equityAmount: 393600,
  holdingsCount: 14,
  categoriesCount: 4,
  expenseRatio: 1.1,
  liquidity: 'Good',
  sipConsistency: 'Stable',
  factors: [
    {
      id: 'equity_allocation',
      name: 'High equity allocation',
      value: 82,
      unit: '%',
      importance: 'HIGH',
      status: 'needs_review',
      evidence: '₹3,93,600 approximately allocated to equity',
      explanation: 'A high allocation to equity-oriented investments can result in larger portfolio fluctuations than a portfolio with more fixed-income exposure.',
      source: 'Current portfolio allocation'
    },
    {
      id: 'fund_overlap',
      name: 'Fund overlap',
      value: 34,
      unit: '%',
      importance: 'MEDIUM',
      status: 'needs_review',
      evidence: 'Estimated overlap across selected equity holdings',
      explanation: 'Multiple funds can hold similar companies or sectors, meaning the portfolio may be less diversified than the number of funds suggests.',
      source: 'Portfolio holdings analysis'
    },
    {
      id: 'sector_concentration',
      name: 'Sector concentration',
      value: 27,
      unit: '%',
      importance: 'MEDIUM',
      status: 'needs_review',
      evidence: '27% exposure to Technology sector',
      explanation: 'A large portion of the portfolio is concentrated in a single sector, which can increase volatility if that sector underperforms.',
      source: 'Underlying asset analysis'
    }
  ]
};

export const MF_WHATIF_CONFIG = {
  variables: [
    { id: 'equity', label: 'Equity', current: 82, min: 0, max: 100, unit: '%', step: 1 },
    { id: 'debt', label: 'Debt', current: 12, min: 0, max: 100, unit: '%', step: 1 },
    { id: 'other', label: 'Other', current: 6, min: 0, max: 100, unit: '%', step: 1 },
  ]
};

export const MF_PLAN = {
  duration: 60,
  highPriorityCount: 2,
  mediumPriorityCount: 2,
  totalActions: 4,
  profileSnapshot: {
    equity_allocation: '82%',
    fund_overlap: '34%',
    sector_concentration: '27%'
  },
  topPriority: {
    id: 'review_equity',
    factorId: 'equity_allocation',
    title: 'Review equity concentration',
    priority: 'HIGH',
    currentValue: 82,
    targetValue: 60,
    unit: '%',
    whyItMatters: 'Equity is currently the largest component of your portfolio.',
    action: 'Compare your current equity exposure with your investment horizon and risk preference.',
    timeframe: 'This week',
    status: 'not_started',
    estimatedImpact: 'High'
  },
  topThree: [
    'Review whether 82% equity exposure matches your goal and risk tolerance.',
    'Check for overlapping holdings across your funds.',
    'Review fund costs and portfolio concentration.'
  ],
  timeline: [
    {
      week: 'Week 1',
      label: 'Understand & prepare',
      tasks: [
        { id: 't1', text: 'Review equity concentration against risk profile', done: true },
        { id: 't2', text: 'Check for overlapping holdings across funds', done: false }
      ]
    },
    {
      week: 'Week 2',
      label: 'Review costs & goals',
      tasks: [
        { id: 't3', text: 'Compare expense ratios', done: false },
        { id: 't4', text: 'Confirm investment goal and time horizon', done: false }
      ]
    }
  ],
  controlledFactors: [
    'Asset allocation',
    'Fund selection',
    'SIP contributions'
  ],
  slowFactors: [
    'Market volatility',
    'Fund manager performance'
  ],
  preApplication: [
    'Review your exact investment horizon',
    'Assess your comfort with market volatility',
    'Evaluate tax implications of rebalancing'
  ]
};

export const MF_PROGRESS = {
  startDate: '2026-09-22',
  duration: 60,
  planProgress: {
    completedActions: 1,
    totalActions: 4,
    highPriorityCompleted: 1,
    highPriorityTotal: 2,
    nextMilestone: 'Week 2 review'
  },
  completedTasks: [
    { id: 't1', title: 'Reviewed equity concentration', date: '02 Oct', factor: 'Equity allocation' }
  ],
  nextActions: [
    { id: 't2', title: 'Check for overlapping holdings', due: '08 Oct', priority: 'HIGH' },
    { id: 't3', title: 'Compare expense ratios', due: '15 Oct', priority: 'MEDIUM' }
  ],
  signals: [
    {
      id: 'equity_allocation',
      label: 'Equity allocation',
      start: 82,
      current: 82,
      target: 60,
      unit: '%',
      direction: 'lower_is_better',
      history: [82, 82],
      updated: '02 Oct 2026',
      statusOverride: 'NEEDS ATTENTION',
      customAction: 'Equity exposure remains high. Review against your goals.'
    },
    {
      id: 'fund_overlap',
      label: 'Fund overlap',
      start: 34,
      current: 34,
      target: 20,
      unit: '%',
      direction: 'lower_is_better',
      history: [34, 34],
      updated: '02 Oct 2026'
    }
  ],
  journey: [
    { date: '02 Oct', status: 'completed', text: 'Portfolio reviewed' },
    { date: '04 Oct', status: 'current', text: 'Asset allocation analysed' },
    { date: '08 Oct', status: 'pending', text: 'Fund overlap reviewed' },
    { date: '15 Oct', status: 'pending', text: 'Expense ratio review' },
    { date: '30 Nov', status: 'pending', text: 'Next review' }
  ],
  milestones: [
    { label: 'Equity <60%', current: '82%' },
    { label: 'Overlap <20%', current: '34%' }
  ]
};

/* ---------- DASHBOARD ---------- */
export const KYUN_CARDS = [
  {
    product: 'loan',
    category: 'Personal Loan',
    title: 'Application not approved',
    subtitle: 'Reviewed on 21 Sep 2026',
    cta: 'See why',
    icon: '📋',
    link: '/loan',
    accentColor: '#EF4444',
  },
  {
    product: 'insurance',
    category: 'Motor Insurance',
    title: 'Claim partially approved',
    subtitle: '₹61,250 of ₹84,500 approved',
    cta: 'See why',
    icon: '🚗',
    link: '/insurance',
    accentColor: '#F59E0B',
  },
  {
    product: 'mutual_funds',
    category: 'Mutual Funds',
    title: 'Portfolio needs attention',
    subtitle: 'Equity exposure 82%',
    cta: 'Understand',
    icon: '📈',
    link: '/mutual-funds',
    accentColor: '#6C3CE9',
  },
];

/* ---------- ASK KYUN SUGGESTIONS ---------- */
export const ASK_KYUN_SUGGESTIONS = [
  'Why is credit utilisation important?',
  'What should I change first?',
  'Explain this in Gujarati',
  'Can I apply again?',
  'What happens if I reduce my balance?',
];

/* ---------- LANGUAGES ---------- */
export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

/* ---------- TIMELINE ---------- */
export const LOAN_TIMELINE = [
  { date: '21 Sep', label: 'Application reviewed', done: true },
  { date: '21 Sep', label: 'Decision generated', done: true },
  { date: '21 Sep', label: 'Kyun? explanation available', done: true },
  { date: 'Today', label: 'Recovery plan started', done: true },
  { date: 'Day 30', label: 'Progress review', done: false },
  { date: 'Day 60', label: 'Recheck', done: false },
];
