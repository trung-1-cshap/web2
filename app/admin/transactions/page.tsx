"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction, getCategories, getCustomers, addCustomer, deleteCustomer, updateCustomer, type Transaction, type Category, type Customer } from "../../../lib/mockService";
import TransactionsForm from "./components/TransactionsForm";
import TransactionsTable from "./components/TransactionsTable";
import CustomersSection from "./components/CustomersSection";
import TrashSection from "./components/TrashSection";
import ReceivedSection from "./components/ReceivedSection";
import useTransactions from "./hooks/useTransactions";

export default function TransactionsPage() {
  const { user } = useAuth();
  const {
    items,
    categories,
    amount,
    setAmount,
    type,
    setType,
    categoryId,
    setCategoryId,
    actorName,
    setActorName,
    customers,
    custName,
    setCustName,
    custPhone,
    setCustPhone,
    custDateType,
    setCustDateType,
    custDate,
    setCustDate,
    custDepositAmount,
    setCustDepositAmount,
    custContractAmount,
    setCustContractAmount,
    custCommission,
    setCustCommission,
    editingTransactionId,
    editTransactionData,
    setEditTransactionData,
    editingCustomerId,
    editCustomerData,
    setEditCustomerData,
    trash,
    customersTrash,
    flashMsg,
    handleAdd,
    handleAddCustomer,
    handleDeleteCustomer,
    toggleCustomerReceived,
    startEditTransaction,
    cancelEditTransaction,
    saveEditTransaction,
    toggleTransactionReceived,
    startEditCustomer,
    cancelEditCustomer,
    saveEditCustomer,
    handleExportExcel,
    handleDelete,
    restoreFromTrash,
    restoreCustomerFromTrash,
    permanentlyDeleteCustomer,
    permanentlyDelete,
    permanentlyDeleteAll,
    permanentlyDeleteAllCustomers,
  } = useTransactions(user);
  const [activeTab, setActiveTab] = useState<"transactions" | "customers" | "received" | "trash">("customers");


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Giao dịch Thu/Chi</h2>

      <div className="mb-4 flex gap-2 items-center">
        <button type="button" onClick={() => setActiveTab("transactions")} className={`px-3 py-1 rounded-t ${activeTab === "transactions" ? "bg-white border-t border-l border-r" : "bg-gray-100"}`}>Giao dịch</button>
        <button type="button" onClick={() => setActiveTab("customers")} className={`px-3 py-1 rounded-t ${activeTab === "customers" ? "bg-white border-t border-l border-r" : "bg-gray-100"}`}>Khách hàng</button>
        <button type="button" onClick={() => setActiveTab("received")} className={`px-3 py-1 rounded-t ${activeTab === "received" ? "bg-white border-t border-l border-r" : "bg-gray-100"}`}>Đã thu</button>
        <button type="button" onClick={() => setActiveTab("trash")} className={`px-3 py-1 rounded-t ${activeTab === "trash" ? "bg-white border-t border-l border-r" : "bg-gray-100"}`}>Thùng rác</button>
      </div>
      {flashMsg && (
        <div className="mb-3 text-sm text-green-700 bg-green-100 p-2 rounded">{flashMsg}</div>
      )}

      { activeTab === "transactions" && (
        <TransactionsForm
          amount={amount}
          setAmount={setAmount}
          type={type}
          setType={setType}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          actorName={actorName}
          setActorName={setActorName}
          categories={categories}
          onAdd={handleAdd}
        />
      )}

      { activeTab === "received" && (
        <ReceivedSection
          items={items}
          customers={customers}
          categories={categories}
          user={user}
          startEditTransaction={startEditTransaction}
          handleDelete={handleDelete}
          toggleTransactionReceived={toggleTransactionReceived}
          toggleCustomerReceived={toggleCustomerReceived}
        />
      )}

      { activeTab === "customers" && (
        <CustomersSection
          customers={customers}
          custName={custName}
          setCustName={setCustName}
          custPhone={custPhone}
          setCustPhone={setCustPhone}
          custDateType={custDateType}
          setCustDateType={setCustDateType}
          custDate={custDate}
          setCustDate={setCustDate}
          custDepositAmount={custDepositAmount}
          setCustDepositAmount={setCustDepositAmount}
          custContractAmount={custContractAmount}
          setCustContractAmount={setCustContractAmount}
          custCommission={custCommission}
          setCustCommission={setCustCommission}
          handleAddCustomer={handleAddCustomer}
          handleExportExcel={handleExportExcel}
          editingCustomerId={editingCustomerId}
          editCustomerData={editCustomerData}
          setEditCustomerData={setEditCustomerData}
          startEditCustomer={startEditCustomer}
          cancelEditCustomer={cancelEditCustomer}
          saveEditCustomer={saveEditCustomer}
          handleDeleteCustomer={handleDeleteCustomer}
          toggleCustomerReceived={toggleCustomerReceived}
          user={user}
        />
      )}

        { activeTab === "trash" && (
          <TrashSection
            trash={trash}
            customersTrash={customersTrash}
            user={user}
            categories={categories}
            restoreFromTrash={restoreFromTrash}
            restoreCustomerFromTrash={restoreCustomerFromTrash}
            permanentlyDelete={permanentlyDelete}
            permanentlyDeleteCustomer={permanentlyDeleteCustomer}
            permanentlyDeleteAll={permanentlyDeleteAll}
            permanentlyDeleteAllCustomers={permanentlyDeleteAllCustomers}
          />
        )}

      

      { activeTab === "transactions" && (
        <TransactionsTable
          items={items}
          categories={categories}
          user={user}
          editingTransactionId={editingTransactionId}
          editTransactionData={editTransactionData}
          setEditTransactionData={(p) => setEditTransactionData(p)}
          startEditTransaction={startEditTransaction}
          cancelEditTransaction={cancelEditTransaction}
          saveEditTransaction={saveEditTransaction}
          toggleTransactionReceived={toggleTransactionReceived}
          handleDelete={handleDelete}
        />
      )}
      
    </div>
  );
}
