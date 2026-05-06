import { useCallback, useEffect, useState } from "react";
import API from "../../api/api";
import "./MemberManager.css";

export default function MemberManager({ projectId }) {
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projects/${projectId}/members`);
      setMembers(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load members.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      await API.post(`/projects/${projectId}/members`, {
        email: email.trim().toLowerCase(),
      });
      
      setEmail("");
      setSuccess("Member added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchMembers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to add member. The teammate must create an account before they can be added."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      setLoading(true);
      setError("");
      
      await API.delete(`/projects/${projectId}/members/${memberId}`);
      
      setSuccess("Member removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchMembers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to remove member.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchMembers();
  }, [projectId, fetchMembers]);

  return (
    <div className="member-manager">
      {/* Add Member Form */}
      <div className="add-member-card">
        <h3>Add Team Member</h3>
        <p>Add a teammate by the email they used to sign up.</p>

        <form onSubmit={addMember} className="add-member-form">
          <div className="form-group">
            <label htmlFor="email">Member Email *</label>
            <input
              type="email"
              id="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <small className="field-hint">
              The member must already have a registered account.
            </small>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !email.trim()}
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Members List */}
      <div className="members-list-card">
        <h3>Team Members ({members.length})</h3>

        {loading && members.length === 0 ? (
          <div className="loading-state">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <p>No members yet. Add your first team member above!</p>
          </div>
        ) : (
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-item">
                <div className="member-info">
                  <div className="member-avatar">
                    {(member.user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="member-details">
                    <h4>{member.user?.name || "Unknown User"}</h4>
                    <p>{member.user?.email || "No email"}</p>
                  </div>
                </div>

                <div className="member-actions">
                  <span className={`role-badge role-${member.role.toLowerCase()}`}>
                    {member.role}
                  </span>
                  {member.role !== "ADMIN" && (
                    <button
                      onClick={() => removeMember(member.userId)}
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                      title="Remove member"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
