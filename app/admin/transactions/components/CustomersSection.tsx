"use client"

import React from "react";
import type { Customer } from "../../../../lib/mockService";
import { formatNumberVN } from "../../../../lib/format";

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
  user?: any;
};

export default function CustomersSection({ customers, custName, setCustName, custPhone, setCustPhone, custDateType, setCustDateType, custDate, setCustDate, custDepositAmount, setCustDepositAmount, custContractAmount, setCustContractAmount, custCommission, setCustCommission, handleAddCustomer, handleExportExcel, editingCustomerId, editCustomerData, setEditCustomerData, startEditCustomer, cancelEditCustomer, saveEditCustomer, handleDeleteCustomer, toggleCustomerReceived, user }: Props) {
  const [depositFocused, setDepositFocused] = React.useState(false);
  const [contractFocused, setContractFocused] = React.useState(false);
  const [editDepositFocused, setEditDepositFocused] = React.useState(false);
  const [editContractFocused, setEditContractFocused] = React.useState(false);
  const depositRef = React.useRef<HTMLInputElement | null>(null);
  const contractRef = React.useRef<HTMLInputElement | null>(null);
  const editDepositRef = React.useRef<HTMLInputElement | null>(null);
  const editContractRef = React.useRef<HTMLInputElement | null>(null);

  function findCaretPos(formatted: string, digitsBefore: number) {
    if (!formatted) return 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/[0-9]/.test(formatted[i])) count++;
      if (count === digitsBefore) return i + 1;
    }
    return formatted.length;
  }

  const handleLiveChange = (rawSetter: (v: string) => void, ref: React.RefObject<HTMLInputElement> | null, valueStr: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    const sel = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
    const raw = String(el.value).replace(/[^0-9]/g, '');
    rawSetter(raw);
    const digitsBefore = (el.value.slice(0, sel).match(/\d/g) || []).length;
    const formatted = raw ? formatNumberVN(Number(raw)) : '';
    // schedule caret restore after render
    setTimeout(() => {
      try {
        const pos = findCaretPos(formatted, digitsBefore);
        if (ref && ref.current) ref.current.setSelectionRange(pos, pos);
      } catch (err) {}
    }, 0);
  } 

  // Preview tiền hoa hồng trong form (tính từ tiền cọc / hợp đồng và % hoa hồng)
  const previewAmount = custDateType === 'deposit' ? Number(custDepositAmount || 0) : Number(custContractAmount || 0);
  const previewCommissionPct = custCommission === '' ? NaN : Number(custCommission);
  const previewCommissionMoney = (isFinite(previewAmount) && isFinite(previewCommissionPct) && previewAmount > 0 && !isNaN(previewCommissionPct))
    ? `${Math.round(previewAmount * (previewCommissionPct / 100)).toLocaleString('vi-VN')} ₫`
    : null;

  // Khi chỉnh sửa 1 khách hàng: preview tiền hoa hồng từ editCustomerData
  const editBaseAmount = Number(editCustomerData.contractAmount ?? editCustomerData.depositAmount ?? NaN);
  const editPct = (editCustomerData.commission == null) ? NaN : Number(editCustomerData.commission);
  const editPreviewCommissionMoney = (isFinite(editBaseAmount) && isFinite(editPct) && editBaseAmount > 0 && !isNaN(editPct))
    ? `${Math.round(editBaseAmount * (editPct / 100)).toLocaleString('vi-VN')} ₫`
    : null;

  return (
    <div className="bg-white border rounded p-4">
      <h3 className="font-semibold mb-3">Thêm khách hàng</h3>
      {/* Form thêm khách hàng: nhập tên, số điện thoại, ngày (cọc/hd), số tiền và hoa hồng */}
      <form onSubmit={handleAddCustomer} className="flex flex-wrap gap-2 mb-4">
        <input type="text" className="border rounded px-3 py-2 flex-1" placeholder="Tên khách hàng" value={custName} onChange={(e) => setCustName(e.target.value)} />
        <input type="text" className="border rounded px-3 py-2" placeholder="SĐT" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
        <select className="border rounded px-3 py-2" value={custDateType} onChange={(e) => setCustDateType(e.target.value as any)}>
          <option value="deposit">Ngày Cọc</option>
          <option value="contract">Ngày ký hợp đồng</option>
        </select>
        <input type="date" className="border rounded px-3 py-2" value={custDate} onChange={(e) => setCustDate(e.target.value)} />
        {custDateType === 'deposit' && (
          <>
            <input
              ref={depositRef}
              type="text"
              inputMode="numeric"
              className="border rounded px-3 py-2"
              placeholder="Tiền cọc (VND)"
              value={depositFocused ? custDepositAmount : (custDepositAmount ? formatNumberVN(Number(custDepositAmount)) : '')}
              onFocus={() => setDepositFocused(true)}
              onBlur={() => setDepositFocused(false)}
              onChange={(e) => handleLiveChange(setCustDepositAmount, depositRef, custDepositAmount, e)}
            />
            <input type="number" min={0} max={100} step={0.01} className="border rounded px-3 py-2" placeholder="Hoa hồng (%)" value={custCommission} onChange={(e) => setCustCommission(e.target.value)} />
            {previewCommissionMoney ? <div className="w-full text-sm text-gray-600 mt-1">Dự kiến tiền hoa hồng: {previewCommissionMoney}</div> : null}
          </>
        )}
        {custDateType === 'contract' && (
          <>
            <input
              ref={contractRef}
              type="text"
              inputMode="numeric"
              className="border rounded px-3 py-2"
              placeholder="Tiền hợp đồng (VND)"
              value={contractFocused ? custContractAmount : (custContractAmount ? formatNumberVN(Number(custContractAmount)) : '')}
              onFocus={() => setContractFocused(true)}
              onBlur={() => setContractFocused(false)}
              onChange={(e) => handleLiveChange(setCustContractAmount, contractRef, custContractAmount, e)}
            />
            <input type="number" min={0} max={100} step={0.01} className="border rounded px-3 py-2" placeholder="Hoa hồng (%)" value={custCommission} onChange={(e) => setCustCommission(e.target.value)} />
            {previewCommissionMoney ? <div className="w-full text-sm text-gray-600 mt-1">Dự kiến tiền hoa hồng: {previewCommissionMoney}</div> : null}
          </>
        )}
        <button className="bg-slate-800 text-white px-4 py-2 rounded">Thêm</button>
      </form>

      <div className="flex justify-end mb-2">
        {/* Nút Xuất Excel: xuất toàn bộ danh sách khách hàng hiện tại */}
        <button type="button" onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Xuất Excel</button>
      </div>
      {/* Danh sách khách hàng: hiển thị bảng, cho phép sửa/xóa/đánh dấu đã thu */}
      <div className="bg-white border rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <colgroup>
              <col style={{ width: 220 }} />
              <col style={{ width: 140 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 140 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Tên</th>
                <th className="text-left p-3">SĐT</th>
                <th className="text-left p-3">Ngày</th>
                <th className="text-left p-3">Tiền cọc</th>
                <th className="text-left p-3">Tiền hợp đồng</th>
                <th className="text-left p-3">Tiền hoa hồng</th>
                <th className="text-left p-3">Hoa hồng</th>
                <th className="text-left p-3">Ngày giờ</th>
                <th className="text-left p-3">Thực hiện</th>
                {/* Cột Hành động: Sửa / Xóa (chỉ admin có quyền xóa) */}
                <th className="p-3" style={{ width: 160 }}>Hành động</th>
                {/* Cột Đã thu: checkbox để ghi nhận khách đã thu */}
                <th className="p-3">Đã thu</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={`${String(c.id ?? '')}-${i}`} className="border-t">
                  {/* Nếu đang ở trạng thái sửa: hiển thị row editable */}
                  {String(c.id) === editingCustomerId ? (
                    <>
                      <td className="p-3"><input className="border px-2 py-1 w-48" value={String(editCustomerData.name ?? '')} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), name: e.target.value }))} /></td>
                      <td className="p-3"><input className="border px-2 py-1 w-40" value={String(editCustomerData.phone ?? '')} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), phone: e.target.value }))} /></td>
                      <td className="p-3"><input type="date" className="border px-2 py-1 w-40" value={editCustomerData.depositDate ? new Date(editCustomerData.depositDate).toISOString().slice(0,10) : (editCustomerData.contractDate ? new Date(editCustomerData.contractDate).toISOString().slice(0,10) : '')} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), depositDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))} /></td>
                      <td className="p-3">
                        <input
                          ref={editDepositRef}
                          type="text"
                          inputMode="numeric"
                          className="border px-2 py-1 w-32"
                          placeholder="Tiền cọc (VND)"
                          value={editDepositFocused ? (editCustomerData.depositAmount != null ? String(editCustomerData.depositAmount) : '') : (editCustomerData.depositAmount != null ? formatNumberVN(editCustomerData.depositAmount) : '')}
                          onFocus={() => setEditDepositFocused(true)}
                          onBlur={() => setEditDepositFocused(false)}
                          onChange={(e) => {
                            // use live change with caret preservation
                            const el = e.target as HTMLInputElement;
                            const sel = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
                            const raw = String(el.value).replace(/[^0-9]/g, '');
                            setEditCustomerData((p) => ({ ...(p || {}), depositAmount: raw === '' ? undefined : Number(raw) }));
                            const digitsBefore = (el.value.slice(0, sel).match(/\d/g) || []).length;
                            const formatted = raw ? formatNumberVN(Number(raw)) : '';
                            setTimeout(() => {
                              try {
                                const pos = findCaretPos(formatted, digitsBefore);
                                if (editDepositRef.current) editDepositRef.current.setSelectionRange(pos, pos);
                              } catch (err) {}
                            }, 0);
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          ref={editContractRef}
                          type="text"
                          inputMode="numeric"
                          className="border px-2 py-1 w-32"
                          placeholder="Tiền hợp đồng (VND)"
                          value={editContractFocused ? (editCustomerData.contractAmount != null ? String(editCustomerData.contractAmount) : '') : (editCustomerData.contractAmount != null ? formatNumberVN(editCustomerData.contractAmount) : '')}
                          onFocus={() => setEditContractFocused(true)}
                          onBlur={() => setEditContractFocused(false)}
                          onChange={(e) => {
                            const el = e.target as HTMLInputElement;
                            const sel = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
                            const raw = String(el.value).replace(/[^0-9]/g, '');
                            setEditCustomerData((p) => ({ ...(p || {}), contractAmount: raw === '' ? undefined : Number(raw) }));
                            const digitsBefore = (el.value.slice(0, sel).match(/\d/g) || []).length;
                            const formatted = raw ? formatNumberVN(Number(raw)) : '';
                            setTimeout(() => {
                              try {
                                const pos = findCaretPos(formatted, digitsBefore);
                                if (editContractRef.current) editContractRef.current.setSelectionRange(pos, pos);
                              } catch (err) {}
                            }, 0);
                          }}
                        />
                      </td>
                      <td className="p-3 whitespace-normal break-words">{(editCustomerData.commission != null && ((editCustomerData.contractAmount ?? editCustomerData.depositAmount) != null)) ? `${Math.round((Number(editCustomerData.contractAmount ?? editCustomerData.depositAmount) * (Number(editCustomerData.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : ((c.commission != null && (c.contractAmount ?? c.depositAmount) != null) ? `${Math.round((Number(c.contractAmount ?? c.depositAmount) * (Number(c.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : '-')}</td>
                      <td className="p-3"><input type="number" min={0} max={100} step={0.01} className="border px-2 py-1 w-32" placeholder="Hoa hồng (%)" value={editCustomerData.commission ?? ''} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), commission: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                        {editPreviewCommissionMoney ? <div className="text-sm text-gray-600 mt-1">Dự kiến: {editPreviewCommissionMoney}</div> : null}
                      </td>
                      <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                      <td className="p-3">{c.performedBy ?? '-'}</td>
                      <td className="p-3 text-center">
                        <button className="text-green-600 mr-2" onClick={saveEditCustomer}>Lưu</button>
                        <button className="text-gray-600" onClick={cancelEditCustomer}>Hủy</button>
                      </td>
                      {/* Checkbox 'Đã thu' khi đang sửa: lưu vào editCustomerData (chưa gửi server) */}
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={Boolean(editCustomerData.received ?? c.received)} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), received: e.target.checked }))} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 whitespace-normal break-words">{c.name}</td>
                      <td className="p-3 whitespace-normal break-words">{c.phone ?? "-"}</td>
                      <td className="p-3 whitespace-normal break-words">{(c.depositDate ? new Date(String(c.depositDate)) : c.contractDate ? new Date(String(c.contractDate)) : null) ? ((c.depositDate ? new Date(String(c.depositDate)) : new Date(String(c.contractDate))).toLocaleDateString()) : "-"}</td>
                      <td className="p-3 whitespace-normal break-words">{c.depositAmount != null ? `${c.depositAmount.toLocaleString('vi-VN')} ₫` : '-'}</td>
                      <td className="p-3 whitespace-normal break-words">{c.contractAmount != null ? `${c.contractAmount.toLocaleString('vi-VN')} ₫` : '-'}</td>
                      <td className="p-3 whitespace-normal break-words">{(c.commission != null && (c.contractAmount ?? c.depositAmount) != null) ? `${Math.round((Number(c.contractAmount ?? c.depositAmount) * (Number(c.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : '-'}</td>
                      <td className="p-3 whitespace-normal break-words">{c.commission != null ? `${c.commission}%` : '-'}</td>
                      <td className="p-3 whitespace-normal break-words">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                      <td className="p-3 whitespace-normal break-words">{c.performedBy ?? "-"}</td>
                      {/* Hành động: Sửa (bật form chỉnh sửa trên hàng), Xóa (chỉ admin) */}
                      <td className="p-3 text-center">
                        <button className="text-blue-600 mr-2" onClick={() => startEditCustomer(c)}>Sửa</button>
                        {user?.role !== 'user' ? <button className="text-red-600" onClick={() => handleDeleteCustomer(c.id)}>Xóa</button> : null}
                      </td>
                      {/* Checkbox 'Đã thu' trực tiếp: gọi toggleCustomerReceived để cập nhật */}
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={Boolean(c.received)} onChange={(e) => toggleCustomerReceived(c.id, e.target.checked)} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
