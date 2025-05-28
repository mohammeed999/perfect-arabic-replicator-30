
import React, { createContext, useContext, ReactNode } from 'react';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { useInventory } from '@/hooks/useInventory';

interface InventoryContextType {
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => InventoryItem;
  updateInventoryItem: (item: InventoryItem) => InventoryItem;
  deleteInventoryItem: (itemId: string) => string;
  addTransaction: (transaction: Omit<InventoryTransaction, "id" | "date">) => InventoryTransaction;
  getLowInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getRawMaterialsValue: () => number;
  getFinishedProductsValue: () => number;
  getItemTransactions: (itemId: string) => InventoryTransaction[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
  children: ReactNode;
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  const inventoryHook = useInventory();

  const value: InventoryContextType = {
    ...inventoryHook,
    addInventoryTransaction: inventoryHook.addTransaction,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
}
