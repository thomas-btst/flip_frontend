import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
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
import { AdminProductsPage } from "./pages/admin/product/AdminProductsPage";
import { Layout } from "./features/Layout";
import { AdminCreateProductPage } from "./pages/admin/product/AdminCreateProductPage";
import { AdminEditProductPage } from "./pages/admin/product/AdminEditProductPage";
import { CartPage } from "./pages/CartPage";
import { CommandsPage } from "./pages/command/CommandsPage";
import { CommandPage } from "./pages/command/CommandPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ContactPage } from "./pages/ContactPage";
import { AdminCommandsPage } from "./pages/admin/command/AdminCommandsPage";
import { AdminEditCommandPage } from "./pages/admin/command/AdminEditCommandPage";
import { AdminUsersPage } from "./pages/admin/user/AdminUsersPage";
import { AdminUserPage } from "./pages/admin/user/AdminUserPage";

function AuthenticatedRoute() {
    if (useAuth() !== null)
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
                                <Route path='contact' element={<ContactPage/>}/>
                                <Route path='product/:productId' element={<ProductPage/>}/>
                                <Route element={<AuthenticatedRoute/>}>
                                    <Route path='account' element={<AccountPage/>}/>
                                    <Route path='cart' element={<CartPage/>}/>
                                    <Route path='commands' element={<CommandsPage/>}/>
                                    <Route path='command/:commandId' element={<CommandPage/>}/>
                                </Route>
                                <Route path="admin" element={<AdminRoute/>}>
                                    <Route path="" element={<AdminPage/>}/>
                                    <Route path="product" element={<AdminCreateProductPage/>}/>
                                    <Route path="product/:productId" element={<AdminEditProductPage/>}/>
                                    <Route path="products" element={<AdminProductsPage/>}/>
                                    <Route path="commands" element={<AdminCommandsPage/>}/>
                                    <Route path="command/:commandId" element={<AdminEditCommandPage/>}/>
                                    <Route path="users" element={<AdminUsersPage/>}/>
                                    <Route path="user/:userId" element={<AdminUserPage/>}/>
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