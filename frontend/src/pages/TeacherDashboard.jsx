import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import TeacherProfile from '../Profile/TeacherProfile';
import SubmitThesis from '../components/SubmitThesis';
import Docs from '../components/Docs';
import Calendar from '../components/Calendar';
import SendGmail from '../Communication/SendGmail';
import ScheduleTable from '../components/ScheduleTable';
import DefenseSchedule from '../components/DefenseSchedule';
import ReviewSubmission from '../components/ReviewSubmission';
import StudentList from '../components/StudentList';
import TeacherNotification from '../components/TeacherNotification';
import CommentDocs from '../components/CommentDocs';
import TeacherNavbar from '../Navbar/TeacherNavbar';
import TeacherTopbar from '../Topbar/TeacherTopbar';

const TeacherDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [userInfo, setUserInfo] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({ thesisId: '', comment: '', status: '', teacherName: '', teacherEmail: '' });

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        if (!data) {
            navigate('/login');
            return;
        }
        const userData = JSON.parse(data);
        if (userData?.role !== 'teacher') {
            navigate('/login');
            return;
        }
        setUserInfo(userData);
        
        if (location.pathname === '/teacher-dashboard') {
            navigate('/teacher-dashboard/dashboard');
        }
    }, [navigate, location]);

    // Fetch submissions when userInfo is available
    useEffect(() => {
        if (userInfo?.email) {
            fetchSubmissions();
        }
    }, [userInfo]);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/thesis/submissions/adviser?email=${encodeURIComponent(userInfo.email)}`
            );
            const data = await response.json();
            
            if (data.status === 'success') {
                setSubmissions(data.data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/', { replace: true });
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        navigate(`/teacher-dashboard/${section}`);
    };

    // Add this useEffect to fetch notifications
    useEffect(() => {
        if (userInfo?.email) {
            fetchNotifications();
        }
    }, [userInfo]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/notifications/${encodeURIComponent(userInfo.email)}`
            );
            const data = await response.json();
            
            if (data.status === 'success') {
                setNotifications(data.data);
                setUnreadCount(data.data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleFeedbackSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/thesis/feedback/${feedbackForm.thesisId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackForm),
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Optionally, refresh submissions or show a success message
                fetchSubmissions();
                setFeedbackForm({ thesisId: '', comment: '', status: '', teacherName: '', teacherEmail: '' }); // Reset form
            } else {
                console.error('Feedback submission failed:', data.message);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const renderFeedbackForm = () => (
        <div>
            <h3>Add Feedback</h3>
            <textarea
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                placeholder="Enter your feedback"
            />
            <select
                value={feedbackForm.status}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, status: e.target.value })}
            >
                <option value="">Select Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="revision">Revision</option>
            </select>
            <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
        </div>
    );

    const renderContent = () => {
        switch(activeSection) {
            case 'profile':
                return <TeacherProfile userInfo={userInfo} />;
            case 'eventmaker':
                return <Calendar />;
            case 'defenseschedule':
                return <DefenseSchedule />;
            case 'review-submissions':
                return <ReviewSubmission />;
            case 'student-list':
                return <StudentList />;
            case 'comment-docs':
                return <CommentDocs />;
            case 'dashboard':
            default:
                return (
                    <>
                        <header className="header">
                            <div className="user-info">
                                <h1>Welcome, {userInfo?.name}</h1>
                                <p>Teacher ID: {userInfo?.teacherId || 'N/A'}</p>
                            </div>
                            <img className="profile-picture" src={userInfo?.image} alt={userInfo?.name} />
                        </header>

                        <section className="status-cards">
                            <div className="status-card">
                                <h3>Pending Reviews</h3>
                                <p className="count">
                                    {submissions.filter(sub => sub.status === 'pending').length}
                                </p>
                            </div>
                            <div className="status-card">
                                <h3>Students Assigned</h3>
                                <p className="count">{submissions.length}</p>
                            </div>
                            <div className="status-card">
                                <h3>Upcoming Defenses</h3>
                                <p className="count">3</p>
                            </div>
                        </section>

                        <section className="dashboard-sections">
                            <section className="submissions-section">
                                <h2>Recent Submissions to Review</h2>
                                {loading ? (
                                    <p>Loading submissions...</p>
                                ) : (
                                    <table className="submissions-table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Members</th>
                                                <th>Student Email</th>
                                                <th>Submission Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.filter(sub => sub.status === 'pending').length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{textAlign: 'center'}}>
                                                        No pending submissions to review
                                                    </td>
                                                </tr>
                                            ) : (
                                                submissions
                                                    .filter(sub => sub.status === 'pending')
                                                    .map((submission) => (
                                                        <tr key={submission._id}>
                                                            <td>{submission.title}</td>
                                                            <td>{submission.members.join(', ')}</td>
                                                            <td>{submission.email || 'N/A'}</td>
                                                            <td>{formatDate(submission.createdAt)}</td>
                                                            <td>
                                                                <span className={`status-${submission.status.toLowerCase()}`}>
                                                                    {submission.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <a 
                                                                    href={submission.docsLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn-view"
                                                                >
                                                                    View
                                                                </a>
                                                                <button 
                                                                    className="btn-feedback"
                                                                    onClick={() => setFeedbackForm({ ...feedbackForm, thesisId: submission._id })}
                                                                >
                                                                    Add Feedback
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </section>

                            <section className="notifications-section">
                                <h2>Notifications ({unreadCount})</h2>
                                <button className="btn-toggle-notifications" onClick={() => setShowNotifications(!showNotifications)}>
                                    {showNotifications ? 'Hide' : 'Show'} Notifications
                                </button>
                                {showNotifications && (
                                    <TeacherNotification
                                        notifications={notifications}
                                        markAsRead={markAsRead}
                                    />
                                )}
                            </section>

                            {feedbackForm.thesisId && renderFeedbackForm()}
                        </section>
                    </>
                );
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <TeacherTopbar 
                userInfo={userInfo}
                unreadCount={unreadCount}
                handleLogout={handleLogout}
            />
            <div className="d-flex flex-grow-1">
                <TeacherNavbar 
                    activeSection={activeSection} 
                    handleSectionChange={handleSectionChange} 
                />
                
                {/* Main Content */}
                <div className="flex-grow-1 p-4">
                    <Routes>
                        <Route path="/dashboard" element={renderContent()} />
                        <Route path="/profile" element={<TeacherProfile userInfo={userInfo} />} />
                        <Route path="/defenseschedule" element={<DefenseSchedule />} />
                        <Route path="/review-submissions" element={<ReviewSubmission />} />
                        <Route path="/comment-docs" element={<CommentDocs />} />
                        <Route path="/docs" element={<Docs />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/send-gmail" element={<SendGmail />} />
                        <Route path="/schedule" element={<ScheduleTable />} />
                        <Route path="*" element={<Navigate to="/teacher-dashboard/dashboard" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
