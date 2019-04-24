import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Start from '@/components/Start';
import Intro from '@/components/Intro';
import E404 from '@/components/E404';
import Company from '@/components/page/setting/Company';
import Group from '@/components/page/setting/Group';
import Test from '@/components/page/dev/Test';
import Talk from '@/components/page/board/Talk';
import Qna from '@/components/page/board/Qna';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      children: [
        {
          path: '/',
          name: 'Intro',
          component: Intro,
          meta: {
            title: 'NEMBV introduce',
            breadcrumb: [{
              text: 'Welcome',
              href: '/',
            }],
          },
        },
        {
          path: '/company',
          name: 'Company',
          component: Company,
          meta: {
            title: '회사 관리',
            breadcrumb: [{
              text: '환경설정 > 회사 관리',
              href: '/',
            }],
          },
        },
        {
          path: '/group',
          name: 'Group',
          component: Group,
          meta: {
            title: '그룹 관리',
            breadcrumb: [{
              text: '환경설정 > 그룹 관리',
              href: '/',
            }],
          },
        },
        {
          path: '/test',
          name: 'Test',
          component: Test,
          meta: {
            title: 'test',
            breadcrumb: [{
              text: '개발자 > test',
              href: '/',
            }],
          },
        },
      ],
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/talk',
      name: 'Talk',
      component: Talk,
      meta: {
        title: '잡담',
        breadcrumb: [{
          text: '게시판 > 잡담',
          href: '/',
        }],
      },
    },
    {
      path: '/qna',
      name: 'Qna',
      component: Qna,
      meta: {
        title: 'Q&A',
        breadcrumb: [{
          text: '게시판 > Q&A',
          href: '/',
        }],
      },
    },
    {
      path: '*',
      name: 'E404',
      component: E404,
    }
  ]
})
