import Home from '~/pages/Home';
import Category from '~/pages/Categories';
import Search from '~/pages/Search';
import PostJob from '~/pages/PostJob';
import Apply from '~/pages/Apply';
import Profile from '~/pages/Profile';
import Setting from '~/pages/Setting';
import { DefaultLayout } from '~/components/Layout';
import routesConfig from "~/config/routes"

const publicRoutes = [
  { path: routesConfig.home, component: Home, layout: DefaultLayout },
  { path: routesConfig.categories, component: Category, layout: DefaultLayout },
  { path: routesConfig.search, component: Search, layout: DefaultLayout },
  { path: routesConfig.post, component: PostJob, layout: DefaultLayout },
  { path: routesConfig.apply, component: Apply, layout: DefaultLayout },
  { path: routesConfig.profile, component: Profile, layout: DefaultLayout },
  { path: routesConfig.setting, component: Setting, layout: DefaultLayout },

];


export  {publicRoutes};