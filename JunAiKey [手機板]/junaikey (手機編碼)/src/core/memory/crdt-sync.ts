// src/core/memory/crdt-sync.ts
// 永久記憶中樞 (Long-term Memory) - CRDT 同步演算法 (Placeholder)
// This file is a placeholder for CRDT implementation if needed for complex offline-first or multi-writer scenarios.
// For basic Supabase Realtime sync, a full CRDT might not be necessary.
// Part of the Bidirectional Sync Domain (雙向同步領域).
// Design Principle: Supports MECE by defining clear rules for merging data changes.

interface CRDTEntry {
  id: string;
  timestamp: number; // Using timestamp as a simple version indicator for MVP
  value: any;
  // In a real CRDT, you'd use vector clocks or similar mechanisms
  // vectorClock?: Record<string, number>;
  // tombstone?: boolean; // For deletions
}

/**
 * Merges local and remote CRDT entries.
 * In this MVP placeholder, it's a simple merge based on timestamp (last write wins for same ID).
 * A real CRDT implementation would be more complex (e.g., LWW-element-set, PN-counter).
 */
export const mergeCRDT = (local: CRDTEntry[], remote: CRDTEntry[]): CRDTEntry[] => {
  console.log('Merging CRDT data (placeholder)...');
  const mergedMap = new Map<string, CRDTEntry>();

  // Add local entries
  local.forEach(entry => mergedMap.set(entry.id, entry));

  // Add or update with remote entries (last write wins based on timestamp)
  remote.forEach(entry => {
    const existing = mergedMap.get(entry.id);
    if (!existing || entry.timestamp > existing.timestamp) {
      mergedMap.set(entry.id, entry);
    }
    // TODO: Handle tombstones for deletions in a real CRDT
  });

  const mergedEntries = Array.from(mergedMap.values());

  // Sort by timestamp (optional, but can help with deterministic processing)
  mergedEntries.sort((a, b) => a.timestamp - b.timestamp);

  console.log('Merge complete (placeholder). Total entries:', mergedEntries.length);
  return mergedEntries;
};

// TODO: Implement actual CRDT logic (e.g., handling deletions, different CRDT types)
// TODO: Integrate with sync mechanism (e.g., WebSocket, Supabase Realtime) (Part of Bidirectional Sync Domain)
// TODO: Define how CRDT state is stored and retrieved (e.g., in local storage, IndexedDB, or a dedicated Supabase table)
// TODO: This module is part of the Bidirectional Sync Domain (雙向同步領域).

// Example Usage (for testing)
// const localData: CRDTEntry[] = [
//   { id: 'task-1', timestamp: 1678886400000, value: { text: 'Buy milk', completed: false } },
//   { id: 'task-2', timestamp: 1678886460000, value: { text: 'Walk dog', completed: false } },
// ];
// const remoteData: CRDTEntry[] = [
//   { id: 'task-1', timestamp: 1678886500000, value: { text: 'Buy milk', completed: true } }, // Updated
//   { id: 'task-3', timestamp: 1678886520000, value: { text: 'Read book', completed: false } }, // New
// ];
// const result = mergeCRDT(localData, remoteData);
// console.log(result);