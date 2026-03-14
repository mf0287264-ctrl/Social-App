import { Eye, EyeSlash, Message } from "iconsax-reactjs";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios } from "axios";
import { BeatLoader } from "react-spinners";
import { contToken } from "../../Context/ContextToken";
import { Helmet } from "react-helmet";

export default function Register() {
  //context test
  // let { num } = useContext(cont1);
  // console.log(num);
  const [isShown, setIsShown] = useState(true);
  const [isShown2, setIsShown2] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const nav = useNavigate();

  function eyeShown() {
    setIsShown(!isShown);
  }
  function eyeShown2() {
    setIsShown2(!isShown2);
  }
  let schemaSignUp = z
    .object({
      name: z
        .string("name is required")
        .min(3, "name mini is 3")
        .max(15, "name max is 15"),
      email: z.email("plz enter valid email"),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        ),
      rePassword: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        ),
      dateOfBirth: z.string(),
      gender: z.enum(["male", "female"]),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "password and raPassword does not matching",
      path: ["rePassword"],
    });
  const {
    handleSubmit,
    register,
    formState: { errors, dirtyFields },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    mode: "all",
    resolver: zodResolver(schemaSignUp),
  });
  //send data to API
  async function handelSubmit(data) {
    // console.log(data);
    try {
      setBtnLoading(true);
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup`,
        data,
      );
      console.log(res.data);
      setSuccessMsg(res.data.message); // for now is should be setSuccessMsg(res.data.message)
      setTimeout(() => {
        nav("/login");
      }, 2000);
      // console.log(res);
      // console.log(res.data);
    } catch (error) {
      // console.log(error.response.data.error);
      // console.log(error);
      console.log(error.response.data.message);
      setErrorMsg(error.response.data.message); // for now is should be setErrorMsg(error.response.data.error);
    } finally {
      setBtnLoading(false);
    }
  }
  function setErrorNull() {
    setErrorMsg(null);
  }

  // const password = watch("password");
  return (
    <>
      <Helmet>
        <title> Reginser</title>
      </Helmet>
      <div className=" flex items-center justify-center">
        <div className="bg-white w-4/12 p-5 shadow-xl rounded-xl ">
          {successMsg ? (
            <div className="text-center rounded-2xl bg-green-400  text-white text-xl font-semibold">
              {successMsg}
            </div>
          ) : (
            ""
          )}
          {errorMsg ? (
            <div className="text-center  bg-amber-400 rounded-2xl text-white text-xl font-semibold">
              {errorMsg}
            </div>
          ) : (
            ""
          )}

          <h2 className="text-blue-600 font-extrabold text-3xl text-center">
            Create An Account
          </h2>
          <p className="text-gray-500 font-semibold text-center">
            join to the comunity and start sharing 🚀
          </p>
          <form
            onChange={setErrorNull}
            onSubmit={handleSubmit(handelSubmit)}
            className="my-4"
          >
            {/* username */}
            <div className="my-3">
              <label htmlFor="name" className="text-xl font-semibold my-2">
                UserName
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                placeholder="usename"
                {...register("name")}
              />
              {errors.name && dirtyFields.name && (
                <p className="inputError">*{errors.name.message}</p>
              )}
            </div>

            {/* email */}
            <div className="my-3">
              <label htmlFor="email" className="text-xl font-semibold my-2">
                email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="example@email.com"
                {...register("email")}
              />
              {errors.email && dirtyFields.email && (
                <p className="inputError">{errors.email.message}</p>
              )}
            </div>
            {/* password */}
            <div className="my-3">
              <label htmlFor="password" className="text-xl font-semibold my-2">
                password
              </label>
              <div className=" relative">
                <input
                  type={isShown ? "password" : "text"}
                  id="password"
                  name="password"
                  className="input"
                  placeholder="password"
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
            {/* confirm Password */}
            <div className="my-3">
              <label
                htmlFor="confirmPassword"
                className="text-xl font-semibold my-2"
              >
                confirm Password
              </label>
              <div className="relative">
                <input
                  type={isShown2 ? "password" : "text"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input"
                  placeholder="password"
                  {...register("rePassword")}
                />
                {isShown2 ? (
                  <EyeSlash
                    className="absolute top-[50%] right-2 translate-[-50%] cursor-pointer"
                    onClick={eyeShown2}
                  />
                ) : (
                  <Eye
                    className="absolute top-[50%] right-2 translate-[-50%] cursor-pointer"
                    onClick={eyeShown2}
                  />
                )}
              </div>

              {errors.rePassword && dirtyFields.rePassword && (
                <p className="inputError">{errors.rePassword.message}</p>
              )}
            </div>
            {/* birth date */}
            <div className="my-3">
              <label htmlFor="birthDate" className="text-xl font-semibold my-2">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="input"
                placeholder="birthdata"
                {...register("dateOfBirth")}
              />

              {errors.dateOfBirth && dirtyFields.dateOfBirth && (
                <p className="inputError">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* gender */}
            <div className="my-3">
              <h3 className="text-xl font-semibold my-3"> gender</h3>

              <input
                type="radio"
                id="male"
                className="me-1"
                value={"male"}
                name="gender"
                {...register("gender")}
              />
              <label htmlFor="male" className="me-2 text-xl">
                male
              </label>

              <input
                type="radio"
                id="female"
                className="me-1"
                value={"female"}
                name="gender"
                {...register("gender")}
              />
              <label htmlFor="female" className="me-2 text-xl">
                female
              </label>
            </div>

            {btnLoading ? (
              <button disabled className="my-4 btn bg-gray-300 text-white">
                <BeatLoader />
              </button>
            ) : (
              <button className="my-4 btn">Create An Account</button>
            )}

            <p className="text-gray-700 text-center">
              <span className="me-2">already have an account?</span>
              <Link className="text-blue-700 font-bold" to="/login">
                Login now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
