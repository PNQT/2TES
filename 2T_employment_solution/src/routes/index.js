import Home from '~/pages/Home';
import Category from '~/pages/Categories';
import Search from '~/pages/Search';
import PostJob from '~/pages/PostJob';
import Apply from '~/pages/Apply';
import Profile from '~/pages/Profile';
import Setting from '~/pages/Setting';
import Register from '~/pages/Register';
import Login from '~/pages/Login';
import ResetPassword from '~/pages/ResetPassword';
import SendEmail from '~/pages/SendEmail';
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
  { path: routesConfig.register, component: Register, layout: DefaultLayout },
  { path: routesConfig.login, component: Login, layout: DefaultLayout},
  { path: routesConfig.resetpassword, component: ResetPassword, layout: DefaultLayout},
  { path: routesConfig.sendemail, component: SendEmail, layout: DefaultLayout}


];


export  {publicRoutes};