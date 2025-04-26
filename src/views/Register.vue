<template>
    <div class="container mx-auto p-4 max-w-md">
        <h1 class="text-3xl font-bold mb-4">Регистрация</h1>
        <form @submit.prevent="register" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" v-model="email" type="email" placeholder="Email"
                    class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" required />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
                <input id="password" v-model="password" type="password" placeholder="Пароль"
                    class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" required />
            </div>
            <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Повторите пароль</label>
                <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Повторите пароль"
                    class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600" required />
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
                Зарегистрироваться
            </button>
        </form>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
        <p class="mt-4 text-center">
            Уже есть аккаунт? <router-link to="/login" class="text-blue-600 hover:underline">Войти</router-link>
        </p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const error = ref('');

        const register = async () => {
            error.value = '';
            if (password.value !== confirmPassword.value) {
                error.value = 'Пароли не совпадают';
                return;
            }
            try {
                const result = await store.dispatch('register', {
                    email: email.value,
                    password: password.value
                });
                if (result.success) {
                    router.push('/login');
                } else {
                    error.value = result.error;
                }
            } catch (err) {
                error.value = err.response?.data?.error || 'Ошибка регистрации';
            }
        };

        return { email, password, confirmPassword, error, register };
    }
};
</script>