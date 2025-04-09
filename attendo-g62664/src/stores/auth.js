import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/services/supabase";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const isAuthenticated = computed(() => user.value !== null);

    async function initialize() {
        loading.value = true;
        error.value = null;

        try {
            const { data, error: sessionError } = await supabase.auth.getSession();
                
            if (sessionError) throw sessionError;
            if (data?.session) user.value = data.session.user;
        } catch (err) {
            console.error('Error while authentification initialization: ', err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                user.value = session.user;
            } else if (event === 'SIGNED_OUT') {
                user.value = null;
            } else if (event === 'USER_UPDATED') {
                user.value = session?.user ?? null;
            }
        })
    }

    async function signInWithGoogle() {
			loading.value = true;
			error.value = null;
	
			try {
				const { error: signInError } = await supabase.auth.signInWithOAuth({
					provider: 'google',
					options: {
						redirectTo: `${window.location.origin}/`,
						queryParams: {
							access_type: 'offline',
							prompt: 'consent',
						}
					}
				});

				if (signInError) throw signInError;
			} catch (err) {
				console.error('Connexion error: ', err);
				error.value = err.message;
			} finally {
				loading.value = false;
			}
	}

    async function signOut() {
        loading.value = true
        error.value = null
        
        try {
            const { error: signOutError } = await supabase.auth.signOut()
            if (signOutError) throw signOutError
            user.value = null
        } catch (err) {
            console.error('Sign out error:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        initialize,
        signInWithGoogle,
        signOut
    }
});