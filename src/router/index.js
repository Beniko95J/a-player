import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/music'
  },
  {
    path: '/music',
    component: () => import('@/pages/music'),
    redirect: '/music/playList',
    children: [
      {
        path: '/music/playList', // 正在播放列表
        component: () => import('@/pages/playList/playList'),
      },
      {
        path: '/music/userList', // 我的歌单
        component: () => import('@/pages/userList/userList'),
      },
      {
        path: '/music/localList', // 我的歌单
        component: () => import('@/pages/localList/localList'),
      },
      {
        path: '/music/topList', // 排行榜歌单
        component: () => import('@/pages/topList/topList'),
      },
      {
        path: '/music/historyList', // 我听过的列表
        component: () => import('@/pages/historyList/historyList'),
      },
      {
        name: 'Search',
        path: '/music/search', // 搜索
        component: () => import('@/pages/search/search'),
      }
    ]
  }
];

const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes
});

export default router;
