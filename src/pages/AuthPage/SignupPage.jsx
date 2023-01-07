import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import { signup } from "../../services/auth/authService";
import { initialSignupCredState, notify } from "../../utils";
import { AuthInfoSection } from "./AuthInfoSection";

export const SignupPage = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [signupCred, setSignupCred] = useState(initialSignupCredState);
  const navigate = useNavigate();
  useEffect(() => {
    auth?.isLoggedIn && navigate("/");
  }, [auth]);
  return (
    <>
      {auth.status === "loading" && (
        <Loader status={"Please wait until you are signed up"} />
      )}
      <div className="w-full grid place-content-center md:place-content-center sm:place-content-start     min-h-screen bg-lightBlue bg-opacity-5">
        <div className="flex flex-row flex-wrap items-center justify-center md:gap-16   sm:mt-10 md:mt-0 gap-4">
          <AuthInfoSection />

          <form
            className="block p-6 rounded-lg shadow-2xl bg-white sm:w-96 w-fit m-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (signupCred.password !== signupCred.confirmPassword) {
                notify("Please confirm your password", "error");
                return;
              } else {
                dispatch(signup(signupCred));
              }
            }}
          >
            <div className="form-group mb-4">
              <label
                htmlFor="exampleInputEmail2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Full name
              </label>
              <input
                value={signupCred.name}
                onChange={(e) =>
                  setSignupCred({ ...signupCred, name: e.target.value })
                }
                type="text"
                className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label
                htmlFor="exampleInputEmail2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Email address
              </label>
              <input
                value={signupCred.email}
                onChange={(e) =>
                  setSignupCred({ ...signupCred, email: e.target.value })
                }
                type="email"
                className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label
                htmlFor="exampleInputPassword2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                value={signupCred.password}
                onChange={(e) => {
                  setSignupCred({ ...signupCred, password: e.target.value });
                }}
                type="password"
                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
                id="exampleInputPassword2"
                placeholder="Password"
                minLength={6}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label
                htmlFor="exampleInputPassword2"
                className="form-label inline-block mb-2 text-gray-700"
              >
                Confirm password
              </label>
              <input
                value={signupCred.confirmPassword}
                onChange={(e) => {
                  setSignupCred({
                    ...signupCred,
                    confirmPassword: e.target.value,
                  });
                }}
                type="password"
                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none"
                id="exampleInputPassword2"
                placeholder="Confirm password"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="
      w-full
      px-6
      py-2.5
      bg-primary
      text-white
      font-medium
      text-base
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-primary hover:shadow-lg
      focus:bg-primary focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-primary active:shadow-lg
      transition
      duration-150
      ease-in-out"
            >
              Sign up
            </button>

            <p className="text-gray-800 mt-2 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary focus:text-primary transition duration-200 ease-in-out"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
