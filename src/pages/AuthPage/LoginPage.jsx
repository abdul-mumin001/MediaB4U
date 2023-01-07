import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthButton, InputSection, LinkButton, Loader } from "../../components";
import { login } from "../../services/auth/authService";
import { GUEST_CREDENTIAL, initialLoginCredState } from "../../utils";
import { AuthInfoSection } from "./AuthInfoSection";
export const LoginPage = () => {
  const dispatch = useDispatch();
  const [loginCred, setLoginCred] = useState(initialLoginCredState);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    auth?.isLoggedIn && navigate("/");
  }, [auth, navigate]);
  return (
    <>
      {auth.status === "loading" && (
        <Loader status={"Please wait until you are logged in"} />
      )}
      <div className="w-full grid place-content-center md:place-content-center sm:place-content-start     min-h-screen bg-lightBlue bg-opacity-5">
        <div className="flex flex-row flex-wrap items-center justify-center md:gap-16   sm:mt-10 md:mt-0 gap-4">
          <AuthInfoSection />
          <form
            className="block p-6 rounded-lg shadow-2xl bg-white sm:w-96 w-fit m-2"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(login(loginCred));
              setLoginCred(initialLoginCredState);
            }}
          >
            <InputSection
              value={loginCred.email}
              onChange={(e) =>
                setLoginCred({ ...loginCred, email: e.target.value })
              }
              label="Email address"
              type="email"
              placeholder="email"
            />
            <InputSection
              value={loginCred.password}
              onChange={(e) =>
                setLoginCred({ ...loginCred, password: e.target.value })
              }
              label="Password"
              type="password"
              placeholder="Password"
              minLength={6}
            />

            <div className="flex flex-col gap-2">
              <AuthButton name="Log in" />
              <AuthButton
                type="button"
                name=" Guest Login"
                color="bg-secondary"
                onClick={() => {
                  setLoginCred(GUEST_CREDENTIAL);
                  dispatch(login(GUEST_CREDENTIAL));
                }}
              />
            </div>
            <p className="text-gray-800 mt-2 text-center">
              Not a member? <LinkButton to="signup" name="Signup" />
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
