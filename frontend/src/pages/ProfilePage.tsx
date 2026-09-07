import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Bell, Shield, CreditCard, Plus, Edit2, Trash2, Ticket, Settings, LogOut, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/helpers';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'passengers', label: 'Saved Passengers', icon: Ticket },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export function ProfilePage() {
  const { user, updateProfile, logout, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<any | null>(null);
  const [deletingPassenger, setDeletingPassenger] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <User className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Please Sign In</h2>
          <p className="text-navy-600 dark:text-navy-400 mb-6">You need to be logged in to access your profile.</p>
          <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
        </Card>
      </div>
    );
  }

  const handleAddPassenger = (data: any) => {
    const newPassenger = { ...data, id: `SP${Date.now()}` };
    updateProfile({ savedPassengers: [...(user?.savedPassengers || []), newPassenger] });
    setShowAddPassenger(false);
  };

  const handleEditPassenger = (data: any) => {
    updateProfile({
      savedPassengers: user?.savedPassengers.map((p) => (p.id === editingPassenger?.id ? { ...p, ...data } : p)) || []
    });
    setEditingPassenger(null);
  };

  const handleDeletePassenger = (id: string) => {
    updateProfile({
      savedPassengers: user?.savedPassengers.filter((p) => p.id !== id) || []
    });
    setDeletingPassenger(null);
  };

  const handleAddPayment = (data: any) => {
    const newPayment = { ...data, id: `PM${Date.now()}`, isDefault: false };
    updateProfile({ savedPaymentMethods: [...(user?.savedPaymentMethods || []), newPayment] });
    setShowAddPayment(false);
  };

  const handleSetDefaultPayment = (id: string) => {
    updateProfile({
      savedPaymentMethods: user?.savedPaymentMethods.map((p) => ({ ...p, isDefault: p.id === id })) || []
    });
  };

  const handleDeletePayment = (id: string) => {
    updateProfile({
      savedPaymentMethods: user?.savedPaymentMethods.filter((p) => p.id !== id) || []
    });
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Manage your account, preferences, and saved information.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" dot>Premium Member</Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{user?.name?.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400">{user?.email}</p>
                <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{user?.phone}</p>
              </div>
              <div className="border-t border-navy-200 dark:border-navy-800 pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-navy-500 dark:text-navy-400">Member since</span>
                  <span className="font-medium text-navy-900 dark:text-white">Aug 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500 dark:text-navy-400">Bookings</span>
                  <span className="font-medium text-navy-900 dark:text-white">12</span>
                </div>
              </div>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex flex-wrap gap-2 mb-6 border-b border-navy-200 dark:border-navy-800 pb-2" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && <ProfileTab user={user!} onUpdate={updateProfile} />}
                {activeTab === 'passengers' && <PassengersTab user={user!} onAdd={handleAddPassenger} onEdit={handleEditPassenger} onDelete={handleDeletePassenger} showAdd={showAddPassenger} setShowAdd={setShowAddPassenger} editing={editingPassenger} setEditing={setEditingPassenger} deleting={deletingPassenger} setDeleting={setDeletingPassenger} />}
                {activeTab === 'payments' && <PaymentsTab user={user!} onAdd={handleAddPayment} onSetDefault={handleSetDefaultPayment} onDelete={handleDeletePayment} showAdd={showAddPayment} setShowAdd={setShowAddPayment} />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'security' && <SecurityTab onLogout={handleLogout} showLogoutConfirm={showLogoutConfirm} setShowLogoutConfirm={setShowLogoutConfirm} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, onUpdate }: { user: any; onUpdate: (data: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone });

  const handleSubmit = () => {
    onUpdate(formData);
    setEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Personal Information</h3>
        {editing ? (
          <Button variant="secondary" size="sm" onClick={() => { setFormData({ name: user.name, email: user.email, phone: user.phone }); setEditing(false); }}>Cancel</Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>

      <div className="space-y-4">
        {editing ? (
          <>
            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            <Button onClick={handleSubmit}>Save Changes</Button>
          </>
        ) : (
          <>
            <InfoRow label="Full Name" value={user.name} icon={User} />
            <InfoRow label="Email" value={user.email} icon={Mail} />
            <InfoRow label="Phone" value={user.phone} icon={Phone} />
          </>
        )}
      </div>
    </Card>
  );
}

function PassengersTab({ user, onAdd, onEdit, onDelete, showAdd, setShowAdd, editing, setEditing, deleting, setDeleting }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Saved Passengers</h3>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Passenger
        </Button>
      </div>

      {user.savedPassengers.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
          <h4 className="font-medium text-navy-900 dark:text-white mb-2">No saved passengers</h4>
          <p className="text-navy-600 dark:text-navy-400 mb-4">Add passengers to book tickets faster.</p>
          <Button onClick={() => setShowAdd(true)}>Add Your First Passenger</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {user.savedPassengers.map((passenger: any) => (
            <div key={passenger.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-primary-700 dark:text-primary-300 font-medium">{passenger.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-navy-900 dark:text-white">{passenger.name}</p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">Age: {passenger.age} • {passenger.gender === 'M' ? 'Male' : 'Female'} • {passenger.idType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(passenger)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleting(passenger.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function PaymentsTab({ user, onAdd, onSetDefault, onDelete, showAdd, setShowAdd }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Saved Payment Methods</h3>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {user.savedPaymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
          <h4 className="font-medium text-navy-900 dark:text-white mb-2">No saved payment methods</h4>
          <p className="text-navy-600 dark:text-navy-400 mb-4">Add a payment method for faster checkout.</p>
          <Button onClick={() => setShowAdd(true)}>Add Payment Method</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {user.savedPaymentMethods.map((method: any) => (
            <div key={method.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-navy-900 dark:text-white">{method.name}</p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">{method.maskedNumber || method.upiId || method.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => onSetDefault(method.id)}>Set Default</Button>
                )}
                {method.isDefault && <Badge variant="success" size="sm">Default</Badge>}
                <Button variant="ghost" size="sm" onClick={() => onDelete(method.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function NotificationsTab() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        <NotificationToggle label="Email Notifications" description="Receive booking confirmations, cancellations, and updates via email" defaultChecked />
        <NotificationToggle label="SMS Notifications" description="Get important alerts and OTP via SMS" defaultChecked />
        <NotificationToggle label="Push Notifications" description="Real-time train status, platform changes, and journey reminders" defaultChecked />
        <NotificationToggle label="Promotional Offers" description="Special discounts, offers, and travel deals" />
        <NotificationToggle label="Train Delay Alerts" description="Get notified when your train is delayed or rescheduled" defaultChecked />
      </div>
    </Card>
  );
}

function SecurityTab({ onLogout, showLogoutConfirm, setShowLogoutConfirm }: any) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Password & Security</h3>
        <div className="space-y-4">
          <SecurityAction label="Change Password" description="Update your account password" action={<Button variant="outline" size="sm">Change</Button>} />
          <SecurityAction label="Two-Factor Authentication" description="Add an extra layer of security to your account" action={<Badge variant="info">Coming Soon</Badge>} />
          <SecurityAction label="Login History" description="View recent login activity and devices" action={<Button variant="outline" size="sm">View</Button>} />
        </div>
      </Card>

      <Card className="p-6 border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-6 flex items-center gap-2"><Shield className="w-5 h-5" /> Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-navy-900 dark:text-white">Sign Out of All Devices</p>
            <p className="text-sm text-navy-600 dark:text-navy-400">This will sign you out from all devices and sessions.</p>
          </div>
          <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>Sign Out Everywhere</Button>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <p className="text-sm text-navy-500 dark:text-navy-400">{label}</p>
        <p className="font-medium text-navy-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
      <div>
        <p className="font-medium text-navy-900 dark:text-white">{label}</p>
        <p className="text-sm text-navy-500 dark:text-navy-400">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn('relative w-12 h-6 rounded-full transition-colors', checked ? 'bg-primary-500' : 'bg-navy-300 dark:bg-navy-600')}
        role="switch"
        aria-checked={checked}
      >
        <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-6' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}

function SecurityAction({ label, description, action }: { label: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
      <div>
        <p className="font-medium text-navy-900 dark:text-white">{label}</p>
        <p className="text-sm text-navy-500 dark:text-navy-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

function AddPassengerModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'M', idType: 'AADHAAR', idNumber: '', seatPreference: 'ANY', mealPreference: 'VEG' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.age) newErrors.age = 'Age required';
    if (!formData.idNumber) newErrors.idNumber = 'ID number required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Passenger" size="lg">
      <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(formData); }} className="space-y-4">
        <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} error={errors.age} />
          <Select label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }, { value: 'O', label: 'Other' }]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="ID Type" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })} options={[{ value: 'AADHAAR', label: 'Aadhaar' }, { value: 'PAN', label: 'PAN' }, { value: 'PASSPORT', label: 'Passport' }]} />
          <Input label="ID Number" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} error={errors.idNumber} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Seat Preference" value={formData.seatPreference} onChange={(e) => setFormData({ ...formData, seatPreference: e.target.value })} options={[{ value: 'LB', label: 'Lower Berth' }, { value: 'MB', label: 'Middle Berth' }, { value: 'UB', label: 'Upper Berth' }, { value: 'ANY', label: 'Any' }]} />
          <Select label="Meal Preference" value={formData.mealPreference} onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })} options={[{ value: 'VEG', label: 'Vegetarian' }, { value: 'NON_VEG', label: 'Non-Veg' }, { value: 'NO_MEAL', label: 'No Meal' }]} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Passenger</Button>
        </div>
      </form>
    </Modal>
  );
}

function EditPassengerModal({ isOpen, onClose, passenger, onSubmit }: { isOpen: boolean; onClose: () => void; passenger: any; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState(passenger || { name: '', age: '', gender: 'M', idType: 'AADHAAR', idNumber: '', seatPreference: 'ANY', mealPreference: 'VEG' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Passenger" size="lg">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...passenger, ...formData }); }} className="space-y-4">
        <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          <Select label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} options={[{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }, { value: 'O', label: 'Other' }]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="ID Type" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })} options={[{ value: 'AADHAAR', label: 'Aadhaar' }, { value: 'PAN', label: 'PAN' }, { value: 'PASSPORT', label: 'Passport' }]} />
          <Input label="ID Number" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Seat Preference" value={formData.seatPreference} onChange={(e) => setFormData({ ...formData, seatPreference: e.target.value })} options={[{ value: 'LB', label: 'Lower Berth' }, { value: 'MB', label: 'Middle Berth' }, { value: 'UB', label: 'Upper Berth' }, { value: 'ANY', label: 'Any' }]} />
          <Select label="Meal Preference" value={formData.mealPreference} onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })} options={[{ value: 'VEG', label: 'Vegetarian' }, { value: 'NON_VEG', label: 'Non-Veg' }, { value: 'NO_MEAL', label: 'No Meal' }]} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  return (
    <ConfirmModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} title={title} message={message} variant="danger" confirmText="Delete" />
  );
}

function AddPaymentModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [type, setType] = useState('upi');
  const [formData, setFormData] = useState({ name: '', upiId: '', cardNumber: '', expiry: '', cvv: '', bank: '' });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Payment Method" size="lg">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...formData, type }); }} className="space-y-4">
        <div className="flex gap-2">
          {['upi', 'credit', 'debit', 'netbanking'].map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} className={cn('flex-1 p-3 rounded-lg border-2 text-sm font-medium', type === t ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-400')}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {type === 'upi' && (
          <>
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="My UPI" />
            <Input label="UPI ID" value={formData.upiId} onChange={(e) => setFormData({ ...formData, upiId: e.target.value })} placeholder="name@upi" />
          </>
        )}
        {(type === 'credit' || type === 'debit') && (
          <>
            <Input label="Name on Card" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Card Number" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })} placeholder="1234 5678 9012 3456" maxLength={19} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry (MM/YY)" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} placeholder="12/25" maxLength={5} />
              <Input label="CVV" type="password" value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} placeholder="123" maxLength={3} />
            </div>
          </>
        )}
        {type === 'netbanking' && (
          <Select label="Select Bank" value={formData.bank} onChange={(e) => setFormData({ ...formData, bank: e.target.value })} options={[{ value: 'sbi', label: 'SBI' }, { value: 'hdfc', label: 'HDFC' }, { value: 'icici', label: 'ICICI' }, { value: 'axis', label: 'Axis' }, { value: 'kotak', label: 'Kotak' }, { value: 'other', label: 'Other' }]} placeholder="Choose bank" />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Payment Method</Button>
        </div>
      </form>
    </Modal>
  );
}