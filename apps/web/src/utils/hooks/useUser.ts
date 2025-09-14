"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { API_ENDPOINTS } from "@/config/api";

interface ApiResponse {
  success: boolean;
  data?: {
    id?: string;
    user_uuid?: string;
    email?: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
    profile_image?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("🔍 Fetching user profile for ID:", userId);
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(userId));
      console.log("📡 API Response status:", res.status);
      
      if (res.ok) {
        const json: ApiResponse = await res.json();
        console.log("📦 API Response data:", json);
        
        if (json.success && json.data) {
          const avatarUrl = json.data.avatar_url || json.data.profile_image;
          console.log("🖼️ Avatar URL from API:", avatarUrl);
          
          setUser({
            id: json.data.id || json.data.user_uuid || userId,
            email: json.data.email || "",
            full_name: json.data.full_name || json.data.name,
            avatar_url: avatarUrl,
          });
          return;
        }
      }

      // fallback: get Supabase user directly
      console.log("🔄 Falling back to Supabase auth data");
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        const avatarUrl = data.user.user_metadata?.avatar_url ||
          data.user.identities?.[0]?.identity_data?.avatar_url;
        console.log("🖼️ Avatar URL from Supabase:", avatarUrl);
        console.log("👤 User metadata:", data.user.user_metadata);
        console.log("🔗 User identities:", data.user.identities);
        
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name,
          avatar_url: avatarUrl,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    }
  };

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      await fetchUserProfile(data.session.user.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
