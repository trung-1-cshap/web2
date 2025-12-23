"use client"

import { useEffect, useState } from "react";
import { getTransactions, addTransaction, updateTransaction, getCategories, type Transaction, type Category } from "../../../../lib/mockService";
import useCustomers from "./useCustomers";
import useTrash from "./useTrash";

export default function useTransactions(user?: any) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"thu" | "chi">("thu");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [actorName, setActorName] = useState("");

  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [editTransactionData, setEditTransactionData] = useState<Partial<Transaction>>({});

  const [flashMsg, setFlashMsg] = useState<string | null>(null);

  useEffect(() => {
    getTransactions().then(setItems).catch(() => {});
    getCategories().then((c) => {
      setCategories(c);
      if (c.length) setCategoryId(c[0].id);
    }).catch(() => {});
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    const created = await addTransaction({
      date: new Date().toISOString(),
      amount,
      type,
      categoryId,
      description: "-",
      accountId: undefined,
      performedBy: user?.name ?? "-",
      actorName: actorName || "-",
    });
    setItems((s) => [created, ...s]);
    setAmount(0);
    setActorName("");
  }

  function startEditTransaction(t: Transaction) {
    setEditingTransactionId(String(t.id));
    setEditTransactionData({ amount: t.amount, type: t.type, categoryId: t.categoryId, actorName: t.actorName, description: t.description, received: t.received });
  }

  function cancelEditTransaction() {
    setEditingTransactionId(null);
    setEditTransactionData({});
  }

  async function saveEditTransaction() {
    if (!editingTransactionId) return;
    const payload: Partial<Transaction> = { ...editTransactionData };
    if (payload.amount === undefined || payload.amount === null) delete payload.amount;
    if (payload.actorName === '') delete payload.actorName;
    if (payload.categoryId === '') delete payload.categoryId;
    try {
      const updated = await updateTransaction(editingTransactionId, payload);
      if (updated) {
        setItems((s) => s.map((it) => String(it.id) === String(updated.id) ? updated : it));
      }
    } catch (err) {
      console.error('saveEditTransaction failed', err);
      alert('Cập nhật giao dịch thất bại: ' + (err instanceof Error ? err.message : String(err)));
    }
    setEditingTransactionId(null);
    setEditTransactionData({});
  }

  async function toggleTransactionReceived(id: string, val: boolean) {
    const updated = await updateTransaction(id, { received: val });
    if (updated) setItems((s) => s.map((t) => String(t.id) === String(updated.id) ? updated : t));
  }
 
  // compose customer and trash hooks
  const customersApi = useCustomers(user, setFlashMsg);
  const trashApi = useTrash(items, setItems, user, setFlashMsg);

  return {
    items,
    setItems,
    categories,
    setCategories,
    amount,
    setAmount,
    type,
    setType,
    categoryId,
    setCategoryId,
    actorName,
    setActorName,
    editingTransactionId,
    setEditingTransactionId,
    editTransactionData,
    setEditTransactionData,
    flashMsg,
    setFlashMsg,
    handleAdd,
    startEditTransaction,
    cancelEditTransaction,
    saveEditTransaction,
    toggleTransactionReceived,
    // customers api
    ...customersApi,
    // trash api
    ...trashApi,
  } as const;
}
