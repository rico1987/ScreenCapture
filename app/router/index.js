import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../views/layout/Layout';
// eslint-disable-next-line
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '',
            component: Layout,
            redirect: 'dashboard',
            children: [{
                path: 'dashboard',
                component: _import('dashboard/index'),
                name: 'dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard',
                    noCache: true,
                },
            }],
        },
        {
            path: '/settings',
            component: Layout,
            children: [{
                path: 'index',
                component: _import('settings/index'),
                meta: { title: 'settings', icon: 'icon', noCache: true },
            }],
        },
    ],
});
