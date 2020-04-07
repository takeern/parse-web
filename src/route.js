import Home from './component/Home.jsx';
import Parse from './component/Parse.jsx';


const routes = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/parse',
        component: Parse,
        exact: true,
    },
];

export default routes;