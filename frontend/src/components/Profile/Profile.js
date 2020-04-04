import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import displayFlash from "../../utils/flashEvent";

import Loading from "../Loading/Loading";

import "./profile.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Profile = props => {
  useEffect(() => {
    if (props.authDetail.isAuthenticated) {
      axios
        .get(baseUrl + "user/get-user-detail", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.authDetail.token}`
          },
          params: {
            username: `${props.match.params.username}`
          }
        })
        .then(response => {
          const userDetail = {
            userId: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName
          };
          let tempState = { ...state };
          tempState.userDetail = { ...userDetail };
          setState(tempState);
        })
        .catch(error => {});
    }
  }, [props.authDetail.isAuthenticated]);

  const [state, setState] = useState({
    authUserId: props.authDetail.userId,
    userDetail: null,
    userService: 0,
    groupName: ""
  });

  const createGroup = () => {
    let tempState = { ...state };
    tempState.userService = 0;
    setState(tempState);
  };

  const joinGroup = () => {
    let tempState = { ...state };
    tempState.userService = 1;
    setState(tempState);
  };

  const handleSubmit = e => {
    e.preventDefault();

    axios
      .post(
        baseUrl + "group/create-new-group",
        JSON.stringify({ groupName: state.groupName.trim() }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("chat_auth_token") ||
              sessionStorage.getItem("chat_auth_token")}`
          },
          withCredentials: true
        }
      )
      .then(response => {
        displayFlash.emit("get-message", {
          message: response.data.message,
          type: "success"
        });
        props.history.push(`/chat/${response.data.groupName}`);
      })
      .catch(error => {
        error.response
          ? displayFlash.emit("get-message", {
              message: error.response.data.message,
              type: "danger"
            })
          : displayFlash.emit("get-message", {
              message: `Network Error, Connection to server couldn't be established. Please try again.`,
              type: "danger"
            });
      });
  };

  return !state.userDetail ? (
    <div className="container">
      <div className="main-wrapper">
        <div style={{ margin: "auto", width: "80px", marginTop: "50px" }}>
          <Loading isTrue={!state.userDetail} />
        </div>
      </div>
    </div>
  ) : (
    <div className="profile-wrapper">
      <div className="container">
        <div className="main-wrapper">
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="profile-container">
                <div className="card">
                  <div className="card-head">
                    <h3>
                      {state.userDetail
                        ? state.authUserId === state.userDetail.userId
                          ? `Your Profile`
                          : `${state.userDetail.firstName} ${state.userDetail.lastName}'s Profile`
                        : "Your Profile"}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="short-summary">
                      <div className="user-img">
                        <img
                          src={require("../../assets/images/user.png")}
                          alt="user-img"
                          width="100px"
                          height="100px"
                        />
                      </div>
                      <div className="user-name">
                        <h3>
                          {state.userDetail
                            ? `${state.userDetail.firstName} ${state.userDetail.lastName}`
                            : ``}
                        </h3>
                      </div>
                    </div>
                    <div className="detail-summery">
                      <div className="heading">
                        <h3>About</h3>
                      </div>
                      <div className="content">
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <div className="label">
                              <label>Username:</label>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="value">
                              {state.userDetail
                                ? `${state.userDetail.username}`
                                : ``}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <div className="label">
                              <label>Name:</label>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="value">
                              {state.userDetail
                                ? `${state.userDetail.firstName} ${state.userDetail.lastName}`
                                : ``}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            <div className="label">
                              <label>Email:</label>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="value">
                              {state.userDetail
                                ? `${state.userDetail.email}`
                                : ``}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="service-container">
                <div className="card">
                  <div className="card-head">
                    <h3>Say Hello!</h3>
                  </div>
                  <div
                    className={`card-body ${
                      state.authUserId === state.userDetail.userId
                        ? "d-block"
                        : "d-none"
                    }`}
                  >
                    <div className="service-btn">
                      <div className="create-room-btn">
                        <button
                          className="btn btn-primary"
                          onClick={createGroup}
                        >
                          Create Group
                        </button>
                      </div>
                      <div className="join-room-btn">
                        <button
                          className="btn btn-secondary"
                          onClick={joinGroup}
                        >
                          Join Group
                        </button>
                      </div>
                    </div>
                    <div className="service">
                      <div className="create-group-form">
                        <form></form>
                      </div>
                      <div className="join-group-form">
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label>Group Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="groupName"
                              value={state.groupName}
                              required
                              placeholder="group name should be min length of 5"
                              minLength="5"
                              onChange={e => {
                                let tempState = { ...state };
                                tempState.groupName = e.target.value;
                                setState(tempState);
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            className={`btn btn-success ${
                              state.userService === 0 ? "d-block" : "d-none"
                            }`}
                          >
                            Create Group
                          </button>
                          <button
                            type="submit"
                            className={`btn btn-success ${
                              state.userService === 1 ? "d-block" : "d-none"
                            }`}
                          >
                            Join Group
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="inbox-link mt-5">
                      <Link to="/chat">
                        <button className="btn btn-info">
                          Go to your inbox &rarr;
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
