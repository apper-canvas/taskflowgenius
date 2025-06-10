import HomePage from '@/components/pages/HomePage';
import TodayPage from '@/components/pages/TodayPage';
import UpcomingPage from '@/components/pages/UpcomingPage';
import AllTasksPage from '@/components/pages/AllTasksPage';
import CategoriesPage from '@/components/pages/CategoriesPage';
import ArchivePage from '@/components/pages/ArchivePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
component: TodayPage
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
component: UpcomingPage
  },
  all: {
    id: 'all',
    label: 'All Tasks',
    path: '/all',
    icon: 'List',
component: AllTasksPage
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tag',
component: CategoriesPage
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
component: ArchivePage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);