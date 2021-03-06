import Vue from 'vue';
import Router from 'vue-router';
import userStore from '@/stores/UserStore';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: () => import('./views/LandingPage.vue'),
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('./views/Home.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./views/Register.vue'),
        },
        {
            path: '/events/create',
            name: 'events_create',
            component: () => import('./views/CreateEvent.vue'),
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('./views/Events.vue'),
        },
        {
            path: '/events/:id',
            name: 'events_id',
            component: () => import('./views/Event.vue'),
            props: true,
        },
        {
            path: '/debts/create',
            name: 'debts_create',
            component: () => import('./views/CreateDebt.vue'),
        },
        {
            path: '/debts',
            name: 'debts',
            component: () => import('./views/Debts.vue'),
        },
        {
            path: '/debts/:id',
            name: 'debts_id',
            component: () => import('./views/Debt.vue'),
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: () => import('./views/Contacts.vue'),
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/UserProfile.vue'),
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/register', '/'];
    const authRequired = !publicPages.includes(to.path);

    const loggedIn = await userStore.isLoggedIn();

    if (authRequired && !loggedIn) {
        userStore.alertUserNotLoggedIn();
        return next('/');
    }
    next();
});

export default router;
