<template>
    <div class="min-h-screen flex flex-col">
        <Header />
        <main class="flex-grow">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
    components: { Header, Footer },
    setup() {
        const store = useStore();

        onMounted(async () => {
            await store.dispatch('restoreSession');
        });
    }
};
</script>