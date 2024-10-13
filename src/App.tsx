import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { AuthProvider, useIsAuthenticated } from "./contexts/AuthContext";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ActivatePage } from "./pages/auth/ActivatePage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { SendResetPasswordPage } from "./pages/auth/SendResetPasswordPage";

function AuthenticatedRoute() {
    if (useIsAuthenticated())
        return <Outlet/>
    return <Navigate to='/login'/>
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/'>
                        <Route path='login' element={<LoginPage/>}/>
                        <Route path='register' element={<RegisterPage/>}/>
                        <Route path='activate/:email' element={<ActivatePage/>}/>
                        <Route path='reset-password' element={<SendResetPasswordPage/>}/>
                        <Route path='reset-password/:email' element={<ResetPasswordPage/>}/>
                        <Route element={<AuthenticatedRoute/>}>
                            <Route path='' element={<HomePage/>}/>
                        </Route>
                    </Route>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}