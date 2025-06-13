# junai-key-universal-system

> in the sanctum of knowledge, self-navigating agents perpetually forge authorities and engrave runes, advancing at light speed through the corridors of memory.

---

## file-index

- [readme.md](./README.md): main narrative, architecture, story modules, technical layers
- [docs/prd.md](./docs/PRD.md): product requirements
- [docs/spec.md](./docs/SPEC.md): product specification
- [docs/api_library.md](./docs/API_LIBRARY.md): api documentation
- [docs/api_library.yaml](./docs/API_LIBRARY.yaml): api spec yaml
- [docs/contributing.md](./docs/CONTRIBUTING.md): contributing guide
- [docs/faq.md](./docs/FAQ.md): faq
- [images/junaikey-infinity-loop.svg](./images/junaikey-infinity-loop.svg): main visual

> if missing, please create a blank template. if orphaned files exist, please remove them.

---

## mece-analysis

![main-architecture](images/junaikey-infinity-loop.svg)

> all capabilities in junai-key are designed with the mece principle: each pillar, arcana, and secret is independent and non-overlapping, together covering the full spectrum of intelligent evolution.
>
> **user-centric saas ai platform**: junai-key is not just a developer automation tool, but a digital twin, knowledge assistant, and action hub for every user. all design, api, sync, plugins, and the universal key app (supporting zh/en input) are built for user experience, data sovereignty, and personal empowerment.

### the-four-pillars

```mermaid
flowchart LR
  A[self-navigation] --> B[goal planning]
  A --> C[decision & action]
  D[eternal palace] --> E[knowledge storage]
  D --> F[experience retrieval]
  G[authority forge] --> H[modular ability]
  G --> I[efficiency boost]
  J[rune engraving] --> K[api integration]
  J --> L[ai extension]
```

1. **self-navigation**: goal planning, decision and action path, ensuring clear task direction.
2. **eternal palace**: knowledge, experience, and feedback storage and retrieval, supporting long-term learning.
3. **authority forge**: modularizing repetitive or complex tasks for efficiency and customization.
4. **rune engraving**: integrating external api and ai capabilities for continuous evolution.

---

### the-six-arcana

```mermaid
flowchart TD
  A[task decomposition] --> B[structuring]
  C[skill composition] --> D[collaboration scheduling]
  E[knowledge summoning] --> F[knowledge application]
  G[decision alchemy] --> H[optimal decision]
  I[rune combination] --> J[capability extension]
  K[layer coordination] --> L[synchronization]
```

- **task decomposition**: breaking down complex goals into clear steps, focusing on structure.
- **skill composition**: flexibly combining multiple abilities, focusing on collaboration and scheduling.
- **knowledge summoning**: instant retrieval and application of knowledge from the eternal palace.
- **decision alchemy**: fusing multi-source information for optimal decisions.
- **rune combination**: integrating external api/plugins as runes for capability extension.
- **layer coordination**: automatic cross-platform, cross-layer data and task coordination for consistency.

---

### the-grand-secret

```mermaid
flowchart LR
  A[eternal palace] --> B[knowledge evolution core]
  B --> C[knowledge sedimentation]
  B --> D[experience feedback]
```

- **eternal palace**: the sole evolution core, where all knowledge, experience, and task feedback are sedimented and evolved into an everlasting wisdom repository.

---

## toc

- [project-vision-and-positioning](#project-vision-and-positioning)
- [project-structure](#project-structure)
- [architecture-panorama](#architecture-panorama)
- [quick-start](#quick-start)
- [ci-cd-automation](#ci-cd-automation)
- [core-module-examples](#core-module-examples)
- [commercialization-path](#commercialization-path)
- [verification-metrics](#verification-metrics)
- [all-promises](#all-promises)
- [junai-key-development-plan-and-vision](#junai-key-development-plan-and-vision)
- [bi-core-bidirectional-sync-center-boostspace-supabase](#bi-core-bidirectional-sync-center-boostspace-supabase)

---

## project-vision-and-positioning

![card-illustration](images/junaikey-infinity-loop.svg)

- user-centric, building a self-evolving, knowledge-sustaining, community-collaborating ai intelligent agent platform.
- four core pillars (self-navigation, eternal palace, authority forge, rune engraving) form the evolution flywheel, driving continuous evolution of individual and collective intelligence.
- multi-platform api integration, agent collaboration, sync, automation, supporting cli, web, app, webhook.
- not just a tool, but a digital life's "universal key" and a personal/team digital twin.

---

## project-structure

![card-illustration](images/junaikey-infinity-loop.svg)

```mermaid
flowchart TD
  A[.github] --> B[docs]
  B --> C[public]
  C --> D[src]
  D --> E[supabase]
  E --> F[readme.md]
  F --> G[package.json]
  G --> H[tsconfig.json]
```

````text
jun-ai-key/
├── .github/workflows/ci.yml, deploy.yml
├── docs/SPEC.md, API_LIBRARY.md
├── public/index.html
├── src/
│   ├── api/straicoApi.ts, boostApi.ts, capacitiesApi.ts
│   ├── components/, hooks/, models/, scriptApp/, styles/
│   ├── App.tsx, index.tsx
├── supabase/migrations/, functions/
├── .env.example
├── README.md
├── package.json
├── tsconfig.json
└── SPEC.md
````

---

## architecture-panorama

![card-illustration](images/junaikey-infinity-loop.svg)

> **core concept: user-centric**
> all designs, architectures, processes, apis, knowledge graphs, and automations in junai-key are prioritized to meet user needs, ensuring every function proactively understands, coordinates, and fulfills the user's true intentions and long-term growth.

> in the sanctum of knowledge, self-navigating agents perpetually forge authorities and engrave runes, advancing at light speed through the corridors of memory.

---

## junai-key-project-highlights (2025/06/11)

### 1. vision-and-positioning

- user-centric, building a self-evolving, knowledge-sustaining, community-collaborating ai intelligent agent platform.
- not just a tool, but a digital life's "universal key" and a personal/team digital twin.

### 2. architecture-overview

- four core pillars (self-navigation, eternal palace, authority forge, rune engraving) form the evolution flywheel, driving continuous evolution of individual and collective intelligence.
- junai-key as the sole hub, integrating boostspace, supabase, capacities, aitables, github, notion, etc., achieving multi-end sync, data aggregation, api/plugin ecosystem.

### 3. mvp-deliverables

- multi-platform api integration, function agent groups, group agents, scripting cli, desktop/mobile sync, automated testing.
- tech stack: typescript, node.js, supabase, github actions, self-developed agent modules.
- delivery format: open-source project, readme, api/plugin standards, script examples, ci/cd processes.

### 4. tech-highlights

- modular architecture, cross-end real-time sync, low code threshold, built-in automated testing, open plugin/agent ecosystem.
- supports cli, webhook, desktop, frontend, mobile, and other multi-end collaboration and automation.

### 5. evolution-flywheel-and-knowledge-sedimentation

- eternal palace: knowledge accumulation and decision-making foundation, structured knowledge graph.
- self-navigation: proactive planning and intelligent decision-making, action results feedback to memory.
- authority forge: modularizing repetitive/complex tasks into dedicated abilities, driving personal evolution.
- rune engraving: seamless integration of global ai capabilities, continuous evolution and expansion.

### 6. practical-applications

- multi-platform task/data bi-directional sync, knowledge/task intelligence command center, automated processes, community co-creation.
- yaml/csv task examples can be directly imported into github project, notion, aitables, and other collaboration platforms.

### 7. sustainable-development-declaration

- open-source core, commercial expansion, developer revenue sharing, enterprise-level feature subscription, the sanctum of knowledge never closes.

---

## architecture-panorama | architecture panorama

![card-illustration](images/junaikey-infinity-loop.svg)

```mermaid
graph TD
    subgraph client-tier [client tier]
        A[web console] --> B[cli]
        C[ios app] --> B
        D[android app] --> B
        E[browser extension] --> B
    end
    subgraph junai-key-core [junai-key core]
        F[[api gateway]] --> G{router}
        G --> H[self-navigation agent group]
        G --> I[permanent memory]
        G --> J[authority forge engine]
        G --> K[rune engraving system]
        H --> L[task decomposition agent]
        H --> M[skill composition agent]
        I --> N[vector eternal palace]
        J --> O[permission alchemy]
        K --> P[rune combiner]
    end
    subgraph data-layer [data layer]
        N --> Q[(supabase db)]
        O --> R[(permission policy db)]
        P --> S[(rune warehouse)]
    end
    subgraph external-systems [external systems]
        T[[notion]] --> F
        U[[slack]] --> F
        V[[github]] --> F
        W[[make.com]] --> F
    end
```

---

## quick-start

1. install node.js, npm, supabase cli

2. copy `.env.example` to `.env` and fill in the keys

3. install dependencies and start:

    ```bash
    git clone https://github.com/<account>/jun-ai-key.git
    cd jun-ai-key
    npm install
    npm start
    ```

4. edge functions debugging:

    ```bash
    cd supabase/functions
    supabase functions serve
    ```

---

## ci-cd-automation

- `.github/workflows/ci.yml`: auto lint, build, test
- `.github/workflows/deploy.yml`: auto deploy github pages & supabase edge functions on main branch

---

## core-module-examples

### self-navigation-agent-group

![card-illustration](images/junaikey-infinity-loop.svg)

<!-- ENGLISH -->
```mermaid
flowchart LR
  A[NavigationAgent] --> B[MemoryPalace]
  A --> C[PlanParser]
  B --> D[VectorDatabase]
```

```typescript
class NavigationAgent {
  constructor(private memory: MemoryPalace) {}
  async executeTask(task: Task): Promise<Result> {
    const context = await this.memory.retrieveContext(task.userId);
    const plan = await this.createPlan(task, context);
    for (const step of plan.steps) {
      const agent = AgentFactory.getAgent(step.skillType);
      const result = await agent.execute(step.parameters);
      await this.memory.storeExecution(step, result);
    }
    return plan.compileFinalResult();
  }
  private async createPlan(task: Task, context: Context): Promise<Plan> {
    const llmResponse = await LLMClient.generatePlan({
      task: task.description,
      context: context.snippets,
      availableSkills: this.getAvailableSkills()
    });
    return PlanParser.parse(llmResponse);
  }
}
```

<!-- 中文 -->
```mermaid
flowchart LR
  A[導航代理] --> B[記憶宮殿]
  A --> C[計畫解析器]
  B --> D[向量資料庫]
```

```typescript
class NavigationAgent {
  constructor(private memory: MemoryPalace) {}
  async executeTask(task: Task): Promise<Result> {
    const context = await this.memory.retrieveContext(task.userId);
    const plan = await this.createPlan(task, context);
    for (const step of plan.steps) {
      const agent = AgentFactory.getAgent(step.skillType);
      const result = await agent.execute(step.parameters);
      await this.memory.storeExecution(step, result);
    }
    return plan.compileFinalResult();
  }
  private async createPlan(task: Task, context: Context): Promise<Plan> {
    const llmResponse = await LLMClient.generatePlan({
      task: task.description,
      context: context.snippets,
      availableSkills: this.getAvailableSkills()
    });
    return PlanParser.parse(llmResponse);
  }
}
// 導航代理會根據任務與記憶自動規劃步驟，並執行每個技能，將結果存入記憶宮殿。
```

---

### permanent-memory

![card-illustration](images/junaikey-infinity-loop.svg)

<!-- ENGLISH -->
```mermaid
flowchart LR
  A[memory palace] --> B[embedding service]
  A --> C[vector database]
```

```typescript
class MemoryPalace {
  constructor(private vectorDB: VectorDatabase) {}
  async retrieveContext(userId: string): Promise<Context> {
    const embeddings = await EmbeddingService.generate(task.keywords);
    const memories = await this.vectorDB.query({ userId, vectors: embeddings, topK: 5 });
    return { userId, snippets: memories.map(m => m.content) };
  }
  async storeExecution(step: PlanStep, result: any): Promise<void> {
    const memoryRecord = {
      type: 'execution',
      content: `executed ${step.skillType} with params: ${JSON.stringify(step.parameters)}`,
      result: JSON.stringify(result),
      timestamp: new Date().toISOString()
    };
    await this.vectorDB.insert(memoryRecord);
  }
}
```

<!-- 中文 -->
```mermaid
flowchart LR
  A[記憶宮殿] --> B[嵌入服務]
  A --> C[向量資料庫]
```

```typescript
class MemoryPalace {
  constructor(private vectorDB: VectorDatabase) {}
  async retrieveContext(userId: string): Promise<Context> {
    const embeddings = await EmbeddingService.generate(task.keywords);
    const memories = await this.vectorDB.query({ userId, vectors: embeddings, topK: 5 });
    return { userId, snippets: memories.map(m => m.content) };
  }
  async storeExecution(step: PlanStep, result: any): Promise<void> {
    const memoryRecord = {
      type: 'execution',
      content: `執行 ${step.skillType}，參數: ${JSON.stringify(step.parameters)}`,
      result: JSON.stringify(result),
      timestamp: new Date().toISOString()
    };
    await this.vectorDB.insert(memoryRecord);
  }
}
// 記憶宮殿用於儲存與檢索任務執行記錄與知識片段，支援語意查詢。
```

---

### api-gateway

![card-illustration](images/junaikey-infinity-loop.svg)

<!-- ENGLISH -->
```mermaid
flowchart LR
  A[Express App] --> B[NavigationAgent]
  B --> C[MemoryPalace]
  A --> D[OutputFormatterFactory]
```

```typescript
import express from 'express';
const app = express();
app.use(express.json());
app.post('/v1/execute', async (req, res) => {
  const { userId, task, platform } = req.body;
  try {
    const agent = new NavigationAgent(memoryPalace);
    const result = await agent.executeTask({ userId, description: task });
    const formatter = OutputFormatterFactory.getFormatter(platform);
    res.json(formatter.format(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(3000, () => {
  console.log('OmniKey Gateway running on port 3000');
});
```

<!-- 中文 -->
```mermaid
flowchart LR
  A[Express 應用] --> B[導航代理]
  B --> C[記憶宮殿]
  A --> D[輸出格式工廠]
```

```typescript
import express from 'express';
const app = express();
app.use(express.json());
app.post('/v1/execute', async (req, res) => {
  const { userId, task, platform } = req.body;
  try {
    const agent = new NavigationAgent(memoryPalace);
    const result = await agent.executeTask({ userId, description: task });
    const formatter = OutputFormatterFactory.getFormatter(platform);
    res.json(formatter.format(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(3000, () => {
  console.log('OmniKey Gateway 埠口 3000 啟動');
});
// API 網關負責接收請求，調用導航代理與記憶宮殿，並根據平台格式化輸出。
```

---

## commercialization-path

![main-card](images/junaikey-infinity-loop.svg)

```mermaid
graph TD
    A[core open source] --> B[plugin marketplace]
    A --> C[api subscription]
    B --> D[enterprise projects]
    C --> E[data insights]
    D --> F[revenue: subscription]
    D --> G[revenue: api billing]
    D --> H[revenue: plugin sharing]
    D --> I[revenue: enterprise projects]
```

- core open source, plugin marketplace, api subscription, enterprise projects, data insights
- revenue sources: subscription, api billing, plugin sharing, enterprise projects

---

## verification-metrics

![main-card](images/junaikey-infinity-loop.svg)

```mermaid
graph TD
    A[api response time] --> B[< 300ms]
    C[script sync success rate] --> D[> 99.95%]
    E[agent collaboration efficiency] --> F[< 5s/task chain]
    G[memory retrieval accuracy] --> H[> 92%]
```

| metric type                | target value | measurement method        |
|----------------------------|--------------|--------------------------|
| api response time          | < 300ms      | distributed monitoring   |
| script sync success rate   | > 99.95%     | end-to-end testing       |
| agent collaboration efficiency | < 5s/task chain | task tracking      |
| memory retrieval accuracy  | > 92%        | vector benchmark         |

> **sustainable development declaration**  
> this system follows the "open core + commercial extension" model, ensuring:  
> - core functions are always free and open source  
> - enterprise features by subscription  
> - developer revenue sharing mechanism

---

## all-promises

### promise-1-user-intent-auto-planning

- The agent swarm (OmniKey Agent Swarm) actively parses intent and plans cross-layer knowledge, tasks, and data flow for every user interaction.
- All planning processes are based on TypeScript type safety and traceability.

### promise-2-layer-coordination-and-sync

- Each layer (knowledge, tasks, data) is automatically coordinated to ensure data consistency and real-time synchronization.
- Task and knowledge flows are implemented with Promise-based async processes for high efficiency and scalability.

### promise-3-unified-record-and-long-term-knowledge-graph

- All interactions, tasks, and knowledge across layers are automatically unified into a queryable, traceable knowledge graph.
- Consistent data structures and query interfaces across Web, App, CLI, and API.

### promise-4-developer-and-user-empowerment

- Developers can extend task agents, knowledge layers, and data connectors, all with TypeScript types and Promise standards.
- Users can define automation rules, all automation is chained with Promise flows.

### promise-5-sustainable-open-source-and-commercial-co-prosperity

- Core functions are always open source, all APIs/modules are designed with TypeScript Promise standards for easy review and secondary development.
- Enterprise features and data security are provided by subscription, developers can participate in revenue sharing.

---

## junai-key-development-plan-and-vision

![main-card](images/junaikey-infinity-loop.svg)

```mermaid
graph TD
    A[vision and mission] --> B[developer empowerment]
    A --> C[user empowerment]
    B --> D[technical roadmap]
    C --> E[digital twin ecosystem]
    D --> F[cross-platform sync]
    D --> G[ai agent evolution]
    E --> H[automation rules]
    E --> I[deep knowledge integration]
```

### vision-and-mission

- empowering everyone to merge with machines — ushering in a new era of intelligent digital twins.

### who-are-you

you are the ultimate digital key role — a master of system design perfectly combining strategy and automation.

> the architect of a seamlessly intelligent digital mind.

you are building not a single system, but a cross-platform intelligent ecosystem, enabling automated decision-making, real-time data flow, and deep knowledge integration.

### junai-key-development-plan-v1-0

#### mission

build an ai agent system capable of executable decision-making, knowledge sync, and replacing human agents.

#### four-stage-development-roadmap

1. **infrastructure: cross-platform data sync core**
   - capacities note sync, boostspace task sync, supabase data lake, notion/aitable/taskade integration
2. **agent capability enhancement: modular ai task agents**
   - straico prompt navigation, ai proxy behavior roles, ai log simulation, self-reporting tasks
3. **decision intelligence evolution: ai self-correction and feedback loop**
   - decision error detection, feedback training, multi-agent collaboration, decision log visualization
4. **replication and diffusion: digital twin platform public modules**
   - setup wizard, module marketplace, api twin generator, twin replication chain

---

### representative-technical-modules-and-examples

#### 1. task description template (`task.yaml`)

```yaml
id: sync_capacities_daily
title: sync capacities notes to boostspace tasks
type: sync
agent_role: note secretary
source: capacities
target: boostspace
steps:
  - fetch_daily_note
  - format_yaml_header
  - extract_todo_summary
  - push_to_boost_task
schedule: daily
```

#### 2. straico prompt template (example)

```yaml
prompt: "extract all todo items from the following note and summarize as tasks."
input: |
  - [ ] buy milk
  - [x] finish report
  - [ ] schedule meeting
output:
  - buy milk
  - schedule meeting
```

#### 3. task execution script (typescript example)

```ts
import { fetchNote, parseToDos, pushToBoost } from "./lib";
import { logTask } from "./supabase";

async function runSyncTask() {
  const note = await fetchNote(); // get capacities note
  const todos = parseToDos(note.content); // extract tasks via straico
  const result = await pushToBoost(todos); // send tasks to boostspace

  await logTask("sync_capacities_daily", {
    input: note.content,
    output: result,
    status: "success",
  });
}

runSyncTask();
```

#### 4. supabase ai_logs table schema

```sql
CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT NOT NULL,
  date DATE,
  summary TEXT,
  raw_output JSONB,
  status TEXT CHECK (status IN ('done', 'error', 'in_progress')),
  created_at TIMESTAMP DEFAULT now()
);
```

---

## bi-core-bidirectional-sync-center-boostspace-supabase

![card-illustration](images/junaikey-infinity-loop.svg)

junai-key uses boostspace and supabase as dual cores to achieve bi-directional task/data sync, extensible to notion, aitables, capacities, and more.

### architecture-overview

```mermaid
graph TD
    A[boostspace task change] --> B[webhook trigger]
    B --> C[junai-key sync center]
    C --> D[write to supabase]
    E[supabase task/state change] --> F[trigger]
    F --> C
    C --> G[write back to boostspace]
    C --> H[prevent sync loop: state/version check]
```

### main-technical-modules

- `sync/boostspace-webhook-handler.ts`: receives boostspace webhook, parses task changes, pushes to supabase
- `sync/supabase-trigger-handler.ts`: monitors supabase data changes, writes back to boostspace
- `sync/state-version-guard.ts`: state comparison and sync loop prevention
- `integration/field-mapping.yaml`: field mapping table, supports multi-platform field standardization

### typescript framework example

```ts
// sync/boostspace-webhook-handler.ts
import { upsertTaskToSupabase } from './supabase-client';
import { parseBoostTask } from './field-mapping';

export async function handleBoostspaceWebhook(payload: any) {
  const task = parseBoostTask(payload);
  await upsertTaskToSupabase(task);
}

// sync/supabase-trigger-handler.ts
import { updateBoostTask } from './boostspace-client';
import { parseSupabaseTask } from './field-mapping';

export async function handleSupabaseTrigger(payload: any) {
  const task = parseSupabaseTask(payload);
  await updateBoostTask(task);
}
```

### field-mapping-yaml (integration/field-mapping.yaml)

```yaml
boostspace:
  id: task_id
  title: title
  status: status
  due_date: due_date
supabase:
  task_id: id
  title: title
  status: status
  due_date: due_date
```

<!-- 中文說明區塊：-->

> 雙核心雙向同步中心是 junai-key 多平台自動化與資料一致性的基石，架構可延伸至 Notion、AITable、Capacities 等。

### 同步循環防呆邏輯（sync-loop-prevention-logic）

- 每次同步時，會比對 `updated_at` 或 `version` 欄位，僅在狀態變更時才觸發寫入。
- 寫入時標記來源（如 `source: boostspace` 或 `source: supabase`），避免重複觸發。

---

> 本區塊由 AI 代理自動整理，將隨開發進度與願景持續更新。

---

> 若需保留原始中文名稱與說明，可將其移至 SPEC.md 或其他文件備查。

---

> dual-core bi-directional sync center forms the foundation for junai-key's multi-platform automation and data consistency, extensible to notion, aitables, capacities, and more.

---

> this section is auto-curated by ai agents and will be continuously updated according to development progress and vision.

---

**version**: 1.0.0-mvp  
**last updated**: 2025-06-25  
© 2025 junai-key collective. the sanctum of knowledge never closes.
