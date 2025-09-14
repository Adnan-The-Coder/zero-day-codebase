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
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(userId));
      if (res.ok) {
        const json: ApiResponse = await res.json();
        if (json.success && json.data) {
          setUser({
            id: json.data.id || json.data.user_uuid || userId,
            email: json.data.email || "",
            full_name: json.data.full_name || json.data.name,
            avatar_url: json.data.avatar_url || json.data.profile_image,
          });
          return;
        }
      }

      // fallback: get Supabase user directly
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name,
          avatar_url:
            data.user.user_metadata?.avatar_url ||
            data.user.identities?.[0]?.identity_data?.avatar_url,
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
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
