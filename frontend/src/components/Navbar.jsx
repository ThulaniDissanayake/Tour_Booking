import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "admin";

  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: "none",
    cursor: "not-allowed",
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "bg-dark text-white" : ""
      }`}
      style={{
        backgroundColor: darkMode ? "#121212" : "#001f3f",
        padding: "10px",
      }}
    >
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to="/"
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          Travesia
        </NavLink>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home Link */}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? "#00aced" : "white",
                })}
              >
                Home
              </NavLink>
            </li>

            {/* Tours Link */}
            <li className="nav-item" style={isAdmin ? disabledStyle : {}}>
              <NavLink
                className="nav-link"
                to="/tours"
                style={({ isActive }) => ({
                  color: isActive ? "#00aced" : "white",
                  pointerEvents: isAdmin ? "none" : "auto",
                  cursor: isAdmin ? "not-allowed" : "pointer",
                })}
                title={isAdmin ? "Disabled for admin users" : undefined}
              >
                Tours
              </NavLink>
            </li>

            {/* Links visible only to logged-in users */}
            {user && (
              <>
                {/* My Bookings */}
                <li className="nav-item" style={isAdmin ? disabledStyle : {}}>
                  <NavLink
                    className="nav-link"
                    to="/my-bookings"
                    style={({ isActive }) => ({
                      color: isActive ? "#00aced" : "white",
                      pointerEvents: isAdmin ? "none" : "auto",
                      cursor: isAdmin ? "not-allowed" : "pointer",
                    })}
                    title={isAdmin ? "Disabled for admin users" : undefined}
                  >
                    My Bookings
                  </NavLink>
                </li>

                {/* Admin-only links */}
                {isAdmin && (
                  <>
                    {/* Manage Tours */}
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        to="/admin/tours"
                        style={({ isActive }) => ({
                          color: isActive ? "#00aced" : "white",
                        })}
                      >
                        Manage Tours
                      </NavLink>
                    </li>

                    {/* All Bookings */}
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        to="/admin/bookings"
                        style={({ isActive }) => ({
                          color: isActive ? "#00aced" : "white",
                        })}
                      >
                        All Bookings
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Dark mode toggle */}
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* User dropdown or Login/Register */}
            {user ? (
              <div className="position-relative" ref={dropdownRef}>
                {/* User icon button */}
                <button
                  onClick={toggleDropdown}
                  className="btn btn-outline-light rounded-circle p-2"
                  style={{ width: "40px", height: "40px", fontSize: "18px" }}
                  title="User menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  
                  <span role="img" aria-label="user">
                    👤
                  </span>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div
                    className={`dropdown-menu dropdown-menu-end show`}
                    style={{ minWidth: "130px", right: "-10px" }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={goToProfile}
                      type="button"
                    >
                      Profile
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink className="btn btn-outline-light me-2" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-light" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
