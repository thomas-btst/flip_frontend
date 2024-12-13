import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { AuthProvider, useAuth, useIsAuthenticated } from "./contexts/AuthContext";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { AccountPage } from "./pages/AccountPage";
import { ActivatePage } from "./pages/auth/ActivatePage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { SendResetPasswordPage } from "./pages/auth/SendResetPasswordPage";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { tanstackQueryClient } from "./config/tanstack.config";
import { ProductPage } from "./pages/ProductPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { Layout } from "./features/Layout";
import { AdminCreateProductPage } from "./pages/admin/AdminCreateProductPage";
import { AdminEditProductPage } from "./pages/admin/AdminEditProductPage";

function AuthenticatedRoute() {
    if (useIsAuthenticated())
        return <Outlet/>
    return <Navigate to='/login'/>
}

function AdminRoute() {
    if (useAuth()?.roles.includes("ADMIN"))
        return <Outlet/>
    return <NotFound/>
}

export default function App() {
    return (
        <QueryClientProvider client={tanstackQueryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path='/'>
                            <Route path='login' element={<LoginPage/>}/>
                            <Route path='register' element={<RegisterPage/>}/>
                            <Route path='activate/:email' element={<ActivatePage/>}/>
                            <Route path='reset-password' element={<SendResetPasswordPage/>}/>
                            <Route path='reset-password/:email' element={<ResetPasswordPage/>}/>

                            <Route element={<Layout.Search/>}>
                                <Route path='search' element={<SearchPage/>}/>
                            </Route>

                            <Route element={<Layout/>}>
                                <Route path='' element={<HomePage/>}/>
                                <Route path='product/:productId' element={<ProductPage/>}/>
                                <Route element={<AuthenticatedRoute/>}>
                                    <Route path='account' element={<AccountPage/>}/>
                                </Route>
                                <Route path="admin" element={<AdminRoute/>}>
                                    <Route path="" element={<AdminPage/>}/>
                                    <Route path="product" element={<AdminCreateProductPage/>}/>
                                    <Route path="product/:productId" element={<AdminEditProductPage/>}/>
                                    <Route path="products" element={<AdminProductsPage/>}/>
                                </Route>
                                <Route path='*' element={<NotFound/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    )
}