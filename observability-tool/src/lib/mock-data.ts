import { faker } from "@faker-js/faker";

// Baseline used across dashboard generators so everything scales to the same
// realistic demo size. The app currently only contains 10 traces, so keep
// analytics and agentops numbers small and consistent.
export const TOTAL_TRACES = 10;

// --- Traces Data ---

export const generateTraces = (count = 10) => {
  const scenarios = [
    // --- Insurance Scenarios ---
    {
      name: "Insurance Claim Eligibility Agent",
      input:
        "Check eligibility. Policy: POL-882190 (Comprehensive). Incident: Rear-ended at red light. Driver: John Doe. Date: Today.",
      output: JSON.stringify(
        {
          eligible: true,
          reasoning: "Covered under Comprehensive. Not at fault.",
          estimated_payout: "$2,400",
          next_steps: "Schedule repair at authorized center.",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.2s",
      cost: "$0.0021",
    },
    {
      name: "Insurance Claim Eligibility Agent",
      input:
        "Claim request. Policy: POL-110293 (Third Party Only). Incident: Backed into a pole in parking lot. Driver: Sarah Smith.",
      output: JSON.stringify(
        {
          eligible: false,
          reasoning:
            "Third Party Only does not cover damage to own vehicle when at fault.",
          estimated_payout: "$0",
          next_steps: "Notify policyholder of rejection.",
        },
        null,
        2
      ),
      status: "success", // The agent successfully determined ineligibility
      latency: "0.8s",
      cost: "$0.0015",
    },
    {
      name: "Insurance Claim Eligibility Agent",
      input:
        "Verify coverage. Policy: POL-EXPIRED-99 (Expired 2023). Incident: Hail damage to roof. Driver: Mike Ross.",
      output: JSON.stringify(
        {
          eligible: false,
          reasoning: "Policy is inactive. Coverage lapsed on 2023-12-31.",
          estimated_payout: "$0",
          next_steps: "Forward to renewals department.",
        },
        null,
        2
      ),
      status: "success",
      latency: "0.5s",
      cost: "$0.0010",
    },
    {
      name: "Insurance Claim Eligibility Agent",
      input:
        "New Claim. Policy: POL-445123 (Comprehensive). Incident: Stolen vehicle from driveway. Police Report: #PR-9921. Driver: Emily Blunt.",
      output: JSON.stringify(
        {
          eligible: true,
          reasoning:
            "Theft covered under Comprehensive. Police report verified.",
          estimated_payout: "Market Value ($22,000)",
          next_steps: "Initiate total loss protocol.",
        },
        null,
        2
      ),
      status: "success",
      latency: "2.1s",
      cost: "$0.0035",
    },
    {
      name: "Insurance Claim Eligibility Agent",
      input:
        "Eligibility Check. Policy: POL-7721 (Collision). Incident: Hit a deer on highway. Driver: Robert Chen.",
      output: JSON.stringify(
        {
          eligible: true,
          reasoning:
            "Collision coverage applies to animal strikes in this jurisdiction.",
          estimated_payout: "$4,500",
          next_steps: "Assign field adjuster.",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.5s",
      cost: "$0.0028",
    },
    // --- Medical Scenarios ---
    {
      name: "Medical Diagnosis Assistant",
      input:
        "Patient (Male, 45) presents with crushing chest pain radiating to left arm, sweating, nausea. Duration: 30 mins. History: Smoker.",
      output: JSON.stringify(
        {
          differential_diagnosis: ["Myocardial Infarction", "Angina", "GERD"],
          recommended_action: "IMMEDIATE ER REFERRAL",
          confidence: 0.98,
          urgency: "Critical",
        },
        null,
        2
      ),
      status: "success",
      latency: "0.9s",
      cost: "$0.0042",
    },
    {
      name: "Medical Diagnosis Assistant",
      input:
        "Patient (Female, 29) reports itchy red rash on arms after hiking. No fever. History: None.",
      output: JSON.stringify(
        {
          differential_diagnosis: [
            "Contact Dermatitis (Poison Ivy)",
            "Insect Bites",
            "Allergic Reaction",
          ],
          recommended_action: "Topical hydrocortisone, monitor for spread.",
          confidence: 0.85,
          urgency: "Low",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.1s",
      cost: "$0.0018",
    },
    {
      name: "Medical Diagnosis Assistant",
      input:
        "Patient (Child, 6) has high fever (103F), sore throat, difficulty swallowing. No cough. Duration: 2 days.",
      output: JSON.stringify(
        {
          differential_diagnosis: [
            "Streptococcal Pharyngitis",
            "Viral Pharyngitis",
            "Tonsillitis",
          ],
          recommended_action: "Rapid Strep Test, Throat Culture.",
          confidence: 0.9,
          urgency: "Moderate",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.3s",
      cost: "$0.0022",
    },
    {
      name: "Medical Diagnosis Assistant",
      input:
        "Patient (Male, 60) reports gradual vision loss in center of field of view. Lines look wavy. History: Hypertension.",
      output: JSON.stringify(
        {
          differential_diagnosis: [
            "Macular Degeneration",
            "Diabetic Retinopathy",
            "Cataracts",
          ],
          recommended_action: "Refer to Ophthalmologist for dilated exam.",
          confidence: 0.88,
          urgency: "Moderate",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.6s",
      cost: "$0.0025",
    },
    {
      name: "Medical Diagnosis Assistant",
      input:
        "Patient (Female, 35) reports constant fatigue, weight gain, feeling cold, dry skin. Duration: 6 months.",
      output: JSON.stringify(
        {
          differential_diagnosis: ["Hypothyroidism", "Anemia", "Depression"],
          recommended_action: "TSH, Free T4, CBC blood panel.",
          confidence: 0.92,
          urgency: "Low",
        },
        null,
        2
      ),
      status: "success",
      latency: "1.4s",
      cost: "$0.0020",
    },
  ];

  // Return the scenarios, limited by count if necessary, but default is 10 which matches our list.
  // Make cloudProvider deterministic per-trace (not random) so UI remains stable across refreshes.
  // Also make the first two traces have empty provider values.
  const providers = ["aws", "gcp", "azure"];
  const awsRegions = ["us-east-1", "us-west-2", "eu-west-1"];
  const gcpRegions = ["us-central1", "europe-west1", "asia-east1"];
  const azureRegions = ["eastus", "westeurope", "southeastasia"];

  return scenarios.slice(0, count).map((scenario, idx) => {
    // Make first two traces appear as "unknown" / empty provider
    let provider = "";
    if (idx >= 2) {
      provider = providers[(idx - 2) % providers.length];
    }

    let cloudRegion = "";
    let cloudAccount = "";

    if (provider === "aws") {
      cloudRegion = awsRegions[(idx - 2) % awsRegions.length];
      cloudAccount = `acct-${100000 + ((idx - 2) % 900000)}`;
    } else if (provider === "gcp") {
      cloudRegion = gcpRegions[(idx - 2) % gcpRegions.length];
      cloudAccount = `proj-${(idx - 2).toString().padStart(6, "0")}`;
    } else if (provider === "azure") {
      cloudRegion = azureRegions[(idx - 2) % azureRegions.length];
      cloudAccount = `sub-${(idx - 2).toString(36)}`;
    }

    const cloudResource = `${scenario.name
      .split(" ")
      .slice(0, 3)
      .join("-")
      .toLowerCase()}-${idx}`;

    return {
      id: `tr_${faker.string.alphanumeric(10)}`,
      timestamp: faker.date.recent({ days: 1 }).toLocaleString(),
      name: scenario.name,
      input: scenario.input,
      output: scenario.output,
      latency: scenario.latency,
      cost: scenario.cost,
      tokens: `${faker.number.int({ min: 100, max: 1000 })} → ${faker.number.int({ min: 50, max: 500 })}`,
      status: scenario.status,
      // Provider metadata so traces can be visualized by origin
      cloudProvider: provider,
      cloudRegion,
      cloudAccount,
      cloudResource,
      environment: "production",
    };
  });
};

export const generateObservationTree = (traceId: string, traceName: string) => {
  const isInsurance = traceName.includes("Insurance");
  const timestamp = new Date();

  const createObservation = (
    name: string,
    type: "SPAN" | "GENERATION" | "EVENT",
    offsetMs: number,
    durationMs: number,
    input: any,
    output: any,
    children: any[] = []
  ) => {
    const start = new Date(timestamp.getTime() + offsetMs);
    const end = new Date(start.getTime() + durationMs);
    return {
      id: `obs_${faker.string.alphanumeric(8)}`,
      name,
      type,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      latency: `${(durationMs / 1000).toFixed(2)}s`,
      cost:
        type === "GENERATION"
          ? `$${faker.number
              .float({ min: 0.0001, max: 0.002, multipleOf: 0.00001 })
              .toFixed(6)}`
          : undefined,
      status: "success" as const,
      input,
      output,
      children,
    };
  };

  if (isInsurance) {
    return [
      createObservation(
        "Insurance Claim Processing",
        "SPAN",
        0,
        1500,
        { policyId: "POL-123", incident: "Collision" },
        { eligible: true, payout: "$2400" },
        [
          createObservation(
            "Retrieve Policy Details",
            "SPAN",
            100,
            300,
            { policyId: "POL-123" },
            { type: "Comprehensive", status: "Active" }
          ),
          createObservation(
            "Analyze Incident Report",
            "GENERATION",
            450,
            800,
            {
              description: "Rear-ended at red light",
              damage: "Bumper and trunk",
            },
            { fault: "Other driver", covered: true },
            []
          ),
          createObservation(
            "Calculate Payout",
            "SPAN",
            1300,
            150,
            { damage_estimate: "$2500", deductible: "$100" },
            { final_payout: "$2400" }
          ),
        ]
      ),
    ];
  } else {
    return [
      createObservation(
        "Medical Diagnosis Session",
        "SPAN",
        0,
        2000,
        { patient: "Male, 45", symptom: "Chest Pain" },
        { diagnosis: "Angina", urgency: "High" },
        [
          createObservation(
            "Analyze Symptoms",
            "GENERATION",
            100,
            600,
            { symptoms: ["Chest pain", "Sweating", "Nausea"] },
            { potential_causes: ["MI", "Angina", "Panic Attack"] }
          ),
          createObservation(
            "Check Medical History",
            "SPAN",
            750,
            200,
            { patientId: "PAT-998" },
            { history: ["Smoker", "Hypertension"] }
          ),
          createObservation(
            "Differential Diagnosis",
            "GENERATION",
            1000,
            900,
            { symptoms: ["Chest pain"], history: ["Smoker"] },
            { diagnosis: "Angina", confidence: 0.85, recommended: "ECG" }
          ),
        ]
      ),
    ];
  }
};

// --- Analytics Data ---

export const generateUsageData = () => {
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Scale counts to the small demo dataset (TOTAL_TRACES)
  return dates.map((date) => ({
    date,
    traces: faker.number.int({
      min: Math.max(1, TOTAL_TRACES - 3),
      max: TOTAL_TRACES,
    }),
    generations: faker.number.int({
      min: 1,
      max: Math.max(1, TOTAL_TRACES * 3),
    }),
    spans: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES * 6) }),
  }));
};

export const generateCostData = () => {
  // Costs scaled down for the 10-trace demo. Values indicate aggregated
  // cost-per-model across the small set of traces, and token counts are
  // representative totals (not production volumes).
  return [
    {
      model: "gpt-4",
      cost: faker.number.float({ min: 0.001, max: 0.02, multipleOf: 0.0001 }),
      tokens: faker.number.int({ min: 500, max: 4000 }),
    },
    {
      model: "gpt-3.5-turbo",
      cost: faker.number.float({ min: 0.0005, max: 0.01, multipleOf: 0.0001 }),
      tokens: faker.number.int({ min: 800, max: 5000 }),
    },
    {
      model: "claude-2",
      cost: faker.number.float({ min: 0.0008, max: 0.015, multipleOf: 0.0001 }),
      tokens: faker.number.int({ min: 400, max: 3500 }),
    },
    {
      model: "claude-instant",
      cost: faker.number.float({ min: 0.0003, max: 0.008, multipleOf: 0.0001 }),
      tokens: faker.number.int({ min: 700, max: 4500 }),
    },
  ];
};

export const generateLatencyData = () => {
  return [
    { range: "0-0.5s", count: faker.number.int({ min: 2000, max: 4000 }) },
    { range: "0.5-1s", count: faker.number.int({ min: 3000, max: 5000 }) },
    { range: "1-2s", count: faker.number.int({ min: 2000, max: 3500 }) },
    { range: "2-3s", count: faker.number.int({ min: 800, max: 1500 }) },
    { range: "3-5s", count: faker.number.int({ min: 200, max: 600 }) },
    { range: "5s+", count: faker.number.int({ min: 50, max: 250 }) },
  ];
};

export const generateQualityData = () => {
  return Array.from({ length: 4 }).map((_, i) => ({
    date: `Week ${i + 1}`,
    userScore: faker.number.float({ min: 3.5, max: 4.8, multipleOf: 0.1 }),
    aiScore: faker.number.float({ min: 3.8, max: 4.9, multipleOf: 0.1 }),
  }));
};

export const generateTokenData = () => {
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Tokens scaled down for the small demo set. These represent total tokens
  // across the week for the demo traces (not production-level counts).
  return dates.map((date) => ({
    date,
    input: faker.number.int({ min: 500, max: 2000 }),
    output: faker.number.int({ min: 200, max: 1500 }),
  }));
};

export const generateModelLatencyData = () => {
  return [
    {
      model: "gpt-4",
      p50: faker.number.float({ min: 1.0, max: 1.5, multipleOf: 0.1 }),
      p95: faker.number.float({ min: 2.0, max: 3.0, multipleOf: 0.1 }),
      p99: faker.number.float({ min: 3.5, max: 5.0, multipleOf: 0.1 }),
    },
    {
      model: "gpt-3.5-turbo",
      p50: faker.number.float({ min: 0.4, max: 0.8, multipleOf: 0.1 }),
      p95: faker.number.float({ min: 1.0, max: 1.5, multipleOf: 0.1 }),
      p99: faker.number.float({ min: 1.6, max: 2.2, multipleOf: 0.1 }),
    },
    {
      model: "claude-2",
      p50: faker.number.float({ min: 1.2, max: 1.8, multipleOf: 0.1 }),
      p95: faker.number.float({ min: 2.5, max: 3.5, multipleOf: 0.1 }),
      p99: faker.number.float({ min: 4.0, max: 5.5, multipleOf: 0.1 }),
    },
    {
      model: "claude-instant",
      p50: faker.number.float({ min: 0.6, max: 1.0, multipleOf: 0.1 }),
      p95: faker.number.float({ min: 1.2, max: 1.8, multipleOf: 0.1 }),
      p99: faker.number.float({ min: 1.9, max: 2.5, multipleOf: 0.1 }),
    },
  ];
};

export const generateModelCostComparisonData = () => {
  return [
    { model: "gpt-4", costPerRequest: 0.035, costPer1kTokens: 0.03 },
    { model: "gpt-3.5-turbo", costPerRequest: 0.003, costPer1kTokens: 0.002 },
    { model: "claude-2", costPerRequest: 0.028, costPer1kTokens: 0.024 },
    { model: "claude-instant", costPerRequest: 0.004, costPer1kTokens: 0.003 },
  ];
};

export const generateAgentWorkflowData = () => {
  const dates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return dates.map((date) => ({
    date,
    workflows: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES) }),
    steps: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES * 6) }),
    tools: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES * 3) }),
  }));
};

export const generateToolUsageData = () => {
  // Reduce synthetic tool counts to be reasonable for TOTAL_TRACES demo set
  return [
    {
      tool: "web_search",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.5, max: 2.5, multipleOf: 0.1 }),
    },
    {
      tool: "code_executor",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 2 }),
      avgLatency: faker.number.float({ min: 0.2, max: 2.0, multipleOf: 0.1 }),
    },
    {
      tool: "database_query",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.1, max: 1.2, multipleOf: 0.1 }),
    },
    {
      tool: "api_call",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.2, max: 1.8, multipleOf: 0.1 }),
    },
  ];
};

// --- Dashboard Overview Data ---

export const generateOverviewMetrics = () => {
  // Generate small sample data and compute overview numbers so the dashboard
  // always reflects the current demo size (TOTAL_TRACES).
  const traces = generateTraces(TOTAL_TRACES);
  const agentRuns =
    typeof generateAgentOpsData === "function"
      ? generateAgentOpsData(TOTAL_TRACES)
      : [];

  const totalTraces = traces.length;
  const totalCost = traces.reduce(
    (sum, t) => sum + parseFloat(String(t.cost).replace(/[^0-9.]/g, "") || "0"),
    0
  );
  const avgLatency =
    (
      traces.reduce(
        (s, t) => s + parseFloat(String(t.latency).replace(/s$/, "")),
        0
      ) / Math.max(1, totalTraces)
    ).toFixed(2) + "s";
  const successRate = `${Math.round(
    (traces.filter((t) => t.status === "success").length /
      Math.max(1, totalTraces)) *
      100
  )}%`;
  const totalSteps = agentRuns.reduce((s, r) => s + (r.steps || 0), 0);
  const toolCalls = agentRuns.reduce(
    (s, r) => s + (r.toolsUsed ? r.toolsUsed.length : 0),
    0
  );
  const workflowSuccessRate = `${Math.round(
    (agentRuns.filter((r) => r.status === "success").length /
      Math.max(1, agentRuns.length)) *
      100
  )}%`;

  return {
    totalTraces: `${totalTraces}`,
    totalCost: `$${totalCost.toFixed(6)}`,
    avgLatency,
    successRate,
    activeWorkflows: `${agentRuns.length}`,
    totalSteps: `${totalSteps}`,
    toolCalls: `${toolCalls}`,
    workflowSuccessRate,
  };
};

export const generateSlowestTraces = () => {
  return [
    {
      name: "Insurance Claim Eligibility Agent",
      model: "gpt-4",
      latency: "3.2s",
    },
    { name: "Medical Diagnosis Assistant", model: "claude-2", latency: "2.8s" },
    {
      name: "Insurance Claim Eligibility Agent",
      model: "gpt-4",
      latency: "2.5s",
    },
    {
      name: "Medical Diagnosis Assistant",
      model: "gpt-3.5-turbo",
      latency: "2.1s",
    },
  ];
};

export const generateRecentAlerts = () => {
  return [
    {
      type: "High Latency",
      trace: "Insurance Claim POL-882190",
      time: "2m ago",
    },
    { type: "Cost Spike", trace: "Medical Diagnosis Batch", time: "15m ago" },
    {
      type: "Token Limit",
      trace: "Insurance Claim POL-445123",
      time: "1h ago",
    },
  ];
};

export const generateActiveAgents = () => {
  // Return active agents with smaller, realistic demo numbers
  const agents = [
    "Insurance Claim Eligibility Agent",
    "Medical Diagnosis Assistant",
    "Customer Support Agent",
    "Financial Analysis Agent",
  ];

  return agents.map((name) => ({
    name,
    workflows: `${faker.number.int({
      min: 0,
      max: Math.max(1, Math.floor(TOTAL_TRACES / 2)),
    })}`,
    avgSteps: `${faker.number
      .float({ min: 1, max: 6, multipleOf: 0.1 })
      .toFixed(1)}`,
  }));
};

export const generateWorkflowFailures = () => {
  return [
    {
      workflow: "Insurance Claim Processing",
      reason: "Policy database timeout",
      time: "5m ago",
    },
    {
      workflow: "Medical Diagnosis",
      reason: "API rate limit exceeded",
      time: "12m ago",
    },
    {
      workflow: "Customer Support",
      reason: "Invalid input format",
      time: "25m ago",
    },
  ];
};

export const generateToolPerformance = () => {
  return [
    { tool: "web_search", latency: "2.1s", status: "healthy" },
    { tool: "code_executor", latency: "1.8s", status: "healthy" },
    { tool: "database_query", latency: "0.9s", status: "healthy" },
    { tool: "api_call", latency: "1.5s", status: "degraded" },
  ];
};

// --- Agent Operations (agentops) Mock Data ---

export const generateAgentOpsData = (count = 8) => {
  const statuses = ["running", "success", "failed", "cancelled"];
  const agents = [
    "Invoice Processing Agent",
    "Order Fulfillment Agent",
    "Fraud Detection Agent",
    "Customer Onboarding Agent",
    "Insurance Claim Agent",
    "Medical Triage Agent",
    "Data Enrichment Agent",
  ];

  return Array.from({ length: count }).map(() => {
    const start = faker.date.recent({ days: 7 });
    const durationMs = faker.number.int({ min: 200, max: 20_000 });
    const end = new Date(start.getTime() + durationMs);

    return {
      id: `ag_${faker.string.alphanumeric(10)}`,
      runId: `run_${faker.string.alphanumeric(8)}`,
      agentName: faker.helpers.arrayElement(agents),
      status: faker.helpers.arrayElement(statuses),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: `${(durationMs / 1000).toFixed(2)}s`,
      steps: faker.number.int({ min: 1, max: 40 }),
      toolsUsed: faker.helpers.arrayElements(
        [
          "web_search",
          "database_query",
          "api_call",
          "code_executor",
          "file_system",
        ],
        faker.number.int({ min: 1, max: 3 })
      ),
      cost: `$${faker.number
        .float({ min: 0.0005, max: 0.02, multipleOf: 0.0001 })
        .toFixed(6)}`,
      metrics: {
        successRate: faker.number.float({
          min: 0.6,
          max: 1.0,
          multipleOf: 0.01,
        }),
        meanStepDuration: `${faker.number
          .float({ min: 0.05, max: 2.0, multipleOf: 0.01 })
          .toFixed(2)}s`,
      },
      logs: faker.lorem.sentences(faker.number.int({ min: 1, max: 4 })),
      environment: faker.helpers.arrayElement([
        "production",
        "staging",
        "development",
      ]),
      tags: faker.helpers.arrayElements(
        ["critical", "batch", "realtime", "scheduled"],
        faker.number.int({ min: 0, max: 2 })
      ),
    };
  });
};

export const generateAgentOpsOverview = () => {
  const runs = generateAgentOpsData(12);
  const totalRuns = runs.length;
  const avgDurationSec = (
    runs.reduce((s, r) => s + parseFloat(r.duration.replace("s", "")), 0) /
    totalRuns
  ).toFixed(2);
  const failureCount = runs.filter(
    (r) => r.status === "failed" || r.status === "cancelled"
  ).length;
  const failureRate = ((failureCount / totalRuns) * 100).toFixed(1) + "%";

  const topAgentsMap: Record<string, number> = {};
  runs.forEach((r) => {
    topAgentsMap[r.agentName] = (topAgentsMap[r.agentName] || 0) + 1;
  });
  const topAgents = Object.entries(topAgentsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, runs: count }));

  return {
    totalRuns: `${totalRuns}`,
    avgDuration: `${avgDurationSec}s`,
    failureRate,
    topAgents,
  };
};
