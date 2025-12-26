"use client"

import React from "react";
import MoneyInput from "./MoneyInput";
import { formatNumberVN } from "../../../../../lib/format";
import type { Customer } from "../../../../../lib/mockService";
import { canSoftDelete, canApproveTransaction } from "../../../../../lib/permissions";

type Props = {
  customers: Customer[];
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

export default function CustomersTable(props: Props) {
  const { customers, editingCustomerId, editCustomerData, setEditCustomerData, startEditCustomer, cancelEditCustomer, saveEditCustomer, handleDeleteCustomer, toggleCustomerReceived, handleApproveCustomer, user } = props;

  const editBaseAmount = Number(editCustomerData.contractAmount ?? editCustomerData.depositAmount ?? NaN);
  const editPct = (editCustomerData.commission == null) ? NaN : Number(editCustomerData.commission);
  const editPreviewCommissionMoney = (isFinite(editBaseAmount) && isFinite(editPct) && editBaseAmount > 0 && !isNaN(editPct))
    ? `${Math.round(editBaseAmount * (editPct / 100)).toLocaleString('vi-VN')} ₫`
    : null;

  return (
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
              <th className="text-left p-3">Thời hạn</th>
              <th className="text-left p-3">Tiền hoa hồng</th>
              <th className="text-left p-3">Hoa hồng</th>
              <th className="text-left p-3">Ngày giờ</th>
              <th className="text-left p-3">Thực hiện</th>
              <th className="p-3" style={{ width: 160 }}>Hành động</th>
              <th className="p-3">Đã thu</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={`${String(c.id ?? '')}-${i}`} className="border-t">
                {String(c.id) === editingCustomerId ? (
                  <>
                    <td className="p-3">
                      <div>
                        <input className="border px-2 py-1 w-48" value={String(editCustomerData.name ?? '')} onChange={(e) => {
                          const v = e.target.value;
                          const valid = /^[\p{L}\p{M}\s'.-]*$/u.test(v);
                          if (!valid) setEditCustomerData((p) => ({ ...(p || {}), _nameError: 'Tên không được chứa ký tự đặc biệt' })); else setEditCustomerData((p) => ({ ...(p || {}), _nameError: undefined }));
                          setEditCustomerData((p) => ({ ...(p || {}), name: v }));
                        }} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <input className="border px-2 py-1 w-40" value={String(editCustomerData.phone ?? '')} onChange={(e) => {
                          const v = e.target.value;
                          const hasNonDigit = /\D/.test(v);
                          if (hasNonDigit) setEditCustomerData((p) => ({ ...(p || {}), _phoneError: 'Số điện thoại chỉ được nhập chữ số' })); else setEditCustomerData((p) => ({ ...(p || {}), _phoneError: undefined }));
                          setEditCustomerData((p) => ({ ...(p || {}), phone: String(v).replace(/\D/g, '') }));
                        }} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="flex gap-2 items-center">
                          <input type="date" className="border px-2 py-1 w-40" value={editCustomerData.depositDate ? new Date(editCustomerData.depositDate).toISOString().slice(0,10) : (editCustomerData.contractDate ? new Date(editCustomerData.contractDate).toISOString().slice(0,10) : '')} onChange={(e) => {
                            const v = e.target.value;
                            const prevIso = String(editCustomerData.depositDate ?? editCustomerData.contractDate ?? '');
                            if (v) {
                              const y = new Date(v).getFullYear();
                              if (isFinite(y) && y > 3000) setEditCustomerData((p) => ({ ...(p || {}), _dateError: 'Năm không được lớn hơn 3000' })); else setEditCustomerData((p) => ({ ...(p || {}), _dateError: undefined }));
                            } else setEditCustomerData((p) => ({ ...(p || {}), _dateError: undefined }));
                            setEditCustomerData((p) => ({ ...(p || {}), depositDate: v ? new Date(v).toISOString() : '' }));
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <MoneyInput className="border px-2 py-1 w-32" placeholder="Tiền cọc (VND)" value={editCustomerData.depositAmount ?? ''} onChange={(raw) => setEditCustomerData((p) => ({ ...(p || {}), depositAmount: raw === '' ? undefined : Number(raw) }))} />
                    </td>
                    <td className="p-3">
                      <MoneyInput className="border px-2 py-1 w-32" placeholder="Tiền hợp đồng (VND)" value={editCustomerData.contractAmount ?? ''} onChange={(raw) => setEditCustomerData((p) => ({ ...(p || {}), contractAmount: raw === '' ? undefined : Number(raw) }))} />
                    </td>
                    <td className="p-3">
                      <input type="number" min={0} className="border px-2 py-1 w-24" placeholder="Số tháng" value={(editCustomerData as any).contractValidityMonths ?? ''} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), contractValidityMonths: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                    </td>
                    <td className="p-3 whitespace-normal break-words">{(editCustomerData.commission != null && ((editCustomerData.contractAmount ?? editCustomerData.depositAmount) != null)) ? `${Math.round((Number(editCustomerData.contractAmount ?? editCustomerData.depositAmount) * (Number(editCustomerData.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : ((c.commission != null && (c.contractAmount ?? c.depositAmount) != null) ? `${Math.round((Number(c.contractAmount ?? c.depositAmount) * (Number(c.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : '-')}</td>
                    <td className="p-3"><input type="number" min={0} max={100} step={0.01} className="border px-2 py-1 w-32" placeholder="Hoa hồng (%)" value={editCustomerData.commission ?? ''} onChange={(e) => setEditCustomerData((p) => ({ ...(p || {}), commission: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                      {editPreviewCommissionMoney ? <div className="text-sm text-gray-600 mt-1">Dự kiến: {editPreviewCommissionMoney}</div> : null}
                    </td>
                    <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                    <td className="p-3">{c.performedBy ?? '-'}</td>
                    <td className="p-3 text-center">
                      <button className="text-green-600 mr-2" onClick={() => saveEditCustomer()}>Lưu</button>
                      <button className="text-gray-600" onClick={cancelEditCustomer}>Hủy</button>
                    </td>
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
                    <td className="p-3 whitespace-normal break-words">{c.contractValidityMonths != null ? `${c.contractValidityMonths} tháng` : '-'}</td>
                    <td className="p-3 whitespace-normal break-words">{(c.commission != null && (c.contractAmount ?? c.depositAmount) != null) ? `${Math.round((Number(c.contractAmount ?? c.depositAmount) * (Number(c.commission ?? 0) / 100))).toLocaleString('vi-VN')} ₫` : '-'}</td>
                    <td className="p-3 whitespace-normal break-words">{c.commission != null ? `${c.commission}%` : '-'}</td>
                    <td className="p-3 whitespace-normal break-words">{c.contractDate ? new Date(String(c.contractDate)).toLocaleDateString() : '-'}</td>
                    <td className="p-3 whitespace-normal break-words">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                    <td className="p-3 whitespace-normal break-words">{c.performedBy ?? "-"}</td>
                    <td className="p-3 text-center">
                      <button className="text-blue-600 mr-2" onClick={() => startEditCustomer(c)}>Sửa</button>
                      {canSoftDelete(user) ? <button className="text-red-600" onClick={() => handleDeleteCustomer(c.id)}>Xóa</button> : null}
                      {c.approved ? (
                        <div className="text-sm text-green-700 mt-1">Đã duyệt{c.approvedBy ? ` bởi ${c.approvedBy}` : ''}</div>
                      ) : canApproveTransaction(user) ? (
                        <button className="text-green-700 mt-1" onClick={() => (typeof handleApproveCustomer === 'function') && handleApproveCustomer(String(c.id))}>Duyệt</button>
                      ) : null}
                    </td>
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
  );
}
