import {supabase} from "../supabaseClient.js";
import {useEffect, useState} from "react";

export default function TutorDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleSignOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error.message);
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        const {data , error} = await supabase.from('students').select('*').order('full_name', {ascending: true  });

        if (error) {
            console.error('Error fetching student data', error.message);
        } else {
            setStudents(data);
        }
        setLoading(false);
    }

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Tutor Dashboard</h1>
            </header>

            <section>
                <h2>Your Students</h2>
                {loading ? (
                    <p>Loading roster...</p>
                ) : students.length > 0 ? (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.full_name}</td>
                                <td>{student.email}</td>
                                <td>{student.status}</td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                ) : (
                    <p>No students found. Add your first student to get started!</p>
                )}
            </section>
            <button onClick={handleSignOut} className="signout-button">Sign Out</button>
        </div>
    )
}
