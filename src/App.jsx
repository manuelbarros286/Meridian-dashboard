import Login from './pages/Login'
import TutorDashboard from "./pages/TutorDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { useEffect} from "react";
import {supabase} from "./supabaseClient.js";
import AdminDashboard from "./pages/AdminDashboard.jsx";
function App() {
    const [session, setSession] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    async function fetchRole(userId){
        const {data} = await supabase.from('profiles').select('role').eq('id', userId).single();
        setRole(data?.role);
        setLoading(false);
    }
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchRole(session.user.id);
            }
            else {
                setLoading(false);
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                fetchRole(session.user.id);
            }
            else {
                setRole(null);
                setLoading(false);
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    if(loading){
        return <div style={{padding: '20px'}}> Loading Meridian</div>
    }
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={!session ? <Login /> : <Navigate to={`/dashboard`} />} />

              <Route path="/dashboard" element={
                  !session ? <Navigate to={`/`} /> :
                  role === 'admin' ? <AdminDashboard /> :
                  role === 'tutor' ? <TutorDashboard /> :
                  role === 'student' ? <StudentDashboard /> :
                      <p> Profile Error: Role not found.</p>
              } />
              <Route path="*" element={<Navigate to="/" />} />

          </Routes>
      </BrowserRouter>
  )
}

export default App
