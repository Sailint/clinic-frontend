<template>
    <header class="bg-blue-600 text-white p-4">
        <nav class="container mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Поликлиника</h1>
            <div class="space-x-4">
                <router-link to="/" class="hover:underline">Главная</router-link>
                <router-link to="/about" class="hover:underline">О нас</router-link>
                <router-link to="/contacts" class="hover:underline">Контакты</router-link>
                <router-link to="/doctors" class="hover:underline">Врачи</router-link>
                <router-link to="/patients" class="hover:underline">Пациенты</router-link>
                <router-link v-if="!isAuthenticated" to="/login" class="hover:underline">Вход</router-link>
                <router-link v-if="!isAuthenticated" to="/register" class="hover:underline">Регистрация</router-link>
                <span v-if="isAuthenticated" class="text-sm">({{ userRole }})</span>
                <button v-if="isAuthenticated" @click="logout" class="hover:underline">Выйти</button>
            </div>
        </nav>
    </header>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        const userRole = computed(() => store.getters.userRole);

        const logout = () => {
            store.dispatch('logout');
            router.push('/login');
        };

        return { isAuthenticated, userRole, logout };
    }
};
</script>