import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import * as z from "zod";
import { contToken } from "../../Context/ContextToken";
import { contextId } from "../../Context/contextId";
import { contextPass } from "../../Context/ContextPass";
export default function Login() {
  const [isShown, setIsShown] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { setUserImage } = useOutletContext();
  const { setUserName } = useOutletContext();
  const { setUserPass } = useContext(contextPass);
  const nav = useNavigate();
  function eyeShown() {
    setIsShown(!isShown);
  }
  let { setToken } = useContext(contToken);
  let { setLogedInUser } = useContext(contextId);
  const schemaLogin = z.object({
    email: z.email("please enter valid email"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      ),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schemaLogin),
  });
  async function dataSubmited(data) {
    // console.log(data.password);
    try {
      setBtnLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signin`,
        data,
      );
      console.log(res.data);
      nav("/home");
      const token = res.data.data.token;
      const logedInUser = res.data.data.user._id;
      console.log(logedInUser);
      localStorage.setItem("userImage", res.data.data.user.photo);
      setUserImage(res.data.data.user.photo);
      localStorage.setItem("userName", res.data.data.user.name);
      setUserName(res.data.data.user.name);
      localStorage.setItem("token", token);
      localStorage.setItem("logedInUser", logedInUser);
      setToken(token);
      setLogedInUser(logedInUser);
      setUserPass(data.password);
      localStorage.setItem("userPass", data.password);
    } catch (error) {
      // console.log(error.response);
      setErrorMsg(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }
  // console.log(import.meta.env.VITE_API_URL);
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex justify-center items-center">
        <div className="bg-white w-4/12 p-5 shadow-xl rounded-2xl  ">
          {errorMsg ? (
            <div className="text-center  bg-amber-400 rounded-2xl text-white text-xl font-semibold">
              {errorMsg}
            </div>
          ) : (
            ""
          )}

          <h2 className="text-blue-600 font-extrabold text-3xl text-center">
            Log in
          </h2>
          <p className="text-gray-500 font-semibold text-center">
            join the comunity and start sharing 🚀
          </p>

          <form onSubmit={handleSubmit(dataSubmited)} className="my-4">
            {/* email */}
            <div className="my-5">
              <label htmlFor="email" className="text-xl font-semibold my-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="example@gmail.com"
                {...register("email")}
              />
              {errors.email && dirtyFields.email && (
                <p className="inputError">{errors.email.message}</p>
              )}
            </div>
            {/* password */}
            <div className="my-5">
              <label htmlFor="password" className="text-xl font-semibold my-2">
                password
              </label>
              <div className="relative">
                <input
                  type={isShown ? "password" : "text"}
                  id="password"
                  className="input"
                  placeholder="Enter the Password"
                  {...register("password")}
                />
                {isShown ? (
                  <EyeSlash
                    className="absolute top-[50%] right-2 translate-[-50%] cursor-pointer"
                    onClick={eyeShown}
                  />
                ) : (
                  <Eye
                    className="absolute top-[50%] right-2 translate-[-50%] cursor-pointer"
                    onClick={eyeShown}
                  />
                )}
              </div>
              {errors.password && dirtyFields.password && (
                <p className="inputError">{errors.password.message}</p>
              )}
            </div>

            {btnLoading ? (
              <button disabled className="btn my-4">
                <BeatLoader />
              </button>
            ) : (
              <button className="btn my-4">Login</button>
            )}

            <p className="text-gray-700 text-center">
              <span className="me-2">don't have an account?</span>

              <Link className="text-blue-700 font-bold" to="/register">
                Register now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
