import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { dataService } from '../../services/dataService';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import type { Employee } from '../../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Save, 
  Camera
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUserProfile } = useAuth();
  const { showToast } = useNotifications();

  const [employee, setEmployee] = useState<Employee | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');

  const refreshProfile = () => {
    if (user) {
      const emp = dataService.getEmployeeById(user.employeeId);
      setEmployee(emp);
      if (emp) {
        setPhone(emp.phone);
        setAddress(emp.address);
        setAvatar(emp.avatar);
      }
    }
  };

  useEffect(() => {
    refreshProfile();
    const unsub = dataService.subscribe(refreshProfile);
    return unsub;
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateCurrentUserProfile({ phone, address, avatar });
    dataService.updateEmployeeProfile(user.employeeId, { phone, address, avatar });
    setIsEditing(false);
    showToast('Profile Updated', 'Your contact phone and address have been updated.', 'success');
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={employee?.name || 'Avatar'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-100 dark:border-indigo-950/80 shadow-md"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-slate-900/50 rounded-3xl flex items-center justify-center text-white text-xs font-semibold">
                <Camera className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {employee?.name}
                  </h1>
                  <Badge variant={employee?.status as any} dot>
                    {employee?.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {employee?.designation} • {employee?.department}
                </p>
              </div>

              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit3 className="w-4 h-4" />}
                >
                  Edit Contact Info
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      refreshProfile();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                ID: <strong className="text-slate-700 dark:text-slate-300 font-mono">{employee?.employeeId}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {employee?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Joined {employee?.joiningDate}
              </span>
            </div>

            {/* Avatar picker if editing */}
            {isEditing && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Select Profile Avatar:
                </p>
                <div className="flex items-center gap-2">
                  {sampleAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="avatar option"
                      onClick={() => setAvatar(src)}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition-transform ${
                        avatar === src ? 'ring-2 ring-indigo-600 scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal & Contact Information */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Personal & Contact Details"
            subtitle="Editable fields are marked accordingly. Administrative job data is protected."
          />
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Employee ID</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    value={employee?.employeeId || ''}
                    disabled
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Full Legal Name</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    value={employee?.name || ''}
                    disabled
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Corporate Email</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    value={employee?.email || ''}
                    disabled
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Contact Phone</span>
                    {isEditing && <span className="text-[10px] text-indigo-600 font-bold">Editable</span>}
                  </label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    disabled={!isEditing}
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                  <span>Residential Address</span>
                  {isEditing && <span className="text-[10px] text-indigo-600 font-bold">Editable</span>}
                </label>
                <Input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  disabled={!isEditing}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>

              {isEditing && (
                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Job Details Card (Read Only) */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="Official Job Profile"
            subtitle="Managed by HR Office"
          />
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {employee?.department}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {employee?.designation}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Joining</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {employee?.joiningDate}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Employment Status</span>
              <div className="mt-1">
                <Badge variant={employee?.status as any} dot>
                  {employee?.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Structure View (Read Only) */}
      <Card>
        <CardHeader
          title="Assigned Salary Structure"
          subtitle="Contractual earnings, standard statutory deductions, and gross calculations"
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Basic Pay</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                ${employee?.salaryStructure.basicSalary.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">HRA</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                ${employee?.salaryStructure.allowances.hra.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Total</span>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                ${employee?.salaryStructure.grossSalary.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Deductions</span>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                -${(
                  (employee?.salaryStructure.deductions.tax || 0) +
                  (employee?.salaryStructure.deductions.providentFund || 0) +
                  (employee?.salaryStructure.deductions.insurance || 0)
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Net Take-Home</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                ${employee?.salaryStructure.netSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
