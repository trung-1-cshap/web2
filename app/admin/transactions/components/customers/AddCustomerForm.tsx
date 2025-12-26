"use client"

import React from "react";
import MoneyInput from "./MoneyInput";
import { formatNumberVN } from "../../../../../lib/format";

type Props = {
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
  handleAddCustomer: (e: React.FormEvent) => void;
};

export default function AddCustomerForm(props: Props) {
  const { custName, setCustName, custPhone, setCustPhone, custDateType, setCustDateType, custDate, setCustDate, custDepositAmount, setCustDepositAmount, custContractAmount, setCustContractAmount, custContractMonths, setCustContractMonths, custCommission, setCustCommission, handleAddCustomer } = props;

  const [nameError, setNameError] = React.useState<string | null>(null);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [dateError, setDateError] = React.useState<string | null>(null);

  const previewAmount = custDateType === 'deposit' ? Number(custDepositAmount || 0) : Number(custContractAmount || 0);
  const previewCommissionPct = custCommission === '' ? NaN : Number(custCommission);
  const previewCommissionMoney = (isFinite(previewAmount) && isFinite(previewCommissionPct) && previewAmount > 0 && !isNaN(previewCommissionPct))
    ? `${Math.round(previewAmount * (previewCommissionPct / 100)).toLocaleString('vi-VN')} ₫`
    : null;

  return (
    <>
      <h3 className="font-semibold mb-3">Thêm khách hàng</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!custName || nameError) { setNameError(nameError ?? 'Tên không hợp lệ'); return; }
        if (custPhone && phoneError) { setPhoneError(phoneError ?? 'Số điện thoại không hợp lệ'); return; }
        handleAddCustomer(e);
      }} className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1">
          <input type="text" className="border rounded px-3 py-2 w-full" placeholder="Tên khách hàng" value={custName} onChange={(e) => {
            const v = e.target.value;
            const valid = /^[\p{L}\p{M}\s'.-]*$/u.test(v);
            if (!valid) setNameError('Tên không được chứa ký tự đặc biệt'); else setNameError(null);
            setCustName(v);
          }} />
          {nameError ? <div className="text-red-600 text-sm mt-1">{nameError}</div> : null}
        </div>
        <div>
          <input type="text" className="border rounded px-3 py-2" placeholder="SĐT" value={custPhone} onChange={(e) => {
            const v = e.target.value;
            const hasNonDigit = /\D/.test(v);
            if (hasNonDigit) setPhoneError('Số điện thoại chỉ được nhập chữ số'); else setPhoneError(null);
            setCustPhone(v.replace(/\D/g, ''));
          }} />
          {phoneError ? <div className="text-red-600 text-sm mt-1">{phoneError}</div> : null}
        </div>
        <select className="border rounded px-3 py-2" value={custDateType} onChange={(e) => setCustDateType(e.target.value as any)}>
          <option value="deposit">Ngày Cọc</option>
          <option value="contract">Ngày ký hợp đồng</option>
        </select>
        <input type="date" className="border rounded px-3 py-2" value={custDate} onChange={(e) => {
          const v = e.target.value;
          if (v) {
            const y = new Date(v).getFullYear();
            if (isFinite(y) && y > 3000) {
              setDateError('Năm không được lớn hơn 3000');
            } else {
              setDateError(null);
            }
          } else {
            setDateError(null);
          }
          setCustDate(v);
        }} />
        {dateError ? <div className="text-red-600 text-sm mt-1">{dateError}</div> : null}

        {custDateType === 'deposit' && (
          <>
            <MoneyInput className="border rounded px-3 py-2" placeholder="Tiền cọc (VND)" value={custDepositAmount} onChange={setCustDepositAmount} />
            <input type="number" min={0} max={100} step={0.01} className="border rounded px-3 py-2" placeholder="Hoa hồng (%)" value={custCommission} onChange={(e) => setCustCommission(e.target.value)} />
            {previewCommissionMoney ? <div className="w-full text-sm text-gray-600 mt-1">Dự kiến tiền hoa hồng: {previewCommissionMoney}</div> : null}
          </>
        )}

        {custDateType === 'contract' && (
          <>
            <MoneyInput className="border rounded px-3 py-2" placeholder="Tiền hợp đồng (VND)" value={custContractAmount} onChange={setCustContractAmount} />
            <input type="number" min={0} className="border rounded px-3 py-2 w-28" placeholder="Số tháng" value={(typeof (custContractMonths) === 'string') ? custContractMonths : ''} onChange={(e) => setCustContractMonths(e.target.value)} />
            <input type="number" min={0} max={100} step={0.01} className="border rounded px-3 py-2" placeholder="Hoa hồng (%)" value={custCommission} onChange={(e) => setCustCommission(e.target.value)} />
            {previewCommissionMoney ? <div className="w-full text-sm text-gray-600 mt-1">Dự kiến tiền hoa hồng: {previewCommissionMoney}</div> : null}
          </>
        )}
        <button className="bg-slate-800 text-white px-4 py-2 rounded">Thêm</button>
      </form>
    </>
  );
}
