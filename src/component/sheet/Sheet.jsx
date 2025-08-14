import { useEffect, useRef, useState } from "react";

export default function Sheet() {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tools, setTools] = useState([]);
  const [jenisToolFilter, setJenisToolFilter] = useState(1);
  const [jenisTools, setJenisTools] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectsTools, setProjectsTools] = useState([]);
  const [projectsGambar, setProjectsGambar] = useState([]);
  const [ProjectsFilter, setProjectsFilter] = useState(2);
  const [totalProject, setTotalProject] = useState("");

  const scrollY = useRef(null);

  const nama = "RAFI MILANDIKA YUWANDA";

  useEffect(() => {
    const fetchJenisTool = async () => {
      try {
        const response = await fetch("/jenis_skill.json");
        const data = await response.json();

        const selectedJenisTool = data.find(
          (tool) => tool.id === String(jenisToolFilter)
        );
        if (selectedJenisTool) {
          setJenisTools(selectedJenisTool.nama);
        }
      } catch (error) {
        console.error("Error fetching jenis tools:", error);
      }
    };
    fetchJenisTool();
  }, [jenisToolFilter]);
  //-------------------------------------------------------------
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const [toolsRes, relasiRes] = await Promise.all([
          fetch("/tools.json"),
          fetch("/jenis_skill_tools.json"),
        ]);
        const toolsData = await toolsRes.json();
        const relasiData = await relasiRes.json();

        const toolsFilteredByJenis = relasiData
          .filter((relasi) => relasi.jenis_skill_id === String(jenisToolFilter))
          .map((relasi) => relasi.tools_id);

        const finalTools = toolsData.filter((tool) =>
          toolsFilteredByJenis.includes(tool.id)
        );

        setTools(finalTools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    fetchTools();
  }, [jenisToolFilter]);

  //------------------------------------------------------------

  useEffect(() => {
    const fetchTotalProjects = async () => {
      try {
        const response = await fetch("/projects.json");
        const data = await response.json();
        setTotalProject(data.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchTotalProjects();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, projectsToolsRes, projectsGambarRes, toolsRes] =
          await Promise.all([
            fetch("/projects.json"),
            fetch("/projects_tools.json"),
            fetch("/projects_gambar.json"),
            fetch("/tools.json"),
          ]);
        const projectsData = await projectsRes.json();
        const projectsToolsData = await projectsToolsRes.json();
        const projectsGambarData = await projectsGambarRes.json();
        const toolsData = await toolsRes.json();

        const selectedProject = projectsData.find(
          (project) => project.id === String(ProjectsFilter)
        );
        if (selectedProject) {
          setProjects(selectedProject);
        } else {
          setProjects({});
        }

        const filteredProjectsTools = projectsToolsData.filter(
          (tool) => tool.projects_id === String(ProjectsFilter)
        );

        const mergedProjectsTools = filteredProjectsTools.map((relasi) => {
          const toolDetails = toolsData.find(
            (tool) => tool.id === relasi.tools_id
          );
          return {
            ...relasi,
            ...toolDetails,
          };
        });

        setProjectsTools(mergedProjectsTools);

        const filteredProjectsGambar = projectsGambarData.filter(
          (gambar) => gambar.projects_id === String(ProjectsFilter)
        );
        setProjectsGambar(filteredProjectsGambar);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchData();
  }, [ProjectsFilter]);

  const handleKlikGambarProject = (e) => {
    const gambar = e.target.src;
    const fotoSampul = document.querySelector(".project_detail .foto img");
    fotoSampul.setAttribute("src", gambar);
    if (gambar === fotoSampul.src) {
      const gambarPreview = document.querySelectorAll(".project_previews img");
      gambarPreview.forEach((img) => {
        img.classList.remove("active");
      });
      e.target.classList.add("active");
    }
  };
  const handleKlikPrev = (e) => {
    if (window.innerWidth <= 768) {
      return;
    }
    const gambar = e.target.src;
    setIsPreviewActive(true);
    setActiveImage(gambar);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setIsPreviewActive(false);
    setActiveImage(null);
    document.body.style.overflow = "";
  };
  const handleMouseEnter = (event) => {
    const skillName = event.target.dataset.skillName;
    setHoveredSkill(skillName);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
  };

  const handleMouseMove = (event) => {
    if (hoveredSkill) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const nextJenisTools = async (e) => {
    if (jenisToolFilter >= 4) {
      setJenisToolFilter(1);
    } else {
      setJenisToolFilter(jenisToolFilter + 1);
    }
  };
  const prefJenisTools = async (e) => {
    if (jenisToolFilter <= 1) {
      setJenisToolFilter(4);
    } else {
      setJenisToolFilter(jenisToolFilter - 1);
    }
  };
  const handleProjectsNext = async (e) => {
    if (ProjectsFilter >= totalProject + 1) {
      setProjectsFilter(2);
    } else {
      setProjectsFilter(ProjectsFilter + 1);
    }
  };
  const handleProjectsPref = async (e) => {
    if (ProjectsFilter <= 2) {
      setProjectsFilter(totalProject + 1);
    } else {
      setProjectsFilter(ProjectsFilter - 1);
    }
  };

  return (
    <>
      <div className={isPreviewActive ? "bg_black" : ""}></div>
      <div className="sheets">
        <div className="project_preview">
          {isPreviewActive && (
            <>
              <div className="closePrevew" onClick={closePreview}>
                X
              </div>
              <div className="preview">
                <img src={activeImage} alt="" />
              </div>
            </>
          )}
        </div>
        <div className="home" id="home">
          <div className="pattern">
            <img src="/asset/pattern2.png" alt="" />
          </div>
          <div className="topbar">
            <div className="logo">
              <img src="/asset/logo.png" alt="" />
            </div>
            <div className="nav">
              <button>
                <a href="#home">Home</a>
              </button>
              <button>
                <a href="#projects">Projects</a>
              </button>
              <button>
                <a href="#aboutme">About Me</a>
              </button>
              <button>
                <a href="#contact">Contact</a>
              </button>
            </div>
          </div>
          <div className="home_content">
            <div className="title">
              <h1>
                {nama.split("").map((char, index) => (
                  <span key={index} className="animated-char">
                    {char}
                  </span>
                ))}
              </h1>
              <h2>WEB DEVELOPER</h2>
              <h3>
                Transforming ideas into complete digital experiences. I'm Rafi,
                a Full-stack Web Developer with expertise in developing
                comprehensive web applications, from back-end architecture to
                engaging user interfaces.{" "}
              </h3>
            </div>
            <div className="photo">
              <img src="/asset/photo2.png" alt="" />
            </div>
            <div className="gradient"></div>
            <div className="gradient-square"></div>
          </div>
        </div>
        <div className="projects" id="projects">
          <div className="pattern_projects">
            <img src="/asset/pattern2.png" alt="" />
          </div>
          <div className="judul">PROJECTS</div>
          <div className="projects_content">
            <div className="pref">
              <button onClick={handleProjectsPref}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>
            <div className="project">
              <div className="project_detail">
                <div className="foto">
                  <img
                    onClick={handleKlikPrev}
                    src={
                      projectsGambar.length > 0 && projectsGambar[0]
                        ? `/uploads/${projectsGambar[0].gambar
                            .split("/")
                            .pop()}`
                        : ""
                    }
                    alt=""
                  />
                </div>
                <div className="detail">
                  <h1>{projects.nama}</h1>
                  <h2>{projects.detail}</h2>
                  <div className="tools">
                    {projectsTools.map((projectsTool) => (
                      <img
                        key={projectsTool.id}
                        src={
                          projectsTool.gambar
                            ? `/uploads/${projectsTool.gambar.split("/").pop()}`
                            : ""
                        }
                        alt=""
                      />
                    ))}
                  </div>
                  <div className="seeGitHub">
                    <button>
                      <a
                        href={projects.link_github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See GitHub
                      </a>
                    </button>
                  </div>
                </div>
              </div>
              <div className="project_previews" ref={scrollY}>
                {projectsGambar.map((projectGambar) => (
                  <img
                    key={projectGambar.id}
                    src={
                      projectGambar.gambar
                        ? `/uploads/${projectGambar.gambar.split("/").pop()}`
                        : ""
                    }
                    onClick={handleKlikGambarProject}
                    alt=""
                  />
                ))}
              </div>
            </div>
            <div className="next">
              <button onClick={handleProjectsNext}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="aboutMe" onMouseMove={handleMouseMove} id="aboutme">
          <div className="gradient-aboutMe"></div>
          <div className="pattern_aboutMe">
            <img src="/asset/pattern2.png" alt="" />
          </div>
          <div className="judul">ABOUT ME</div>
          <div className="aboutMe_content">
            <div className="foto">
              <div className="glass">
                <img src="/asset/photo2.png" alt="" />
              </div>
            </div>
            <div className="content">
              <div className="explain">
                <h1>
                  Hello! I'm RAFI, a dedicated Full-stack Web Developer who
                  loves transforming raw ideas into fully functional and
                  impactful digital products. My goal is to leverage technology
                  to craft truly seamless user experiences.
                </h1>
              </div>
              <div className="skills">
                <h1>TECHNICAL SKILL</h1>
                <div className="skill-group">
                  <h1>{jenisTools}</h1>
                  <div className="skill">
                    <div className="pref">
                      <button onClick={prefJenisTools}>
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                    </div>
                    <div className="skill-list">
                      {tools.map((tool, index) => (
                        <div key={index} className="list">
                          <img
                            src={
                              tool.gambar
                                ? `/uploads/${tool.gambar.split("/").pop()}`
                                : ""
                            }
                            alt=""
                            data-skill-name={tool.nama}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          />
                          <div className="bar">
                            <div className="fullbar">
                              <div
                                className="skill-level"
                                style={{ width: tool.keahlian + "%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hoveredSkill && (
                        <div
                          className="skillName"
                          style={{
                            top: mousePosition.y - 520 + "px",
                            left: mousePosition.x - 660 + "px",
                          }}
                        >
                          {hoveredSkill}
                        </div>
                      )}
                    </div>
                    <div className="next">
                      <button onClick={nextJenisTools}>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contact" id="contact">
          <div className="gradient-contact"></div>
          <div className="pattern_contact">
            <img src="/asset/pattern2.png" alt="" />
          </div>
          <div className="judul_contact">
            <h1>LET'S</h1>
            <h1>CONNECT</h1>
          </div>
          <div className="contact_content">
            <div className="contact_detail">
              <h1>RAFI MILANDIKA YUWANDA</h1>
              <h2>
                Ready to bring your ideas to life? Let's talk about how I can
                help. I'm excited to hear from you!
              </h2>
              <div className="social-media">
                <a
                  href="https://www.linkedin.com/in/rafimilandika/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a
                  href="https://github.com/rafimilandika"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="https://www.instagram.com/rafi_milandika/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-square-instagram"></i>
                </a>
              </div>
            </div>
            <div className="contact_nav">
              <h1>NAVIGATION</h1>
              <div className="nav_contact">
                <button>
                  <a href="#home">Home</a>
                </button>
                <button>
                  <a href="#projects">Projects</a>
                </button>
                <button>
                  <a href="#aboutme">About Me</a>
                </button>
                <button>
                  <a href="#contact">Contact</a>
                </button>
              </div>
            </div>
            <div className="contact_contact">
              <h1>CONTACT</h1>
              <div className="email">
                <i className="fa-solid fa-envelope"></i>
                <p>rafimlandika@gmail.com</p>
              </div>
              <div className="phone">
                <i className="fa-solid fa-phone"></i>
                <p>+62 812-3456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
