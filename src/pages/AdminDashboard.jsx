import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const [allStudents, setAllStudents] = useState([])

    useEffect(() => {
        const fetchAllData = async () => {
            const { data, error } = await supabase.from('students').select('*, tutor:profiles!tutor_id(full_name)');
            if (error) {
                console.error("Fetch error:", error.message);
            }  else{
                setAllStudents(data || []);
            }
        }
        fetchAllData();
    }, []);

    const renderStudentRows = () => {
        if (allStudents.length === 0) {
            return (
                <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                        No students found in the system.
                    </td>
                </tr>
            );
        }

        return allStudents.map((student) => (
            <tr key={student.id}>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.status}</td>
                <td>
                    {student.tutor ? (
                        <span>{student.tutor.full_name}</span>
                    ) : (
                        <strong style={{ color: "red" }}>UNASSIGNED</strong>
                    )}
                </td>
                <td>
                    <button onClick={() => console.log("Edit", student.id)}>Edit</button>
                </td>
            </tr>
        ));
    };


    return (
        <div className="admin-container">
            <h1>Meridian Master Control (Admin)</h1>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ backgroundColor: "#eee" }}>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Tutor ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {renderStudentRows()}
                </tbody>
            </table>

            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
    )
}
