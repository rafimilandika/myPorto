// src/components/ProjectList.js
import React, { useState, useEffect } from "react";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Mengambil data dari file JSON di folder public
        const response = await fetch("/projects.json");
        if (!response.ok) {
          throw new Error("Gagal memuat data proyek.");
        }
        const data = await response.json();
        setProjects(data); // Simpan data ke state
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) return <div>Memuat daftar proyek...</div>;
  if (error) return <div>Terjadi kesalahan: {error}</div>;

  return (
    <div>
      <h1>Daftar Proyek</h1>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.nama}</h2>
          <p>{project.detail}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
