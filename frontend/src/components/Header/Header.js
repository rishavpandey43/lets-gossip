import React from "react";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <div>
          <Link to="/">
            <span className="navbar-brand mb-0 h1">Just Chat</span>
          </Link>
        </div>
        <div>
          <ul className="navbar-nav mr-auto">
            {props.auth.isAuthenticated ? (
              <li className="nav-item active">
                <span onClick={props.logoutFetch} className="btn">
                  Logout
                </span>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
