import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../axios/api";
import { Link, useNavigate } from "react-router-dom";
import PlaceHolder from "../../components/PlaceHolder";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useStateContext } from "../../state/StateContext";

const Login = () => {
  const navigate = useNavigate();
  const {hostname}=useStateContext()

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleInput = ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    const tst = toast("logging in...", {
      autoClose: false,
    });
    try {
      const cred = (await api.post("/rq/login", data))?.data;
      localStorage.access = cred.token;
      api.defaults.headers.common["Authorization"] = cred.token;
      const state = localStorage.go;
      localStorage.go = "";
      state ? location.replace(state) : location.replace("/");
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    } finally {
      toast.dismiss(tst);
    }
  };

  return (
    <div className="container pt-5 darkTheme">
      <div className="row">
        <form
          onSubmit={login}
          className="col-10 col-sm-9 col-md-7 col-lg-5 shadow-md panel rounded mx-auto slideUp"
        >
          <div className="d-flex">
            <h3 className="m-auto my-3 text-center">
              <Link to={"/"}>
                <LazyLoadImage
                  effect="opacity"
                  placeholder={<PlaceHolder />}
                  src="icon.png"
                  className="rounded"
                  height={"60px"}
                  alt=""
                />{" "}
                <div> Login to {"\""+(hostname||"FSdiscover")+"\""}</div>
              </Link>
            </h3>
          </div>
          {/* <div className="form-group mb-3">
            <input
              type="email"
              className="form-control border"
              name="email"
              onChange={handleInput}
              value={data.email}
              required
              placeholder="Email"
            />
          </div> */}
          <small className="text-center mb-3 d-block">
            Enter your "FSdiscover" password to login. To check your FSdiscover
            password <br /> open the terminal and type "fsdiscover --config" to
            see your password
          </small>
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-control border"
              onChange={handleInput}
              value={data.password}
              required
              placeholder="Password"
            />
          </div>
          <button className="readmore custom-navmenu text-light growIn my-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
