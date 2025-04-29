import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        user: null, // { token, role }
        isAuthenticated: false
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isAuthenticated = !!user;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    actions: {
        async register({ commit }, { email, password }) {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/register`,
                    { email, password }
                );
                return { success: true };
            } catch (error) {
                console.error('Registration failed:', error.response?.data?.error || error.message);
                return {
                    success: false,
                    error: error.response?.data?.error || 'Registration failed'
                };
            }
        },
        async login({ commit }, { email, password }) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/login`,
                    { email, password }
                );
                const { token, role } = response.data;
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                commit('setUser', { token, role });
                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        async restoreSession({ commit }) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/me`
                    );
                    commit('setUser', { token, role: response.data.role });
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    commit('clearUser');
                }
            }
        },
        logout({ commit }) {
            commit('clearUser');
        }
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        userRole: (state) => state.user?.role || null
    }
});