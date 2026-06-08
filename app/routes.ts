import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import Login from "./routes/login";
import Placeholder  from "./routes/placeholder";

export const router = createBrowserRouter([

    {
    path: '/',
    Component: Login, // Tela 1
    },
    {
    path: '/',
    Component: Layout,
    },
])
