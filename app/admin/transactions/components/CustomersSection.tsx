"use client"

import React from "react";
import type { Customer } from "../../../../lib/mockService";
import AddCustomerForm from "./customers/AddCustomerForm";
import CustomersTable from "./customers/CustomersTable";
import { canExport } from "../../../../lib/permissions";

// CustomersSection: giao diện quản lý khách hàng
// - Form thêm khách hàng
// - Nút xuất Excel
// - Bảng danh sách khách hàng (hiển thị, sửa, xóa, đánh dấu "Đã thu")

type Props = {
  // customers: danh sách khách hàng hiện có
  customers: Customer[];
  // custName, custPhone, ...: các state và setter dùng cho form thêm khách
  custName: string;
  setCustName: (v: string) => void;
  custPhone: string;
  setCustPhone: (v: string) => void;
  custDateType: "deposit" | "contract";
  setCustDateType: (v: "deposit" | "contract") => void;
  custDate: string;
  setCustDate: (v: string) => void;
  custDepositAmount: string;
  setCustDepositAmount: (v: string) => void;
  custContractAmount: string;
  setCustContractAmount: (v: string) => void;
  custContractMonths: string;
  setCustContractMonths: (v: string) => void;
  custCommission: string;
  setCustCommission: (v: string) => void;
  // handleAddCustomer: gọi khi submit form thêm khách
  handleAddCustomer: (e: React.FormEvent) => void;
  // handleExportExcel: xuất file Excel từ danh sách khách
  handleExportExcel: () => Promise<void>;
  editingCustomerId: string | null;
  editCustomerData: Partial<Customer>;
  setEditCustomerData: React.Dispatch<React.SetStateAction<Partial<Customer>>>;
  startEditCustomer: (c: Customer) => void;
  cancelEditCustomer: () => void;
  saveEditCustomer: () => Promise<void>;
  handleDeleteCustomer: (id: string) => Promise<void>;
  toggleCustomerReceived: (id: string, val: boolean) => Promise<void>;
  handleApproveCustomer?: (id: string) => Promise<void> | void;
  user?: any;
};

export default function CustomersSection({ customers, custName, setCustName, custPhone, setCustPhone, custDateType, setCustDateType, custDate, setCustDate, custDepositAmount, setCustDepositAmount, custContractAmount, setCustContractAmount, custContractMonths, setCustContractMonths, custCommission, setCustCommission, handleAddCustomer, handleExportExcel, editingCustomerId, editCustomerData, setEditCustomerData, startEditCustomer, cancelEditCustomer, saveEditCustomer, handleDeleteCustomer, toggleCustomerReceived, handleApproveCustomer, user }: Props) {
  // UI split into smaller components: AddCustomerForm and CustomersTable

  return (
    <div className="bg-white border rounded p-4">
      <AddCustomerForm
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
        custContractMonths={custContractMonths}
        setCustContractMonths={setCustContractMonths}
        custCommission={custCommission}
        setCustCommission={setCustCommission}
        handleAddCustomer={handleAddCustomer}
      />

      <div className="flex justify-end mb-2">
        {canExport(user) ? (
          <button type="button" onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Xuất Excel</button>
        ) : null}
      </div>

      <CustomersTable
        customers={customers}
        editingCustomerId={editingCustomerId}
        editCustomerData={editCustomerData}
        setEditCustomerData={setEditCustomerData}
        startEditCustomer={startEditCustomer}
        cancelEditCustomer={cancelEditCustomer}
        saveEditCustomer={saveEditCustomer}
        handleDeleteCustomer={handleDeleteCustomer}
        toggleCustomerReceived={toggleCustomerReceived}
        handleApproveCustomer={handleApproveCustomer}
        user={user}
      />
    </div>
  );
}
