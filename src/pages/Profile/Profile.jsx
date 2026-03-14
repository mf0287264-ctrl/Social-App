import React, { useContext, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useOutletContext } from "react-router-dom";
import { FaFile } from "react-icons/fa";
import axios from "axios";
import { contToken } from "../../Context/ContextToken";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import PostCard from "../../component/post/PostCard";
import { contextId } from "../../Context/contextId";
export default function Profile() {
  const { userImage, setUserImage } = useOutletContext();
  const { userName } = useOutletContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const imageInput = useRef(null);
  const [viewImage, setViewImage] = useState(userImage);
  const { token } = useContext(contToken);
  const { logedInUser } = useContext(contextId);
  function imageHandler() {
    const imgPreview = URL.createObjectURL(imageInput.current.files[0]);
    setViewImage(imgPreview);
  }
  function deleteImg() {
    setViewImage(null);
    imageInput.current.value = "";
  }
  function uploadPicure() {
    const formData = new FormData();
    formData.append("photo", imageInput.current.files[0]);
    return axios.put(
      "https://route-posts.routemisr.com/users/upload-photo",
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { isPending, mutate } = useMutation({
    mutationFn: uploadPicure,
    onSuccess: function (data) {
      toast.success("profile picture changed successfully ");
      const imageUrl = data.data.data.photo;
      // console.log(data.data.data.photo);
      localStorage.setItem("userImage", imageUrl);
      setUserImage(imageUrl);
      onOpenChange(true);
    },
    onError(e) {
      console.log(e);
    },
  });

  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${logedInUser}/posts`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { data, isLoading } = useQuery({
    queryFn: getUserPosts,
    queryKey: ["queryUserPosts"],
  });

  function getUserProfile() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${logedInUser}/profile`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { data: getUserData, isLoading: getUserIsLoading } = useQuery({
    queryKey: ["queryUserProfile"],
    queryFn: getUserProfile,
  });

  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: token,
      },
    });
  }
  const {
    data: getMyData,
    isLoading: getMyDataIsLoading,
    refetch,
  } = useQuery({
    queryFn: getMyProfile,
    queryKey: ["queryGetMyProfile"],
  });

  console.log(getMyData?.data.data.user.bookmarksCount);
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <div className="w-1/2 m-auto">
        <div className="profile flex gap-40">
          <div>
            <div className="w-[200px] h-[200px]">
              <img
                src={userImage}
                alt="profile picture"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <>
              <Button onPress={onOpen}>
                <span>Update your profile picture</span>
                <FaFile />
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        update picure
                      </ModalHeader>
                      <ModalBody>
                        <input
                          ref={imageInput}
                          type="file"
                          id="userPicture"
                          className="hidden"
                          onChange={imageHandler}
                        />
                        <label
                          htmlFor="userPicture"
                          className="flex items-center p-3 bg-gray-300 w-fit rounded-xl"
                        >
                          <span className="me-1">choose image</span>
                          <FaFile />
                        </label>
                        {viewImage && (
                          <div className="relative">
                            <img
                              src={viewImage}
                              alt="photo"
                              className="w-full object-cover rounded-lg"
                            />
                            <div
                              onClick={deleteImg}
                              className="cursor-pointer  absolute top-4 right-4 text-2xl text-red-600 border p-1 rounded-lg border-red-700"
                            >
                              <MdDelete />
                            </div>
                          </div>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>

                        <Button
                          disabled={isPending}
                          color="primary"
                          onPress={mutate}
                        >
                          {isPending ? <BeatLoader /> : <span>upload</span>}
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          </div>
          <div className="user info">
            <h1 className="text-4xl">hello, {userName}</h1>
            <div className="mt-3">
              email : {getUserData?.data?.data.user.email}
            </div>
            <div className="mt-15 flex gap-15">
              <div className="flex flex-col justify-center items-center text-xl text-blue-400">
                <span>followers</span>
                <span>{getMyData?.data?.data.user.followersCount}</span>
              </div>
              <div className="flex flex-col  justify-center items-center text-xl  text-blue-400">
                <span>following</span>
                <span>{getMyData?.data?.data.user.followingCount}</span>
              </div>
              <div className="flex flex-col  justify-center items-center text-xl  text-blue-400">
                <span>bookMark</span>
                <span>{getMyData?.data?.data?.user?.bookmarksCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-blue-900 mt-20">
          <Link to="/resetPassword">change your password ?</Link>
        </div>
        <div className="mt-50">
          {data?.data?.data?.posts?.map((item) => (
            <PostCard key={item._id} item={item} isProfile={true} />
          ))}
        </div>
      </div>
    </>
  );
}
