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
- [bi-core-bidirectional-sync-center-boostspace-supabase](#bi-core-bidirectional-sync-center-and-agent-group)
- [dual-core-sync-integration-center-and-agent-group](#dual-core-sync-integration-center-and-agent-group)

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

#### Extensibility & Design Notes | 擴展性與設計說明

---

##### 1. Design Principles & SOLID | 設計原則與 SOLID

- **Open/Closed Principle (OCP) 開放封閉原則**：
  - EN: All extension points (formatters, agents, middleware) are open for extension, closed for modification. This ensures core stability and flexible extensibility.
  - 中文：所有擴展點（格式工廠、代理、中間件）皆遵循 OCP，核心穩定、擴展靈活。
- **SOLID Principles**：
  - EN: Follow SOLID (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) for maintainable, scalable, and testable code.
  - 中文：遵循 SOLID 原則，確保程式碼可維護、可擴展、易於測試。
- **TypeScript Type Safety 型別安全**：
  - EN: Use strict interfaces, abstract classes, and type guards to ensure extensibility safety and cross-team clarity.
  - 中文：嚴格型別（interface/abstract class/type guard）有助於國際團隊協作與維護。
- **Bilingual Documentation 雙語文件**：
  - EN: For international teams, always provide bilingual comments and docs.
  - 中文：國際協作建議雙語註解與說明。

---

##### 2. Extensibility Patterns | 擴展模式

- **Plugin-based OutputFormatterFactory 插件化輸出格式工廠**：
  - EN: Add new output formats (Slack, CLI, Webhook, Mobile) by implementing and registering a formatter.
  - 中文：實作並註冊 formatter，即可支援多平台格式。
- **Middleware Support 中間件支援**：
  - EN: Express middleware is pluggable for authentication, logging, rate limiting, CORS, etc.
  - 中文：Express 中間件可插拔，支援認證、日誌、速率限制、跨域等。
- **Agent Injection 代理注入**：
  - EN: Inject different agent/memory instances based on platform or request content.
  - 中文：可根據平台或請求內容注入不同 agent/memory 實例。
- **API Versioning API 版本管理**：
  - EN: Path design supports /v1/, /v2/ for smooth upgrades.
  - 中文：路徑設計支援多版本共存，便於升級。

---

##### 3. Plugin Auto-Discovery & Registration | 插件自動發現與註冊

- **Auto-Discovery 自動發現**：
  - EN: Use dynamic import, glob, or registry pattern to auto-load plugins for large-scale/multi-platform scenarios.
  - 中文：動態 import、glob、註冊表模式適用於大型協作與多平台擴展。
- **Type Validation 型別驗證**：
  - EN: Validate plugin types at load time to ensure interface compliance.
  - 中文：載入時驗證型別，確保介面一致。

```typescript
// Example: Auto-discover plugins (Node.js, ESM)
import { OutputFormatterFactory } from '../OutputFormatterFactory';
import fs from 'fs';
import path from 'path';
const pluginDir = path.join(__dirname, './formatters');
for (const file of fs.readdirSync(pluginDir)) {
  if (file.endsWith('.js')) {
    const { default: Formatter, platform } = require(path.join(pluginDir, file));
    // Type guard example
    if (typeof Formatter === 'function' && typeof platform === 'string') {
      OutputFormatterFactory.register(platform, Formatter);
    }
  }
}
```

---

##### 4. Extensibility Best Practices | 擴展性最佳實踐

- **Centralized Plugin Management 插件集中管理**：
  - EN: Register plugins in a single location for maintainability.
  - 中文：插件註冊集中管理，便於維護。
- **Comprehensive Documentation 完整文件**：
  - EN: Document all extension points and provide usage examples.
  - 中文：所有擴展點需有文件與範例。
- **Code Review & Automated Testing 代碼審查與自動化測試**：
  - EN: All plugins must pass code review and automated tests.
  - 中文：插件需經過審查與自動化測試。
- **Bilingual Comments & Docs 雙語註解與說明**：
  - EN: Use English and 中文 for all key comments and docs.
  - 中文：重要註解與說明建議雙語。
- **CI/CD Integration 持續整合/部署**：
  - EN: Integrate plugin checks into CI/CD pipelines for quality assurance.
  - 中文：將插件檢查納入 CI/CD 流程，確保品質。

---

##### 5. Common Pitfalls & Anti-Patterns | 常見失敗案例與反模式

- **Tight Coupling 緊耦合**：
  - EN: Avoid hardcoding plugin logic in core modules.
  - 中文：避免在核心模組硬編碼插件邏輯。
- **Lack of Type Safety 缺乏型別安全**：
  - EN: Always use interfaces and type guards for plugin contracts.
  - 中文：插件合約務必用 interface/type guard 保證型別安全。
- **Missing Documentation 文件缺失**：
  - EN: Incomplete docs hinder international collaboration.
  - 中文：文件不全會阻礙國際協作。

---

##### 6. FAQ: Extensibility & Collaboration | 常見問答：擴展性與協作

- **Q: How to add a new platform formatter? 如何新增平台格式化器？**
  - EN: Implement the formatter, export as default, and register in the factory or auto-discovery folder.
  - 中文：實作 formatter，export default，並註冊於工廠或自動發現目錄。
- **Q: How to ensure plugin type safety? 如何確保插件型別安全？**
  - EN: Use TypeScript interfaces, abstract classes, and runtime type guards.
  - 中文：用 TypeScript interface/abstract class 與執行期 type guard。
- **Q: How to support hot-reload for plugins? 如何支援插件熱插拔/動態 reload？**
  - EN: Use file watchers and dynamic import to reload plugins at runtime.
  - 中文：用檔案監聽與動態 import，實現執行期 reload。

---

> The API Gateway is designed for maximum extensibility, security, and internationalization. All best practices are recommended for production deployments.

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

> **Section Overview**
>
> This section introduces the bi-core bidirectional sync center, which forms the foundation for multi-platform automation and data consistency in junai-key. The architecture is extensible to Notion, AITable, Capacities, and more. Both English and Chinese explanations are provided for clarity and international collaboration.

---

### Architecture Overview

#### English

junai-key uses Boostspace and Supabase as dual cores to achieve robust, bidirectional task/data sync. The design is extensible to other platforms.

```mermaid
graph TD
    A[Boostspace Task Change] --> B[Webhook Trigger]
    B --> C[Junai-Key Sync Center]
    C --> D[Write to Supabase]
    E[Supabase Task/State Change] --> F[Trigger]
    F --> C
    C --> G[Write Back to Boostspace]
    C --> H[Prevent Sync Loop: State/Version Check]
```

#### 中文

junai-key 以 Boostspace 與 Supabase 為雙核心，實現多平台任務/資料雙向同步，架構可延伸至 Notion、AITable、Capacities 等。

```mermaid
graph TD
    A[Boostspace 任務變更] --> B[Webhook 觸發]
    B --> C[Junai-Key 同步中心]
    C --> D[寫入 Supabase]
    E[Supabase 任務/狀態變更] --> F[觸發]
    F --> C
    C --> G[回寫 Boostspace]
    C --> H[循環防呆：狀態/版本檢查]
```

---

### Main Technical Modules

| Module File                          | Description (EN)                                         | 說明（中文）                        | Key Responsibilities (EN)                                   | 主要職責（中文）                      |
|--------------------------------------|----------------------------------------------------------|-------------------------------------|-------------------------------------------------------------|---------------------------------------|
| sync/boostspace-webhook-handler.ts   | Receives Boostspace webhook, parses task changes, pushes to Supabase | 接收 Boostspace webhook，解析任務變更，推送至 Supabase | 1. Listen to Boostspace webhooks<br>2. Parse and map task data<br>3. Upsert to Supabase | 1. 監聽 Boostspace webhook<br>2. 解析並映射任務資料<br>3. 寫入 Supabase |
| sync/supabase-trigger-handler.ts     | Monitors Supabase data changes, writes back to Boostspace | 監控 Supabase 資料變更，回寫 Boostspace | 1. Watch Supabase triggers<br>2. Parse and map task data<br>3. Update Boostspace | 1. 監控 Supabase 觸發器<br>2. 解析並映射任務資料<br>3. 回寫 Boostspace |
| sync/state-version-guard.ts          | State comparison and sync loop prevention                 | 狀態比對與循環防呆                   | 1. Compare state/version fields<br>2. Prevent sync loops<br>3. Mark sync source | 1. 比對狀態/版本欄位<br>2. 防止同步循環<br>3. 標記同步來源 |
| integration/field-mapping.yaml       | Field mapping table, supports multi-platform field standardization | 欄位對應表，支援多平台欄位標準化         | 1. Define cross-platform field mapping<br>2. Enable extensibility | 1. 定義跨平台欄位對應<br>2. 支援擴展性 |

---

### TypeScript Framework Example

```typescript
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

---

### Field Mapping YAML (integration/field-mapping.yaml)

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

---

#### 中文說明

> 雙核心雙向同步中心是 junai-key 多平台自動化與資料一致性的基石，架構可延伸至 Notion、AITable、Capacities 等。

---

### Sync Loop Prevention Logic

| 步驟 | 邏輯說明（中文）                                  | Logic (EN)                                         |
|------|--------------------------------------------------|----------------------------------------------------|
| 1    | 每次同步時，比對 `updated_at` 或 `version` 欄位   | Compare `updated_at` or `version` before syncing   |
| 2    | 寫入時標記來源（如 `source: boostspace`）         | Mark source (e.g., `source: boostspace`)           |
| 3    | 僅在狀態變更時才觸發寫入，避免重複觸發             | Only trigger write on state change, avoid loops    |

---

> This section is auto-curated by AI agents and will be continuously updated according to development progress and vision.

---

**version**: 1.0.0-mvp  
**last updated**: 2025-06-25  
© 2025 junai-key collective. the sanctum of knowledge never closes.
