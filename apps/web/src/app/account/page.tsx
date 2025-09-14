"use client";
import type React from 'react';
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Heart, CreditCard, LogOut, Settings, Edit, Camera, 
  Truck, Clock, CheckCircle, AlertCircle, ChevronRight, ShoppingBag, 
  MapPin, Phone, Shield, Bell, HelpCircle, Loader2, Store, Activity,
  Globe, Calendar, MapPinned, Info, Lock
} from 'lucide-react';

import { supabase } from '../../utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import Navbar from '@/components/Navbar';

// Interface for user login info
interface UserLoginInfo {
  last_sign_in?: string;
  sign_in_count?: number;
  sign_in_method?: string;
  provider?: string;
  ip_address?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    coordinates?: string;
    timezone?: string;
  } | string;
}

// Modular Profile Info Form
function ProfileInfoForm({ profile, updatedProfile, onChange, onSave, saving, editMode, setEditMode, error, success, element_unique_id }: any) {
  return (
    <motion.div 
      className="mt-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-[0_6px_40px_rgba(0,0,0,.35)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="size-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div 
            className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex">
              <div className="shrink-0">
                <CheckCircle className="size-5 text-emerald-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-emerald-300">{success}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-white">Personal Information</h2>
        <motion.button
          type='button'
          onClick={() => setEditMode(!editMode)}
          className="flex items-center text-sm font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {editMode ? 'Cancel' : (<><Edit className="mr-1 size-4" />Edit</>)}
        </motion.button>
      </div>
      {editMode ? (
        <motion.form 
          className="space-y-4 mt-6" 
          onSubmit={onSave}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-white/80">Full Name</label>
            <input
              type="text"
              id={element_unique_id + '-full_name'}
              name="full_name"
              value={updatedProfile.full_name || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-white/80">Avatar URL</label>
            <input
              type="text"
              id={element_unique_id + '-avatar_url'}
              name="avatar_url"
              value={updatedProfile.avatar_url || ''}
              onChange={onChange}
              placeholder="https://..."
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white/80">Phone Number</label>
            <input
              type="tel"
              id={element_unique_id + '-phone'}
              name="phone"
              value={updatedProfile.phone || ''}
              onChange={onChange}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-white/80">Address</label>
            <input
              type="text"
              id={element_unique_id + '-address'}
              name="address"
              value={updatedProfile.address || ''}
              onChange={onChange}
              placeholder="Street, Area, etc."
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white/80">City</label>
              <input
                type="text"
                id={element_unique_id + '-city'}
                name="city"
                value={updatedProfile.city || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-white/80">State</label>
              <input
                type="text"
                id={element_unique_id + '-state'}
                name="state"
                value={updatedProfile.state || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-white/80">Pincode</label>
              <input
                type="text"
                id={element_unique_id + '-pincode'}
                name="pincode"
                value={updatedProfile.pincode || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email_notifications" className="block text-sm font-medium text-white/80">Email Notifications</label>
            <select
              id={element_unique_id + '-email_notifications'}
              name="email_notifications"
              value={updatedProfile.email_notifications || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200"
            >
              <option value="" className="bg-black text-white">Select preference</option>
              <option value="enabled" className="bg-black text-white">Enabled</option>
              <option value="disabled" className="bg-black text-white">Disabled</option>
            </select>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-white/80">Bio</label>
            <textarea
              id={element_unique_id + '-bio'}
              name="bio"
              value={updatedProfile.bio || ''}
              onChange={onChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 sm:text-sm transition-all duration-200 resize-none"
            />
          </div>
          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              className="flex items-center rounded-lg bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/30 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-70 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? (<><Loader2 className="mr-2 size-4 animate-spin" />Saving...</>) : 'Save Changes'}
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div 
          className="space-y-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Full Name</h3>
              <p className="mt-1 text-sm text-white">{profile?.full_name || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Email Address</h3>
              <p className="mt-1 text-sm text-white">{profile?.email || ''}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Phone Number</h3>
              <p className="mt-1 text-sm text-white">{profile?.phone || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Address</h3>
              <p className="mt-1 text-sm text-white">{profile?.address || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">City</h3>
              <p className="mt-1 text-sm text-white">{profile?.city || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">State</h3>
              <p className="mt-1 text-sm text-white">{profile?.state || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Pincode</h3>
              <p className="mt-1 text-sm text-white">{profile?.pincode || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Email Notifications</h3>
              <p className="mt-1 text-sm text-white">{profile?.email_notifications || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Bio</h3>
              <p className="mt-1 text-sm text-white">{profile?.bio || 'Not provided'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Account Created</h3>
              <p className="mt-1 text-sm text-white">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-white/60">Last Updated</h3>
              <p className="mt-1 text-sm text-white">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginInfo, setLoginInfo] = useState<UserLoginInfo | null>(null);
  const [vendorStatus, setVendorStatus] = useState<'loading' | 'not_vendor' | 'is_vendor' | 'registering' | 'error'>(
    'loading'
  );
  const [vendorError, setVendorError] = useState<string | null>(null);
  const element_unique_id = useId();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);
      // Fetch profile data from backend API
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(session.user.id), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const profileJson:any = await res.json();
      if (!profileJson.success || !profileJson.data) {
        throw new Error(profileJson.message || 'Profile not found');
      }
      let profileData = profileJson.data;
      if (profileData.user_login_info && typeof profileData.user_login_info === 'string') {
        try {
          profileData.user_login_info = JSON.parse(profileData.user_login_info);
        } catch {}
      }
      setProfile(profileData);
      setUpdatedProfile(profileData);
      if (profileData?.user_login_info) {
        setLoginInfo(profileData.user_login_info);
      }
      // --- Vendor check logic ---
      setVendorStatus('loading');
      setVendorError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: any = {
        full_name: updatedProfile.full_name,
        avatar_url: updatedProfile.avatar_url,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        city: updatedProfile.city,
        state: updatedProfile.state,
        pincode: updatedProfile.pincode,
        email_notifications: updatedProfile.email_notifications,
        bio: updatedProfile.bio,
        updated_at: new Date().toISOString(),
      };
      let newLoginInfo = loginInfo || {};
      newLoginInfo.last_sign_in = new Date().toISOString();
      newLoginInfo.sign_in_count = (loginInfo?.sign_in_count || 0) + 1;
      newLoginInfo.sign_in_method = loginInfo?.sign_in_method || 'email';
      payload.user_login_info = newLoginInfo;
      const res = await fetch(API_ENDPOINTS.updateProfileByUUID(user.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err:any = await res.json();
        throw new Error(err.message || 'Failed to update profile');
      }
      setProfile({
        ...profile,
        ...payload,
        user_login_info: newLoginInfo,
      });
      setLoginInfo(newLoginInfo);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="mx-auto size-12 animate-spin text-white" />
          <p className="mt-4 text-lg font-medium text-white">Loading your account...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black pb-12 pt-8">
      <div className="relative mb-8 h-24 w-full bg-gradient-to-r from-white/10 via-white/5 to-white/10">
        <div className="h-1 w-full bg-gradient-to-r from-white/20 via-white/30 to-white/20"></div>
      </div>
      <div className="container mx-auto px-4">
        <motion.div 
          className="relative -mt-32 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 shadow-[0_6px_40px_rgba(0,0,0,.35)] md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex flex-col items-center border-b border-white/10 pb-6 md:flex-row md:items-start md:pb-8">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="relative size-24 overflow-hidden rounded-full border-4 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-white/10 text-white">
                    <User className="size-12" />
                  </div>
                )}
              </div>
              <motion.button 
                type='button' 
                className="absolute bottom-0 right-0 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 p-1.5 text-white shadow-md transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="size-4" />
              </motion.button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">{profile?.full_name || 'User'}</h1>
              <p className="text-white/70">{profile?.email || ''}</p>
              <p className="mt-1 text-sm text-white/50">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <motion.button 
                  type='button'
                  onClick={handleSignOut}
                  className="flex items-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="mr-1.5 size-4 text-white/70" />
                  Sign Out
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href="/account/settings" 
                    className="flex items-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-200"
                  >
                    <Settings className="mr-1.5 size-4 text-white/70" />
                    Settings
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          <ProfileInfoForm
            profile={profile}
            updatedProfile={updatedProfile}
            onChange={handleInputChange}
            onSave={handleProfileUpdate}
            saving={saving}
            editMode={editMode}
            setEditMode={setEditMode}
            error={error}
            success={success}
            element_unique_id={element_unique_id}
          />
        </motion.div>
      </div>
      </div>
    </div>
  );
}