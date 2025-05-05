import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiHome,
    FiLayout,
    FiLogOut,
    FiMessageSquare,
    FiPlus,
    FiSettings,
    FiTrash2,
    FiUser,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { auth, firestore } from "../firebase";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../components/UserProfile";
import Chat from "../components/Chat";
import "../styles/sidebar.css";
const statusIcons = {
    online: "🟢",
    idle: "🌙",
    dnd: "🔴",
    invisible: "⚫",
};
const Sidebar = () => {
    const [expanded, setExpanded] = useState(true);
    const [user, setUser] = useState(null);
    const [userStatus, setUserStatus] = useState("online");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [groups, setGroups] = useState([]);
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [editGroupId, setEditGroupId] = useState(null);
    const [editGroupName, setEditGroupName] = useState("");
    const [hoveringAvatar, setHoveringAvatar] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const userMenuRef = useRef(null);
    // Memoized user info
    const userInfo = useMemo(() => ({
        name: user?.displayName || user?.username || "User",
        email: user?.email,
        photoURL: user?.photoURL,
    }), [user]);
    // User data effect
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setUserStatus("online");
                return;
            }
            const userDocRef = doc(firestore, "users", currentUser.uid);
            const unsubscribeSnapshot = onSnapshot(
                userDocRef,
                (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUser(userData);
                        setUserStatus(userData.status || "online");
                    }
                },
                (error) => console.error("Error fetching user data:", error),
            );
            return unsubscribeSnapshot;
        });
        return unsubscribeAuth;
    }, []);
    // Groups data effect
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const q = query(
            collection(firestore, "groups"),
            where("members", "array-contains", currentUser.uid),
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groupList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGroups(groupList);
        });
        return unsubscribe;
    }, []);
    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const changeStatus = async (status) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.error("No user signed in");
            return;
        }
        try {
            console.log(
                `Updating status to ${status} for user ${currentUser.uid}`,
            );
            const userDocRef = doc(firestore, "users", currentUser.uid);
            // Update ONLY the status field
            await updateDoc(userDocRef, {
                status: status,
            });
            console.log("Status updated successfully");
            setUserStatus(status);
        } catch (error) {
            console.error("Status update failed:", error);
            if (error.code === "permission-denied") {
                alert(
                    "You don't have permission to update your status. Please try again.",
                );
            } else {
                alert("Error updating status: " + error.message);
            }
        }
    };
    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    const createGroup = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (!newGroupName || !currentUser?.uid) return;
        setLoading(true);
        try {
            // Create an invite code (this part remains the same)
            const inviteCode = Math.random().toString(36).substring(2, 8)
                .toUpperCase(); // e.g., 'A1B2C3'
            // Add a new group document
            const groupRef = await addDoc(collection(firestore, "groups"), {
                name: newGroupName.trim(),
                createdBy: currentUser.uid,
                members: [currentUser.uid], // Initially the creator is the only member
                admin: currentUser.uid,
                inviteCode, // Invite code for the group
                createdAt: new Date(),
            });
            // Store the group ID in the document itself (ensures easy access later)
            await updateDoc(groupRef, {
                groupId: groupRef.id, // Store the generated group ID inside the document
            });
            console.log("Group created with ID:", groupRef.id);
            setNewGroupName("");
            setGroupModalOpen(false);
        } catch (error) {
            console.error("Failed to create group:", error);
            alert(
                "Error creating group. Please check the console for more details.",
            );
        } finally {
            setLoading(false);
        }
    }, [newGroupName]);
    const joinGroup = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (!joinCode || !currentUser) return;
        setLoading(true);
        try {
            const groupSnap = await getDocs(
                query(
                    collection(firestore, "groups"),
                    where("inviteCode", "==", joinCode.trim().toUpperCase()),
                ),
            );
            if (!groupSnap.empty) {
                const groupDoc = groupSnap.docs[0];
                const groupRef = groupDoc.ref;
                const groupData = groupDoc.data();
                if (!groupData.members.includes(currentUser.uid)) {
                    await updateDoc(groupRef, {
                        members: arrayUnion(currentUser.uid),
                    });
                }
                alert(`Joined group: ${groupData.name}`);
            } else {
                alert("Invalid invite code. Please try again.");
            }
            setJoinCode("");
            setGroupModalOpen(false);
        } catch (error) {
            console.error("Error joining group:", error);
            alert("An error occurred while trying to join the group.");
        } finally {
            setLoading(false);
        }
    }, [joinCode]);
    const leaveGroup = useCallback(async (groupId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        try {
            const groupDocRef = doc(firestore, "groups", groupId);
            await updateDoc(groupDocRef, {
                members: arrayRemove(currentUser.uid),
            });
        } catch (error) {
            console.error("Error leaving group:", error);
        }
    }, []);
    const removeMember = useCallback(async (groupId, memberId) => {
        const currentUser = auth.currentUser;
        if (!currentUser || !memberId) return;
        try {
            const groupDocRef = doc(firestore, "groups", groupId);
            const groupDoc = await getDoc(groupDocRef);
            if (
                groupDoc.exists() && groupDoc.data().admin === currentUser.uid
            ) {
                await updateDoc(groupDocRef, {
                    members: arrayRemove(memberId),
                });
            }
        } catch (error) {
            console.error("Error removing member:", error);
        }
    }, []);
    const updateGroupName = useCallback(async (groupId) => {
        const trimmedName = editGroupName.trim();
        if (!trimmedName) return;
        try {
            const groupDocRef = doc(firestore, "groups", groupId);
            await updateDoc(groupDocRef, { name: trimmedName });
            setEditGroupId(null);
            setEditGroupName("");
        } catch (error) {
            console.error("Error updating group name:", error);
        }
    }, [editGroupName]);
    const statusOptions = [
        { id: "online", label: "Online" },
        { id: "away", label: "Away" },
        { id: "busy", label: "Busy" },
        { id: "offline", label: "Offline" },
    ];
    return (
        <div
            className={`sidebar ${expanded ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setHoveringAvatar(true)}
            onMouseLeave={() => setHoveringAvatar(false)}
            aria-expanded={expanded}
        >
            <div className="toggle-button">
                <button
                    onClick={() => setExpanded(!expanded)}
                    aria-label={expanded
                        ? "Collapse sidebar"
                        : "Expand sidebar"}
                >
                    {expanded ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>
            <div className="nav-links">
                <NavLink
                    to="/userdashboard"
                    className="nav-item"
                    aria-label="Go to User Dashboard"
                >
                    <FiLayout />
                    {expanded && <span>Dashboard</span>}
                    {!expanded && <div className="nav-tooltip">Dashboard</div>}
                </NavLink>
                <NavLink
                    to="/chat"
                    className="nav-item"
                    aria-label="Go to chat"
                >
                    <FiMessageSquare />
                    {expanded && <span>Chat</span>}
                    {!expanded && <div className="nav-tooltip">Chat</div>}
                </NavLink>
            </div>
            <nav className="nav-links">
                <button
                    className="nav-item"
                    onClick={() => setGroupModalOpen(true)}
                    aria-label="Create or join group"
                >
                    <FiPlus /> {expanded && <span>Create/Join Group</span>}
                    {!expanded && (
                        <div className="nav-tooltip">Create/Join Group</div>
                    )}
                </button>
                {groups.map((group) => (
                    <div key={group.id} className="group-container">
                        {editGroupId === group.id
                            ? (
                                <div className="group-edit-form">
                                    <input
                                        type="text"
                                        value={editGroupName}
                                        onChange={(e) =>
                                            setEditGroupName(e.target.value)}
                                        placeholder="New group name"
                                        aria-label="Edit group name"
                                    />
                                    <button
                                        onClick={() =>
                                            updateGroupName(group.id)}
                                        disabled={!editGroupName.trim()}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditGroupId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )
                            : (
                                <div className="group-item">
                                    <NavLink
                                        to={`/group/${group.id}`}
                                        className="nav-item"
                                        aria-label={`Go to ${group.name} group`}
                                    >
                                        <FiHome />
                                        {expanded && <span>{group.name}</span>}
                                        {!expanded && (
                                            <div className="nav-tooltip">
                                                {group.name}
                                            </div>
                                        )}
                                    </NavLink>
                                    {expanded && (
                                        <div className="group-actions">
                                            {group.admin ===
                                                    auth.currentUser?.uid && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditGroupId(
                                                                group.id,
                                                            );
                                                            setEditGroupName(
                                                                group.name,
                                                            );
                                                        }}
                                                        className="action-button"
                                                        title="Edit group name"
                                                        aria-label="Edit group name"
                                                    >
                                                        <FiEdit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            leaveGroup(
                                                                group.id,
                                                            )}
                                                        className="action-button"
                                                        title="Leave group"
                                                        aria-label="Leave group"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                ))}
            </nav>
            <div className="user-section" ref={userMenuRef}>
                <div
                    className="avatar-wrapper"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    role="button"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={showUserMenu}
                >
                    <div className="avatar">
                        {userInfo.photoURL
                            ? <img src={userInfo.photoURL} alt="User Avatar" />
                            : <BsPersonFill size={20} />}
                    </div>
                    {/* Tooltip for User Profile */}
                    {!expanded && (
                        <div className="nav-tooltip">User Profile</div>
                    )}
                </div>
                {expanded && user && (
                    <div className="user-info">
                        <div className="username">{userInfo.name}</div>
                        <div className="email">{userInfo.email}</div>
                        <div className="status">
                            {statusIcons[userStatus]} {userStatus}
                        </div>
                    </div>
                )}
                {showUserMenu && (
                    <div className="user-menu-popup">
                        <div
                            className="user-menu-option"
                            onClick={() => {
                                setShowUserMenu(false);
                                setShowUserProfile(true);
                            }}
                        >
                            <FiSettings size={16} /> User Settings
                        </div>
                        <div
                            className="user-menu-option"
                            onClick={() => {
                                setShowUserMenu(false);
                                logout();
                            }}
                        >
                            <FiLogOut size={16} /> Logout
                        </div>
                    </div>
                )}
            </div>
            {groupModalOpen && (
                <div className="modal-overlay">
                    <div className="modal" role="dialog" aria-modal="true">
                        <h3>Create or Join Group</h3>
                        <div className="modal-section">
                            <h4>Create New Group</h4>
                            <input
                                placeholder="New Group Name"
                                value={newGroupName}
                                onChange={(e) =>
                                    setNewGroupName(e.target.value)}
                                aria-label="New group name"
                            />
                            <button
                                onClick={createGroup}
                                disabled={!newGroupName.trim() || loading}
                            >
                                {loading ? "Creating..." : "Create"}
                            </button>
                        </div>
                        <div className="modal-section">
                            <h4>Join Existing Group</h4>
                            <input
                                placeholder="Join Code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                aria-label="Group join code"
                            />
                            <button
                                onClick={joinGroup}
                                disabled={!joinCode.trim() || loading}
                            >
                                {loading ? "Joining..." : "Join"}
                            </button>
                        </div>
                        <button
                            className="close-modal"
                            onClick={() => setGroupModalOpen(false)}
                            aria-label="Close modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showUserProfile && (
                <UserProfile
                    show={showUserProfile}
                    onClose={() => setShowUserProfile(false)}
                />
            )}
        </div>
    );
};
export default Sidebar;
