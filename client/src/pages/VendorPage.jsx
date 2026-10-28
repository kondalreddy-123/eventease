import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import TiltCard from '../components/TiltCard';
import {
  Users,
  Plus,
  Phone,
  Mail,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2,
  Trash2,
  Scale,
  Sparkles,
  Info,
  X,
  Building,
  Utensils,
  Camera,
  Music,
  Palette,
  Truck,
  HeartHandshake
} from 'lucide-react';

const VENDOR_CATEGORIES = [
  'Venues',
  'Caterers',
  'Decorators',
  'Photographers',
  'DJs and entertainers',
  'Florists',
  'Invitation designers',
  'Transportation'
];

export default function VendorPage({ setActivePage }) {
  const { currentEvent, vendors, addVendor, updateVendor, deleteVendor } = useEvents();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(VENDOR_CATEGORIES[0]);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [bookingStatus, setBookingStatus] = useState('Inquiry');
  const [rating, setRating] = useState('4.8');
  const [services, setServices] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentEvent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No Event Selected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please choose an event to manage its vendors and quotations.</p>
        <button
          onClick={() => setActivePage('create-event')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Create Event
        </button>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingVendor(null);
    setName('');
    setCategory(VENDOR_CATEGORIES[0]);
    setContactPerson('');
    setPhone('');
    setEmail('');
    setQuotedPrice('');
    setAgreedPrice('');
    setPaymentStatus('Unpaid');
    setBookingStatus('Inquiry');
    setRating('4.8');
    setServices('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (ven) => {
    setEditingVendor(ven);
    setName(ven.name);
    setCategory(ven.category);
    setContactPerson(ven.contactPerson || '');
    setPhone(ven.phone || '');
    setEmail(ven.email || '');
    setQuotedPrice(ven.quotedPrice);
    setAgreedPrice(ven.agreedPrice || 0);
    setPaymentStatus(ven.paymentStatus || 'Unpaid');
    setBookingStatus(ven.bookingStatus || 'Inquiry');
    setRating(ven.rating || 4.5);
    setServices(ven.services || '');
    setNotes(ven.notes || '');
    setModalOpen(true);
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    if (!name || !category) return;

    const payload = {
      name,
      category,
      contactPerson,
      phone,
      email,
      quotedPrice: Number(quotedPrice) || 0,
      agreedPrice: Number(agreedPrice) || 0,
      paymentStatus,
      bookingStatus,
      rating: Number(rating) || 4.5,
      services,
      notes
    };

    if (editingVendor) {
      await updateVendor(editingVendor.id, payload);
    } else {
      await addVendor(payload);
    }
    setModalOpen(false);
  };

  const filteredVendors = vendors.filter(v => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Partner Directory & Contracts
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Vendor Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Compare vendor quotations, track booking statuses, and manage contracts and advance payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {vendors.length > 1 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-2 transition-all hover:scale-102"
            >
              <Scale className="w-4 h-4" /> Compare Quotes
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Transparency Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-amber-500" />
        <span>
          <strong>Sample Data Notice:</strong> In compliance with quality standards, entries marked with <span className="bg-amber-500/20 px-1 py-0.5 rounded text-[10px] font-bold">Sample / AI Suggestion</span> represent benchmark estimates rather than live vendor commitments. Always contact businesses directly to confirm dates and contracts.
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400'
          }`}
        >
          All Categories ({vendors.length})
        </button>
        {VENDOR_CATEGORIES.map(cat => {
          const count = vendors.filter(v => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No vendors registered in this category. Click "+ Add Vendor" to add your shortlisted businesses.
          </div>
        ) : (
          filteredVendors.map(ven => (
            <TiltCard
              key={ven.id}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {ven.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {ven.name}
                    </h3>
                  </div>

                  {ven.isSample && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      Sample Data
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span>{ven.rating || 4.8}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    ven.bookingStatus === 'Booked'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : (ven.bookingStatus === 'Declined' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600')
                  }`}>
                    {ven.bookingStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {ven.services || 'Full package event services'}
                </p>

                {/* Price tags */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Quoted Price</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{Number(ven.quotedPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {ven.agreedPrice > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">Agreed</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(ven.agreedPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  {ven.contactPerson && (
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      POC: {ven.contactPerson}
                    </p>
                  )}
                  {ven.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-purple-500" /> {ven.phone}
                    </p>
                  )}
                  {ven.email && (
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-purple-500" /> {ven.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  ven.paymentStatus === 'Paid'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : (ven.paymentStatus === 'Partial' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                }`}>
                  Payment: {ven.paymentStatus}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(ven)}
                    aria-label={`Edit vendor: ${ven.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Vendor"
                  >
                    <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => deleteVendor(ven.id)}
                    aria-label={`Remove vendor: ${ven.name}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remove Vendor"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </TiltCard>
          ))
        )}
      </div>

      {/* Vendor Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                Side-by-Side Vendor Comparison
              </h3>
              <button
                onClick={() => setCompareModalOpen(false)}
                aria-label="Close comparison modal"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none rounded-lg p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Quoted Price</th>
                    <th className="py-2.5 px-3">Agreed Price</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-purple-50/20 dark:hover:bg-purple-950/20">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{v.name}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{v.category}</td>
                      <td className="py-3 px-3 font-bold text-amber-500">⭐ {v.rating || 4.8}</td>
                      <td className="py-3 px-3 font-semibold text-purple-600 dark:text-purple-400">
                        ₹{Number(v.quotedPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        ₹{Number(v.agreedPrice || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800">
                          {v.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs">{v.services}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close vendor details modal"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none rounded-lg p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Rajputana Catering Co."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {VENDOR_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Booking Status
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Booked">Booked</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Chef Manvendra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quoted Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Agreed Final Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Services Provided
                </label>
                <textarea
                  rows={2}
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g. 3-day multi-cuisine catering, live chaat stalls, waitstaff"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
