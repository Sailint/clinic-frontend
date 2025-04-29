import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contacts from '../views/Contacts.vue';
import Doctors from '../views/Doctors.vue';
import Patients from '../views/Patients.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import store from '../store';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/contacts', name: 'Contacts', component: Contacts },
    {
        path: '/doctors',
        name: 'Doctors',
        component: Doctors,
        meta: { requiresAuth: true }
    },
    {
        path: '/patients',
        name: 'Patients',
        component: Patients,
        meta: { requiresAuth: true }
    },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;
    if (to.meta.requiresAuth && !isAuthenticated) {
        await store.dispatch('restoreSession');
        if (store.getters.isAuthenticated) {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;