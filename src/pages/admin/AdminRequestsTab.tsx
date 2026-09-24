import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import {
  Wrench,
  FileText,
  UserCheck,
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  AlertTriangle,
  X,
  Eye,
  Trash2
} from 'lucide-react';

export const AdminRequestsTab: React.FC = () => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'maintenance' | 'quotes' | 'technician' | 'messages'>('maintenance');

  const [maintenanceList, setMaintenanceList] = useState<any[]>([]);
  const [quoteList, setQuoteList] = useState<any[]>([]);
  const [technicianList, setTechnicianList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      api.getMaintenanceRequestsAdmin(),
      api.getQuoteRequestsAdmin(),
      api.getTechnicianRequestsAdmin(),
      api.getContactMessagesAdmin()
    ]).then(([mList, qList, tList, cList]) => {
      setMaintenanceList(mList);
      setQuoteList(qList);
      setTechnicianList(tList);
      setMessagesList(cList);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleUpdateStatus = async (type: 'maintenance' | 'quote' | 'technician', id: string, status: any) => {
    try {
      if (type === 'maintenance') {
        await api.updateMaintenanceRequestAdmin(id, { status });
      } else if (type === 'quote') {
        await api.updateQuoteRequestAdmin(id, { status });
      } else if (type === 'technician') {
        await api.updateTechnicianRequestAdmin(id, { status });
      }
      loadAll();
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">قيد الانتظار</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">جاري المتابعة</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">مكتمل</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">ملغي</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('إدارة طلبات ومراسلات العملاء', 'Customer Inquiries & Requests')}</h2>
        <p className="text-xs text-slate-500">{t('متابعة طلبات الصيانة، عروض الأسعار، طلبات زيارة الفني، والرسائل الواردة', 'Monitor maintenance tickets, quotes, technician visits, and contact forms')}</p>
      </div>

      {/* Sub-tabs buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('maintenance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'maintenance'
              ? 'bg-[#0B192C] text-white shadow'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>{t('طلبات الصيانة', 'Maintenance Requests')} ({maintenanceList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'quotes'
              ? 'bg-[#0B192C] text-white shadow'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>{t('عروض الأسعار', 'Quote Requests')} ({quoteList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('technician')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'technician'
              ? 'bg-[#0B192C] text-white shadow'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>{t('حجوزات الفنيين', 'Technician Bookings')} ({technicianList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'messages'
              ? 'bg-[#0B192C] text-white shadow'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>{t('رسائل الموقع', 'Contact Messages')} ({messagesList.length})</span>
        </button>
      </div>

      {/* Content depending on subTab */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">{t('جاري التحميل...', 'Loading...')}</div>
      ) : subTab === 'maintenance' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">رقم الطلب</th>
                  <th className="py-3 px-4 text-start">اسم العميل والمنشأة</th>
                  <th className="py-3 px-4 text-start">الهاتف</th>
                  <th className="py-3 px-4 text-start">المحافظة</th>
                  <th className="py-3 px-4 text-start">الخدمة</th>
                  <th className="py-3 px-4 text-center">الأولوية</th>
                  <th className="py-3 px-4 text-center">الحالة</th>
                  <th className="py-3 px-4 text-end">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenanceList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#C87D55]">{item.requestNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.clientName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${item.phone}`} className="hover:text-[#C87D55]">{item.phone}</a>
                        <a
                          href={`https://wa.me/967${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `مرحباً ${item.clientName}، نتواصل معك من شركة العريقي إنفركول بخصوص طلب الصيانة رقم ${item.requestNumber}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                          title="محادثة واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.governate}</td>
                    <td className="py-3 px-4">{item.serviceType}</td>
                    <td className="py-3 px-4 text-center">
                      {item.priority === 'emergency' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          طوارئ
                        </span>
                      ) : item.priority === 'urgent' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          عاجل
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                          عادي
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">{statusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-end">
                      <button
                        onClick={() => setSelectedItem({ ...item, itemType: 'maintenance' })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition font-bold text-[11px]"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : subTab === 'quotes' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">رقم العرض</th>
                  <th className="py-3 px-4 text-start">اسم العميل / الشركة</th>
                  <th className="py-3 px-4 text-start">الهاتف</th>
                  <th className="py-3 px-4 text-start">المحافظة</th>
                  <th className="py-3 px-4 text-start">نوع المشروع</th>
                  <th className="py-3 px-4 text-start">المنظومة المطلوبة</th>
                  <th className="py-3 px-4 text-center">الحالة</th>
                  <th className="py-3 px-4 text-end">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quoteList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#C87D55]">{item.requestNumber}</td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{item.clientName}</strong>
                      {item.companyName && <span className="text-[10px] text-slate-400">{item.companyName}</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${item.phone}`} className="hover:text-[#C87D55]">{item.phone}</a>
                        <a
                          href={`https://wa.me/967${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `مرحباً ${item.clientName}، نتواصل معك من العريقي إنفركول بخصوص دراسة وتسعير مشروعكم رقم ${item.requestNumber}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.governate}</td>
                    <td className="py-3 px-4">{item.projectType}</td>
                    <td className="py-3 px-4">{item.requiredSystem}</td>
                    <td className="py-3 px-4 text-center">{statusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-end">
                      <button
                        onClick={() => setSelectedItem({ ...item, itemType: 'quote' })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition font-bold text-[11px]"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : subTab === 'technician' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">رقم الحجز</th>
                  <th className="py-3 px-4 text-start">العميل</th>
                  <th className="py-3 px-4 text-start">الهاتف</th>
                  <th className="py-3 px-4 text-start">المحافظة والمنطقة</th>
                  <th className="py-3 px-4 text-start">العطل</th>
                  <th className="py-3 px-4 text-start">الموعد المفضل</th>
                  <th className="py-3 px-4 text-center">الحالة</th>
                  <th className="py-3 px-4 text-end">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {technicianList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#C87D55]">{item.requestNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.clientName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${item.phone}`} className="hover:text-[#C87D55]">{item.phone}</a>
                        <a
                          href={`https://wa.me/967${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `مرحباً ${item.clientName}، نتواصل معك من العريقي إنفركول بخصوص موعد زيارة الفني رقم ${item.requestNumber}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.governate} - {item.city}</td>
                    <td className="py-3 px-4">{item.malfunctionType}</td>
                    <td className="py-3 px-4">{item.preferredVisitTime}</td>
                    <td className="py-3 px-4 text-center">{statusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-end">
                      <button
                        onClick={() => setSelectedItem({ ...item, itemType: 'technician' })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-white text-slate-700 transition font-bold text-[11px]"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messagesList.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 text-sm">{msg.name}</strong>
                <span className="text-[11px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString('ar-YE')}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">{msg.phone}</a>
                {msg.email && <span>• {msg.email}</span>}
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                {msg.message}
              </p>

              <div className="pt-2 flex items-center justify-end gap-2">
                <a
                  href={`https://wa.me/967${msg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `مرحباً ${msg.name}، نتواصل معك بخصوص رسالتك لشركة العريقي إنفركول`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>رد عبر واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#C87D55] uppercase">تفاصيل الطلب الرسمي</span>
                <h3 className="text-lg font-black text-slate-900 font-mono">{selectedItem.requestNumber}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status changer toolbar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">تحديث حالة الطلب:</span>
                <select
                  value={selectedItem.status}
                  onChange={(e) => handleUpdateStatus(selectedItem.itemType, selectedItem.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-xs focus:outline-none focus:border-[#C87D55]"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="in_progress">جاري المتابعة والتنفيذ</option>
                  <option value="completed">مكتمل ومغلق</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/967${selectedItem.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `مرحباً ${selectedItem.clientName}، بخصوص طلبك رقم ${selectedItem.requestNumber} لدى العريقي إنفركول`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محادثة واتساب</span>
                </a>
                <a
                  href={`tel:${selectedItem.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0B192C] text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-4 h-4 text-[#C87D55]" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>

            {/* Info fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">اسم العميل / الجهة:</span>
                <strong className="text-slate-900 text-sm">{selectedItem.clientName}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">رقم الهاتف:</span>
                <strong className="text-slate-900 font-mono text-sm">{selectedItem.phone}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">المحافظة / المدينة:</span>
                <strong className="text-slate-900">{selectedItem.governate} - {selectedItem.city}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">تاريخ التسجيل:</span>
                <span className="text-slate-700 font-mono">{new Date(selectedItem.createdAt).toLocaleString('ar-YE')}</span>
              </div>
            </div>

            {/* Problem / Details text */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 block">نص المشكلة أو متطلبات المشروع:</span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed text-sm">
                {selectedItem.problemDesc || selectedItem.projectDesc || 'لا يوجد وصف إضافي'}
              </div>
            </div>

            {/* Images if any */}
            {selectedItem.images && selectedItem.images.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">الصور المرفقة مع الطلب:</span>
                <div className="flex flex-wrap gap-3">
                  {selectedItem.images.map((img: string, i: number) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 block">
                      <img src={img} alt={`attach-${i}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-[#0B192C] text-white text-xs font-bold"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
