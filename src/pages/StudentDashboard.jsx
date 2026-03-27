import { supabase } from "../supabaseClient.js";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentStudent();
    }, []);

    async function fetchCurrentStudent() {
        // 1. Get the authenticated user's ID from Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("User not logged in", authError?.message);
            setLoading(false);
            return;
        }

        // 2. Fetch only the student record matching that user ID
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(); // Returns one object instead of an array

        if (error) {
            console.error('Error fetching student details:', error.message);
        } else {
            console.log(user);
            setStudent(data);
        }
        setLoading(false);
    }

    if (loading) return <p>Loading your dashboard...</p>;

    return (
        <div>
            <h1>Student Control Center</h1>
            {student ? (
                <>
                    <p>Welcome, {student.full_name}. Here are your lessons...</p>
                    {/* Display other student-specific info here */}
                </>
            ) : (
                <p>No student profile found.</p>
            )}
        </div>
    );
}
