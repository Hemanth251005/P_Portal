import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './ProjectsPage.css';

function ProjectsPage({ onLogout }) {
  const [role, setRole] = useState(null);
  const [batch, setBatch] = useState(null);
  const [projects, setProjects] = useState([]);

  // ✅ Vercel Backend Base URL
  const baseURL = "https://p-portal-6b4f.vercel.app";


  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userBatch = localStorage.getItem("batch");

    if (!userRole) {
      onLogout();
      return;
    }

    if (userRole === "student" && !userBatch) {
      onLogout();
      return;
    }

    setRole(userRole);
    setBatch(userBatch);

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [onLogout]);

  const uploadProject = async () => {
    const projectLinkInput = document.getElementById("project-link");
    const projectLink = projectLinkInput.value.trim();

    if (!projectLink) {
      alert("Please enter a GitHub link.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/projects`, {
        batch: batch,
        projectLink: projectLink,
      });

      setProjects([...projects, response.data]);
      projectLinkInput.value = "";
      alert("✅ Project submitted successfully!");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project.");
    }
  };

  const evaluateProject = async (index) => {
    const marksInput = document.getElementById(`marks-${index}`);
    const marks = marksInput.value;

    if (marks === "") {
      alert("Please enter marks.");
      return;
    }

    try {
      const projectId = projects[index]._id;
      const response = await axios.put(`${API_BASE}/projects/${projectId}`, {
        marks: marks,
      });

      const updatedProjects = projects.map((project, i) =>
        i === index ? response.data : project
      );

      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error evaluating project:", error);
      alert("Failed to evaluate project.");
    }
  };

  return (
    <>
      <h1 className="main-heading">Project Portal</h1>

      {role === "student" && (
        <div id="student-section">
          <h2>Submit Your Project</h2>
          <p>
            Batch: <span id="batch-number">{batch}</span>
          </p>
          <input
            type="url"
            id="project-link"
            placeholder="Enter GitHub link (e.g., https://github.com/user/repo)"
          />
          <button onClick={uploadProject}>Submit</button>
        </div>
      )}

      {role === "faculty" && (
        <div id="faculty-section">
          <h2>Evaluate Projects</h2>
          <table>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Project Link</th>
                <th>Status</th>
                <th>Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{project.batch}</td>
                  <td>
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.projectLink}
                    </a>
                  </td>
                  <td
                    className={
                      project.status === "Complete"
                        ? "status-complete"
                        : "status-pending"
                    }
                  >
                    {project.status}
                  </td>
                  <td>{project.marks || "-"}</td>
                  <td>
                    <input
                      type="number"
                      id={`marks-${index}`}
                      placeholder="Marks"
                      style={{ width: "60px" }}
                    />
                    <button onClick={() => evaluateProject(index)}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

ProjectsPage.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default ProjectsPage;
