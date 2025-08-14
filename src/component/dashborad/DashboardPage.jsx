import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage({ onLogout }) {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isTambahTools, setIsTambahTools] = useState(false);
  const [jenisTools, setJenisTools] = useState(null);
  const [namaTools, setNamaTools] = useState("");
  const [keahlian, setKeahlian] = useState(0);
  const [toolPhotoFile, setToolPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditTools, setIsEditTools] = useState(false);
  const [isTambahProjects, setIsTambahProjects] = useState(false);

  const [projectData, setProjectData] = useState({
    nama: "",
    detail: "",
    linkGithub: "",
    selectedTools: [],
  });
  const [projectImages, setProjectImages] = useState([]);

  const API_POST_TOOLS = "http://localhost:5000/api/tools";
  const API_POST_PROJECTS = "http://localhost:5000/api/projects";

  const jenisKeahlianOptions = [
    { id: 1, nama: "FRONT END" },
    { id: 2, nama: "BACKEND" },
    { id: 3, nama: "DATABASE" },
    { id: 4, nama: "Development Tools & Software" },
  ];

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tools");
        setTools(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchTools();

    if (jenisKeahlianOptions.length > 0) {
      setJenisTools(jenisKeahlianOptions[0].id); // Set ke ID dari opsi pertama (misal: 1 untuk FRONT END)
    }
  }, [successMessage]);

  const handleSubmitTools = async (e) => {
    e.preventDefault();
    if (
      !jenisTools ||
      !namaTools ||
      keahlian < 0 ||
      keahlian > 100 ||
      !toolPhotoFile
    ) {
      setError(
        "Semua field harus diisi dengan benar, dan keahlian harus antara 0-100."
      );
      return;
    }
    const formDataTools = new FormData();
    formDataTools.append("jenis_skill_id", jenisTools);
    formDataTools.append("nama", namaTools);
    formDataTools.append("keahlian", keahlian);
    formDataTools.append("gambar", toolPhotoFile);

    try {
      const response = await axios.post(API_POST_TOOLS, formDataTools, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage(response.data.message || "Tool berhasil ditambahkan!");
      setNamaTools("");
      setKeahlian(0);
      setToolPhotoFile(null);
      setIsTambahTools(false);
    } catch (error) {
      console.error(
        "Error saat menambahkan tool:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Gagal menambahkan tool.");
    }
  };
  const handleTambahTools = async () => {
    setIsTambahTools((prev) => !prev);
    if (!isTambahTools) {
      // Jika akan ditampilkan (sebelumnya false)
      setError("");
      setSuccessMessage("");
      setJenisTools(jenisKeahlianOptions[0].id); // Reset ke default
      setNamaTools("");
      setKeahlian(0);
      setToolPhotoFile(null);
    }
  };
  const handleEditTolls = async (id) => {
    setIsEditTools(true);
    setSelectedTool(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/editTools/${id}`
      );
      setSelectedTool(response.data.data);
    } catch (error) {
      setSelectedTool(null);
      setIsEditTools(false);
    }
  };

  const handleSubmitEditTool = async () => {
    // alert(selectedTool.keahlian);
    // alert(toolPhotoFile);
    // e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formDataTools = new FormData();
    formDataTools.append("jenis_skill_id", selectedTool.jenis_skill_id);
    formDataTools.append("nama", selectedTool.nama);
    formDataTools.append("keahlian", selectedTool.keahlian);
    formDataTools.append("gambar", toolPhotoFile);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tools/${selectedTool.id}`,
        formDataTools,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage(response.data.message || "Tool berhasil diedit!");
      setSelectedTool(null); // Reset data tool yang sedang diedit
      setToolPhotoFile(null); // Reset input file
      setIsEditTools(false);
    } catch (error) {
      console.error(
        "Error saat mengedit tool:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Gagal mengedit tool.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToolChange = (e) => {
    const toolId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setProjectData((prevData) => {
      if (isChecked) {
        // Tambahkan ID jika belum ada
        return {
          ...prevData,
          selectedTools: [...prevData.selectedTools, toolId],
        };
      } else {
        // Hapus ID jika tidak dicentang
        return {
          ...prevData,
          selectedTools: prevData.selectedTools.filter((id) => id !== toolId),
        };
      }
    });
  };

  const handleImageChange = (e) => {
    // e.target.files adalah FileList, ubah jadi array
    setProjectImages(Array.from(e.target.files));
  };

  const handleSubmitProjects = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", projectData.nama);
    formData.append("detail", projectData.detail);
    formData.append("linkGithub", projectData.linkGithub);
    formData.append("selectedTools", JSON.stringify(projectData.selectedTools));
    projectImages.forEach((imageFile, index) => {
      formData.append(`images`, imageFile);
    });

    try {
      const response = await axios.post(API_POST_PROJECTS, formData, {
        headers: {},
      });
      setSuccessMessage(
        response.data.message || "Projects berhasil ditambahkan!"
      );
      setProjectData({
        nama: "",
        detail: "",
        linkGithub: "",
        selectedTools: [],
      });
      setProjectImages([]);
      setIsTambahProjects(false);
    } catch (error) {
      console.error(
        "Error saat menambahkan projects:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Gagal menambahkan projects.");
    }
  };

  const handleKembaliProjects = (e) => {
    e.preventDefault();
    setProjectData({
      nama: "",
      detail: "",
      linkGithub: "",
      selectedTools: [],
    });
    setProjectImages([]);
    setIsTambahProjects(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button onClick={onLogout}>Logout</button>
      <h1>Dashboard Admin</h1>
      <div
        className="skills-admin"
        style={{
          backgroundColor: "#a4b8eaff",
          height: 350 + "px",
          overflowY: "auto",
        }}
      >
        <h1>SKILLS</h1>
        <button onClick={handleTambahTools}>tambah Skill</button>
        {isTambahTools && (
          <>
            <h2>form tambah tools</h2>
            <form onSubmit={handleSubmitTools}>
              <label htmlFor="">jenis keahlian</label>
              <select
                id=""
                name="jenis_keahlian"
                value={jenisTools}
                onChange={(e) => setJenisTools(parseInt(e.target.value))}
              >
                {jenisKeahlianOptions.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.nama}
                  </option>
                ))}
              </select>
              <label htmlFor="">nama</label>
              <input
                type="text"
                value={namaTools}
                onChange={(e) => setNamaTools(e.target.value)}
              />
              <label htmlFor="">keahlian</label>
              <select
                name="keahlian"
                id="keahlian"
                value={keahlian}
                onChange={(e) => setKeahlian(parseInt(e.target.value))} // Pastikan jadi integer
              >
                {Array.from({ length: 101 }, (_, i) => i).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <div>
                <label htmlFor="gambarTool">Gambar Tool (Icon):</label>
                <input
                  type="file"
                  id="gambarTool"
                  onChange={(e) => setToolPhotoFile(e.target.files[0])} // Ambil objek File pertama
                  required
                />
                {toolPhotoFile && <p>File terpilih: {toolPhotoFile.name}</p>}
              </div>
              <button type="submit">Simpan</button>
              <button type="button" onClick={() => setIsTambahTools(false)}>
                Batal
              </button>
            </form>
          </>
        )}

        {isEditTools && selectedTool && (
          <>
            <h2>form edit tools</h2>
            <form onSubmit={() => handleSubmitEditTool(selectedTool.id)}>
              <>
                <label htmlFor="">jenis keahlian</label>
                <select
                  id=""
                  name="jenis_keahlian"
                  value={selectedTool.jenis_skill_id}
                  onChange={(e) =>
                    setSelectedTool((prevTool) => ({
                      ...prevTool,
                      jenis_skill_id: e.target.value,
                    }))
                  }
                >
                  {jenisKeahlianOptions.map((jenis) => (
                    <option key={jenis.id} value={jenis.id}>
                      {jenis.nama}
                    </option>
                  ))}
                </select>
                <label htmlFor="">nama</label>
                <input
                  type="text"
                  value={selectedTool.nama}
                  onChange={(e) =>
                    setSelectedTool((prevTool) => ({
                      ...prevTool,
                      nama: e.target.value,
                    }))
                  }
                />
                <label htmlFor="">keahlian</label>
                <select
                  name="keahlian"
                  id="keahlian"
                  value={selectedTool.keahlian}
                  onChange={(e) =>
                    setSelectedTool((prevTool) => ({
                      ...prevTool,
                      keahlian: e.target.value,
                    }))
                  }
                >
                  {Array.from({ length: 101 }, (_, i) => i).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <div>
                  <label htmlFor="gambarTool">Gambar Tool (Icon):</label>
                  <input
                    type="file"
                    id="gambarTool"
                    onChange={(e) => setToolPhotoFile(e.target.files[0])} // Ambil objek File pertama
                    required
                  />
                  {toolPhotoFile && <p>File terpilih: {toolPhotoFile.name}</p>}
                </div>
                <button type="submit">Simpan</button>
                <button type="button" onClick={() => setIsEditTools(false)}>
                  Batal
                </button>
              </>
            </form>
          </>
        )}

        {tools.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>jenis tools</th>
                <th>Nama tools</th>
                <th>keahlian</th>
                <th>gambar</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id}>
                  <td>{tool.id}</td>
                  <td>{tool.jenis_skill_nama}</td>
                  <td>{tool.nama}</td>
                  <td>{tool.keahlian}</td>
                  <td>
                    {tool.gambar && (
                      <img
                        src={`http://localhost:5000${tool.gambar}`}
                        alt={tool.nama}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditTolls(tool.id)}>
                      Edit
                    </button>
                    <button>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          ""
        )}
      </div>
      <div
        className="project_admin"
        style={{
          height: 400 + "px",
          backgroundColor: "green",
          overflowY: "auto",
        }}
      >
        <h1>PROJECTS</h1>
        <button onClick={() => setIsTambahProjects(true)}>
          tambah projects
        </button>
        {isTambahProjects && (
          <>
            {/* on submitnya nanti aja */}
            <form onSubmit={handleSubmitProjects}>
              <label htmlFor="">nama project</label>
              <input
                type="text"
                name="nama" // Nama harus sesuai dengan properti di state projectData
                value={projectData.nama}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="">detail project</label>
              <textarea
                id=""
                style={{ width: 500 + "px", height: 100 + "px" }}
                name="detail" // Nama harus sesuai dengan properti di state projectData
                value={projectData.detail}
                onChange={handleInputChange}
                required
              ></textarea>
              <label htmlFor="">link github</label>
              <input
                type="text"
                name="linkGithub" // Nama harus sesuai dengan properti di state projectData
                value={projectData.linkGithub}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
              <div
                className="tools"
                style={{
                  backgroundColor: "white",
                }}
              >
                {tools.map((tool) => (
                  <>
                    <input
                      type="checkbox"
                      value={tool.id}
                      name="toolsUsed"
                      onChange={handleToolChange}
                      // Pastikan checkbox tercentang jika ID tool ada di projectData.selectedTools
                      checked={projectData.selectedTools.includes(tool.id)}
                    />
                    {tool.nama}
                  </>
                ))}
              </div>
              <input
                type="file"
                name="images" // Nama untuk input file
                multiple // Atribut ini memungkinkan pemilihan banyak file
                onChange={handleImageChange}
                accept="image/*"
              />
              {projectImages.length > 0 && (
                <p>Terpilih: {projectImages.length} file gambar</p>
              )}
              <button type="submit">simpan</button>
            </form>
            <button onClick={handleKembaliProjects}>kembali</button>
          </>
        )}
      </div>
    </div>
  );
}
