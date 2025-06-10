import Home from '../pages/Home';
import Today from '../pages/Today';
import Upcoming from '../pages/Upcoming';
import AllTasks from '../pages/AllTasks';
import Categories from '../pages/Categories';
import Archive from '../pages/Archive';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  all: {
    id: 'all',
    label: 'All Tasks',
    path: '/all',
    icon: 'List',
    component: AllTasks
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tag',
    component: Categories
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);