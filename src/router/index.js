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
    redirect: '/music/playlist',
    children: [
      {
        path: '/music/playlist', // 正在播放列表
        component: () => import('@/pages/playList/playList'),
      },
      {
        path: '/music/userList', // 我的歌单
        component: () => import('@/pages/userList/userList'),
      },
      {
        path: '/music/toplist', // 排行榜歌单
        component: () => import('@/pages/topList/topList'),
      },
      {
        path: '/music/historylist', // 我听过的列表
        component: () => import('@/pages/historyList/historyList'),
      },
      {
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
