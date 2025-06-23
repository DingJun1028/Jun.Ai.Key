import React, { useState, useEffect } from "react";
import {
  ClipboardList, CalendarDays, Text, QrCode, Calculator, Sparkles, Palette, Languages, Mic, Type, Share2, BookKey
} from "lucide-react";
import { KnowledgeRecord, EvolutionaryInsight } from '../interfaces'; // Import necessary interfaces

// Define data structures (moved from Markdown)
// TODO: These should be fetched dynamically from the Knowledge Base or other modules (Part of 雙向同步領域 / 永久記憶中樞)
const FUNCTION_TABS = [
  { icon: Sparkles, label: "AI生成" }, // AI Generation (Leverages 智慧沉澱秘術)
  { icon: BookKey, label: "知識庫" }, // Knowledge Base Interaction (Leverages 永久記憶中樞)
  { icon: ClipboardList, label: "剪貼簿" }, // Clipboard Access (Requires Device Adapter Rune)
  { icon: CalendarDays, label: "日期插入" }, // Date Insertion (Simple Utility or Rune)
  { icon: Text, label: "文本效果" }, // Text Effects (Simple Utility or Script Rune)
  { icon: QrCode, label: "QR生成" }, // QR Code Generation (API Adapter Rune)
  { icon: Palette, label: "主題切換" }, // Theme Switching (UI Component Rune)
  { icon: Share2, label: "分享" }, // Sharing (Requires Device Adapter Rune)
  // { icon: Calculator, label: "計算器" }, // Calculator (Simple Utility or Script Rune) - Removed for space
  // { icon: Languages, label: "翻譯" }, // Translation (AI Agent Rune) - Removed for space
  // { icon: Mic, label: "語音輸入" }, // Voice Input (Device Adapter Rune) - Removed for space
  // { icon: Type, label: "手寫輸入" }, // Handwriting Input (Device Adapter Rune) - Removed for space
];

// TODO: These should be fetched dynamically from the Knowledge Base or suggested by AI (Part of 永久記憶中樞 / 智慧沉澱秘術)
const PHRASES = [
  { group: "常用", items: ["你好，今天有什麼計畫？", "準備下班了！", "午餐吃什麼？", "週會重點：…", "已收到，馬上處理。"] },
  { group: "模板", items: ["[公司名] 地址：", "我的郵件：", "宅配到貨通知：…"] },
  // AI推薦 will be dynamic
];

// Standard keyboard layouts (can be expanded or customized)
const BOPOMOFO_KEYS = [
  ["ㄅ","ㄆ","ㄇ","ㄈ","ㄉ","ㄊ","ㄋ","ㄌ","ㄍ","ㄎ","ㄏ","ㄐ","ㄑ","ㄒ"],
  ["ㄓ","ㄔ","ㄕ","ㄖ","ㄗ","ㄘ","ㄙ","ㄧ","ㄨ","ㄩ","ㄚ","ㄛ","ㄜ","ㄝ"],
  ["ㄞ","ㄟ","ㄠ","ㄡ","ㄢ","ㄣ","ㄤ","ㄥ","ㄦ"],
  ["ˊ","ˇ","ˋ","˙"] // Tones
];

const ENGLISH_KEYS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"]
];

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const junaiAssistant: any = window.systemContext?.junaiAssistant; // Access AI Assistant (智慧沉澱秘術)
const knowledgeSync: any = window.systemContext?.knowledgeSync; // Access Knowledge Sync (永久記憶中樞)
const runeEngraftingCenter: any = window.systemContext?.runeEngraftingCenter; // Access Rune Engrafting Center (符文嵌入)
const wisdomSecretArt: any = window.systemContext?.wisdomSecretArt; // Access Wisdom Secret Art (智慧沉澱秘術)
const evolutionEngine: any = window.systemContext?.evolutionEngine; // Access Evolution Engine (無限進化)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Keyboard: React.FC = () => { // Changed component name to Keyboard and added FC type
  const [kb, setKb] = useState<'zh'|'en'>("zh"); // 'zh' for Bopomofo, 'en' for English
  const [input, setInput] = useState(""); // State to hold the simulated input text
  const [isProcessingFunction, setIsProcessingFunction] = useState(false); // State for function button loading
  const [processingFunctionLabel, setProcessingFunctionLabel] = useState<string | null>(null); // Track which function is processing
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]); // State for AI/Evolution suggestions
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeRecord[]>([]); // State for KB search results
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);


  // Effect to fetch smart suggestions and knowledge results based on input
  useEffect(() => {
      const userId = systemContext?.currentUser?.id;
      if (!userId || !wisdomSecretArt || !knowledgeSync) {
          setSmartSuggestions([]);
          setKnowledgeResults([]);
          setIsLoadingSuggestions(false);
          setIsLoadingKnowledge(false);
          return;
      }

      // Debounce the search/suggestion fetching
      const handler = setTimeout(async () => {
          if (input.trim()) {
              // Fetch Smart Suggestions (Simulated)
              setIsLoadingSuggestions(true);
              try {
                  // In a real scenario, call WisdomSecretArt or EvolutionEngine
                  // For MVP, simulate suggestions based on input keywords
                  const simulatedDecision = await wisdomSecretArt.analyzeIntentAndDecideAction(input, userId); // Use analyzeIntentAndDecideAction as a proxy
                  // Filter out the default 'answer_question' intent if it's the only one
                  if (simulatedDecision.intent !== 'answer_question' || Object.keys(simulatedDecision.action.details).length > 1) {
                       // Convert the suggested action into a displayable string or action label
                       const suggestionLabel = simulatedDecision.intent === 'create_task' ? `建議任務: ${simulatedDecision.action.details.description}` :
                                               simulatedDecision.intent === 'execute_rune' ? `建議符文: ${simulatedDecision.action.details.action} (${simulatedDecision.action.details.runeId})` :
                                               simulatedDecision.intent === 'search_knowledge' ? `建議搜尋: ${simulatedDecision.action.details.query}` :
                                               simulatedDecision.intent === 'sync_mobile_git' ? `建議同步: Git ${simulatedDecision.action.details.direction}` :
                                               `AI建議: ${sim(simulatedDecision)}`; // Fallback simulation
                       setSmartSuggestions([suggestionLabel]); // Display the suggestion
                  } else {
                       setSmartSuggestions([]); // No specific suggestion
                  }

              } catch (err) {
                  console.error('Error fetching smart suggestions:', err);
                  setSmartSuggestions(['獲取建議失敗']);
              } finally {
                  setIsLoadingSuggestions(false);
              }

              // Fetch Knowledge Base Results
              setIsLoadingKnowledge(true);
              try {
                  const results = await knowledgeSync.searchKnowledge(input, userId); // Search KB based on input
                  setKnowledgeResults(results.slice(0, 3)); // Show top 3 results
              } catch (err) {
                  console.error('Error fetching knowledge results:', err);
                  setKnowledgeResults([]); // Clear results on error
              } finally {
                  setIsLoadingKnowledge(false);
              }

          } else {
              // Clear suggestions and results if input is empty
              setSmartSuggestions([]);
              setKnowledgeResults([]);
              setIsLoadingSuggestions(false);
              setIsLoadingKnowledge(false);
          }
      }, 500); // Debounce time: 500ms

      // Cleanup function to clear the timeout
      return () => {
          clearTimeout(handler);
      };

  }, [input, systemContext?.currentUser?.id, wisdomSecretArt, knowledgeSync]); // Re-run effect when input, user ID, or relevant services change


  // Helper to simulate AI response for generic input if no specific intent is matched
  const sim = (simulatedDecision: any) => {
      if (simulatedDecision.intent === 'answer_question' && simulatedDecision.action.type === 'answer_via_ai') {
          // Simulate a generic AI response based on the question
          const q = simulatedDecision.action.details.question;
          if (q.includes('天氣')) return '今天天氣不錯。';
          if (q.includes('時間')) return new Date().toLocaleTimeString();
          if (q.includes('你好')) return '你好！有什麼可以幫忙的嗎？';
          return '好的，我正在思考... (模擬AI回應)';
      }
      return 'AI建議'; // Default label for other simulated intents
  };


  function handleKeyClick(key: string) {
    if (!key) return;
    setInput((v) => v + key);
     // Simulate recording user action (Part of 六式奧義: 觀察)
    const userId = systemContext?.currentUser?.id;
    if (userId) {
        authorityForgingEngine?.recordAction({
            type: 'web:keyboard:key',
            details: { key },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });
    }
  }

  function handlePhraseClick(phrase: string) {
      setInput((v)=>v+phrase);
       // Simulate recording user action (Part of 六式奧義: 觀察)
       const userId = systemContext?.currentUser?.id;
       if (userId) {
            authorityForgingEngine?.recordAction({
                type: 'web:keyboard:phrase',
                details: { phrase },
                context: { platform: 'web', page: 'keyboard' },
                user_id: userId, // Associate action with user
            });
       }
  }

   function handleSuggestionClick(suggestion: string) {
       console.log(`Suggestion clicked: ${suggestion}`);
       setInput((v) => v + suggestion); // Append suggestion to input
        // Simulate recording user action (Part of 六式奧義: 觀察)
       const userId = systemContext?.currentUser?.id;
       if (userId) {
            authorityForgingEngine?.recordAction({
                type: 'web:keyboard:suggestion',
                details: { suggestion },
                context: { platform: 'web', page: 'keyboard' },
                user_id: userId, // Associate action with user
            });
       }
       // TODO: If the suggestion implies an action (like "建議任務: ..."),
       // you might want to trigger that action here instead of just inserting text.
       // This would involve parsing the suggestion string or having the suggestion object
       // contain the action details directly.
   }

   function handleKnowledgeClick(record: KnowledgeRecord) {
       console.log(`Knowledge result clicked: ${record.id}`);
       // Append the answer to the input
       setInput((v) => v + record.answer);
        // Simulate recording user action (Part of 六式奧義: 觀察)
       const userId = systemContext?.currentUser?.id;
       if (userId) {
            authorityForgingEngine?.recordAction({
                type: 'web:keyboard:kb_insert',
                details: { recordId: record.id, question: record.question },
                context: { platform: 'web', page: 'keyboard' },
                user_id: userId, // Associate action with user
            });
       }
   }


  async function handleFunctionClick(label: string) {
       console.log(`Function tab clicked: ${label}`);
        const userId = systemContext?.currentUser?.id;
        if (!userId) {
            alert("Please log in to use this function.");
            return;
        }

        // Simulate recording user action (Part of 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: 'web:keyboard:function',
            details: { label },
            context: { platform: 'web', page: 'keyboard' },
            user_id: userId, // Associate action with user
        });

       setProcessingFunctionLabel(label); // Indicate which function is processing
       try {
           // Implement actual function logic based on label
           // These functions could be 萬能元鍵 or trigger tasks/runes
           switch (label) {
               case "AI生成":
                   // Example: Use AI Assistant to generate text based on current input
                   if (junaiAssistant && input.trim()) {
                       alert("Calling AI Assistant...");
                       const aiResponse = await junaiAssistant.processInput(input, { context: 'keyboard_input' });
                       setInput(input + " " + aiResponse); // Append AI response to input
                       alert("AI Response received!");
                   } else {
                       alert("Please enter some text for AI generation or AI Assistant not available.");
                   }
                   break;
               case "知識庫":
                   // Example: Search Knowledge Base based on current input
                   if (knowledgeSync && input.trim()) {
                       alert("Searching Knowledge Base...");
                       const results = await knowledgeSync.searchKnowledge(input, userId);
                       if (results && results.length > 0) {
                           const firstResult = results[0];
                           // Append first result's answer to input or show options
                           setInput(input + " " + firstResult.answer.substring(0, 100) + "..."); // Append snippet
                           alert(`Found ${results.length} KB results. Appended snippet of the first.`);
                           console.log("KB Search Results:", results); // Log full results
                       } else {
                           alert("No Knowledge Base results found.");
                       }
                   } else {
                       alert("Please enter some text to search or Knowledge Sync not available.");
                   }
                   break;
               case "剪貼簿":
                   // TODO: Implement clipboard access via Device Adapter Rune (e.g., Scripting.app)
                   // Simulate calling a placeholder rune action
                   if (runeEngraftingCenter) {
                       alert("Simulating Clipboard access via Rune...");
                       try {
                           // Assuming a rune with ID 'device-clipboard-rune' and action 'getClipboard' exists
                           const clipboardContent = await runeEngraftingCenter.executeRuneAction('device-clipboard-rune', 'getClipboard', {}, userId);
                           if (clipboardContent?.status === 'simulated_success' && clipboardContent.data?.content) {
                               setInput(input + clipboardContent.data.content);
                               alert("Simulated clipboard content pasted!");
                           } else {
                               alert("Failed to get simulated clipboard content.");
                           }
                       } catch (runeErr: any) {
                           console.error("Error executing clipboard rune:", runeErr);
                           alert(`Error accessing clipboard: ${runeErr.message}`);
                       }
                   } else {
                       alert("RuneEngraftingCenter not available.");
                   }
                   break;
               case "日期插入":
                   // Simple implementation
                   setInput(input + new Date().toLocaleString());
                   alert("Inserted current date and time.");
                   break;
               case "文本效果":
                    // Simulate calling a placeholder rune action
                   if (runeEngraftingCenter && input.trim()) {
                       alert("Simulating Text Effect via Rune...");
                       try {
                           // Assuming a rune with ID 'text-effect-rune' and action 'applyEffect' exists
                           const effectResult = await runeEngraftingCenter.executeRuneAction('text-effect-rune', 'applyEffect', { text: input, effect: 'bold' }, userId);
                           if (effectResult?.status === 'simulated_success' && effectResult.output) {
                               setInput(effectResult.output); // Replace input with modified text
                               alert("Simulated text effect applied!");
                           } else {
                               alert("Failed to apply simulated text effect.");
                           }
                       } catch (runeErr: any) {
                           console.error("Error executing text effect rune:", runeErr);
                           alert(`Error applying text effect: ${runeErr.message}`);
                       }
                   } else {
                       alert("Please enter some text for effect or RuneEngraftingCenter not available.");
                   }
                   break;
               case "QR生成":
                    // Simulate calling a placeholder rune action
                   if (runeEngraftingCenter && input.trim()) {
                       alert("Simulating QR Code Generation via Rune...");
                       try {
                           // Assuming a rune with ID 'qr-code-rune' and action 'generate' exists
                           const qrResult = await runeEngraftingCenter.executeRuneAction('qr-code-rune', 'generate', { text: input }, userId);
                           if (qrResult?.status === 'simulated_success' && qrResult.data?.imageUrl) {
                               // In a real app, you'd display the image. Here, just show the URL.
                               alert(`Simulated QR Code generated! Image URL: ${qrResult.data.imageUrl}`);
                               console.log("Simulated QR Code Data:", qrResult.data);
                           } else {
                               alert("Failed to generate simulated QR Code.");
                           }
                       } catch (runeErr: any) {
                           console.error("Error executing QR rune:", runeErr);
                           alert(`Error generating QR Code: ${runeErr.message}`);
                       }
                   } else {
                       alert("Please enter some text for QR code or RuneEngraftingCenter not available.");
                   }
                   break;
               case "主題切換":
                    // Simulate calling a placeholder rune action
                   if (runeEngraftingCenter) {
                       alert("Simulating Theme Switch via Rune...");
                       try {
                           // Assuming a rune with ID 'ui-theme-rune' and action 'toggleTheme' exists
                           const themeResult = await runeEngraftingCenter.executeRuneAction('ui-theme-rune', 'toggleTheme', {}, userId);
                           if (themeResult?.status === 'simulated_success') {
                               // In a real app, this would update the UI theme
                               alert(`Simulated theme switched! Current theme: ${themeResult.data?.currentTheme || 'unknown'}`);
                           } else {
                               alert("Failed to simulate theme switch.");
                           }
                       } catch (runeErr: any) {
                           console.error("Error executing theme rune:", runeErr);
                           alert(`Error switching theme: ${runeErr.message}`);
                       }
                   } else {
                       alert("RuneEngraftingCenter not available.");
                   }
                   break;
                case "分享":
                    // Simulate calling a placeholder rune action
                   if (runeEngraftingCenter && input.trim()) {
                       alert("Simulating Share via Rune...");
                       try {
                           // Assuming a rune with ID 'device-share-rune' and action 'shareText' exists
                           const shareResult = await runeEngraftingCenter.executeRuneAction('device-share-rune', 'shareText', { text: input }, userId);
                           if (shareResult?.status === 'simulated_success') {
                               alert("Simulated share action completed!");
                           } else {
                               alert("Failed to simulate share action.");
                           }
                       } catch (runeErr: any) {
                           console.error("Error executing share rune:", runeErr);
                           alert(`Error sharing text: ${runeErr.message}`);
                       }
                   } else {
                       alert("Please enter some text to share or RuneEngraftingCenter not available.");
                   }
                   break;
               // TODO: Implement other function tabs by calling relevant Runes or core modules
               default:
                   alert(`Function \"${label}\" clicked! (Placeholder)`);
                   break;
           }
       } catch (error: any) {
           console.error(`Error executing function \"${label}\":`, error);
           alert(`Error executing function \"${label}\": ${error.message}`);
       } finally {
           setProcessingFunctionLabel(null); // Reset processing state
       }
  }

   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to use the smart keyboard.</p>
               </div>
            </div>
       );
  }


  return (
    // Added a main container div with basic centering and padding
    <div className="container mx-auto p-4 flex flex-col items-center">

      {/* Header & 產品定位 */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">Jun.Ai.key (<span className="text-blue-400">萬能元鍵</span>)</h1>
        <p className="text-neutral-600 dark:text-neutral-400">鍵盤 (<span className="text-blue-400">萬能元鍵</span>) × 便箋 × AI × 內容整合 · ToMemo/Flexiboard 風格Demo</p>
      </header>

      {/* 功能橫向滾動工具條 */}
      <nav className="w-full max-w-lg flex flex-row items-center gap-2 py-3 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 mb-1">
        {FUNCTION_TABS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-800 shadow active:scale-95 hover:bg-blue-50 hover:dark:bg-blue-900 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleFunctionClick(label)}
            disabled={!!processingFunctionLabel} // Disable all function buttons while any function is processing
          >
            <Icon size={24} className="mb-0.5 text-blue-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">{processingFunctionLabel === label ? '...' : label}</span>
          </button>
        ))}
      </nav>

      {/* 輸入區 */}
      <div className="w-full max-w-lg px-4 py-3 rounded-xl bg-white/90 shadow border border-neutral-100 dark:bg-neutral-900/90 dark:border-neutral-800 flex items-center justify-between select-none mb-2">
        <div className="text-lg tracking-widest font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap overflow-x-auto max-w-[75vw] scrollbar-thin">
          {input || <span className="text-neutral-300 dark:text-neutral-600">請輸入…</span>}
        </div>
        <button
          className="ml-2 px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300"
          onClick={() => setInput("")}
        >
          清除
        </button>
      </div>

      {/* 上下滾動短語區 */}
      <section className="w-full max-w-lg flex flex-col h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 mb-2 gap-2">
        {PHRASES.map(section => (
          <div key={section.group} className="">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">{section.group}</div>
            <div className="flex flex-row flex-wrap gap-2">
              {section.items.map((phrase, i) => (
                <button
                  key={phrase+i}
                  className="px-3 py-2 rounded-2xl bg-[#f7fafe] dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:bg-blue-100 hover:dark:bg-neutral-600 text-[15px] font-medium text-neutral-700 dark:text-neutral-50 flex-shrink-0 active:scale-95 transition"
                  onClick={()=>handlePhraseClick(phrase)}
                >{phrase}</button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 智慧推薦/知識庫插入區 */}
      <div className="w-full max-w-lg flex flex-col gap-2 mb-3 px-2">
          {/* 智慧推薦 */}
          <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">智慧推薦 (AI Suggestions)</div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingSuggestions ? (
                      <span className="text-neutral-400 text-sm">載入建議中...</span>
                  ) : smartSuggestions.length > 0 ? (
                      smartSuggestions.map((suggestion, i) => (
                          <button
                              key={'ai-sug-'+i}
                              className="px-3 py-2 rounded-2xl bg-blue-500/80 hover:bg-blue-600/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition"
                              onClick={() => handleSuggestionClick(suggestion)}
                          >
                              {suggestion}
                          </button>
                      ))
                  ) : (
                      <span className="text-neutral-400 text-sm">無智慧推薦</span>
                  )}
              </div>
          </div>

          {/* 知識庫插入 */}
           <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mb-1 pl-1">知識庫插入 (Knowledge Base)</div>
              <div className="flex flex-row flex-wrap gap-2 min-h-[30px]"> {/* min-h to prevent layout shift */}
                  {isLoadingKnowledge ? (
                      <span className="text-neutral-400 text-sm">搜尋知識庫中...</span>
                  ) : knowledgeResults.length > 0 ? (
                      knowledgeResults.map((record) => (
                          <button
                              key={'kb-res-'+record.id}
                              className="px-3 py-2 rounded-2xl bg-green-400/80 hover:bg-green-500/80 text-white text-[15px] font-medium shadow-sm flex-shrink-0 active:scale-95 transition"
                              onClick={() => handleKnowledgeClick(record)}
                              title={`Q: ${record.question}`} // Show question on hover
                          >
                              {record.answer.substring(0, 30)}{record.answer.length > 30 ? '...' : ''} {/* Show snippet of answer */}
                          </button>
                      ))
                  ) : (
                      <span className="text-neutral-400 text-sm">無相關知識</span>
                  )}
              </div>
          </div>
      </div>


      {/* iOS 原生注音/英文鍵盤區 · 超高復刻，左右切換 */}
      <section className="bg-white/95 dark:bg-neutral-900 rounded-3xl shadow-2xl pt-4 pb-7 px-3 w-full max-w-lg mb-3 border border-neutral-200 dark:border-neutral-800 select-none">
        {/* 語言切換 row */}
        <div className="flex justify-between items-center pb-3 px-2">
          <button onClick={()=>setKb(kb==='zh'?'en':'zh')} className="px-3 py-1.5 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-200 text-xs font-semibold shadow active:scale-95 transition">
            {kb==='zh'?'切換英文':'切換注音'}
          </button>
          <span className="text-xs text-neutral-400">鍵盤體驗貼近 iOS</span>
        </div>

        {kb==='zh' ? (
          <div className="flex flex-col gap-1"> {/* Bopomofo Keyboard */}
            {BOPOMOFO_KEYS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((key, keyIndex) => (
                  <button
                    key={keyIndex}
                    className={`flex-1 h-10 rounded-md flex items-center justify-center text-lg font-medium ${key ? 'bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70' : 'bg-transparent cursor-default'}`}
                    onClick={() => handleKeyClick(key)}
                    disabled={!key}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
             {/* Additional Bopomofo keys row (space, enter, etc.) */}
             <div className="flex justify-center gap-1 mt-1">
                {/* TODO: Implement Shift, Numbers/Symbols, Enter, Backspace */}
                <button className="flex-[1.5] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium disabled:opacity-50" disabled>符號 (TODO)</button>
                <button className="flex-[1.5] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium disabled:opacity-50" disabled>切換 (TODO)</button> {/* Placeholder for language/keyboard switch, currently handled by the button above */}
                <button className="flex-[4] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium" onClick={() => handleKeyClick(' ')}>Space</button>
                <button className="flex-[1.5] h-10 rounded-md bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm font-medium active:scale-95 transition disabled:opacity-50" disabled>Enter (TODO)</button> {/* Placeholder for Enter */}
                {/* TODO: Add Backspace button */}
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1"> {/* English Keyboard */}
            {ENGLISH_KEYS.map((row, rowIndex) => (
              <div key={rowIndex} className={`flex justify-center gap-1 ${rowIndex === 1 ? 'pl-4 pr-4' : rowIndex === 2 ? 'pl-10 pr-10' : ''}`}> {/* Add padding for middle rows */}
                {row.map((key, keyIndex) => (
                  <button
                    key={keyIndex}
                    className="flex-1 h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 text-lg font-medium active:bg-neutral-400/70 dark:active:bg-neutral-600/70"
                    onClick={() => handleKeyClick(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
             {/* Additional English keys row (shift, space, etc.) */}
             <div className="flex justify-center gap-1 mt-1">
                {/* TODO: Implement 123, Globe, Return, Backspace */}
                <button className="flex-[1.5] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium disabled:opacity-50" disabled>123 (TODO)</button> {/* Placeholder for 123 */}
                <button className="flex-[1.5] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium disabled:opacity-50" disabled>Globe (TODO)</button> {/* Placeholder for Globe */}
                <button className="flex-[4] h-10 rounded-md bg-neutral-300/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-neutral-100 active:bg-neutral-400/70 dark:active:bg-neutral-600/70 text-sm font-medium" onClick={() => handleKeyClick(' ')}>Space</button>
                <button className="flex-[1.5] h-10 rounded-md bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm font-medium active:scale-95 transition disabled:opacity-50" disabled>Return (TODO)</button> {/* Placeholder for Return */}
                {/* TODO: Add Backspace button */}
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Keyboard; // Export the component