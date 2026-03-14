import Axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import PostCard from "../component/post/PostCard";
import MySkeleton from "../component/post/MySkeleton";
import { contToken } from "../Context/ContextToken";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FaFile } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { token } = useContext(contToken);
  const textInput = useRef(null);
  const fileInput = useRef(null);
  const [viewImage, setViewImage] = useState(null);
  const {
    data: queryData,
    isError,
    isFetched,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: getAllPosts,
    queryKey: ["queryPost"],
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 3,
  });
  function getAllPosts() {
    return Axios(`${import.meta.env.VITE_API_URL}/posts?limit=50`, {
      headers: {
        token: token,
      },
      method: "GET",
    });
  }

  function imageHandler() {
    // console.log(fileInput.current.files[0]);
    const imgPreview = URL.createObjectURL(fileInput.current.files[0]);
    // fileInput.current.files[0] = imgPreview;
    setViewImage(imgPreview);
  }
  function deleteImg() {
    setViewImage(null);
    fileInput.current.value = "";
  }

  function createNewPost() {
    const formData = new FormData();
    if (textInput.current.value) {
      formData.append("body", textInput.current.value);
    }
    if (fileInput.current.files[0]) {
      formData.append("image", fileInput.current.files[0]);
    }

    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: {
        token: token,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createNewPost,
    onSuccess: () => {
      onOpenChange(false);
      textInput.current.value = "";
      fileInput.current.value = "";
      setViewImage(null);
      refetch();
      toast.success("Post created sucssesfully 🎉", {
        position: "top-center",
      });
    },
  });
  if (isLoading) {
    return (
      <div className="flex flex-col items-center pb-96">
        <MySkeleton />
        <MySkeleton />
        <MySkeleton />
        <MySkeleton />
      </div>
    );
  }
  if (isError) {
    return <h1> ERROR</h1>;
  }
  return (
    <div className="">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        <Button className="w-1/2 text-gray-500 m-auto block" onPress={onOpen}>
          whats in your mind...
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  create new post
                </ModalHeader>
                <ModalBody>
                  <label htmlFor="caption">Caption : </label>
                  <textarea
                    name="caption"
                    id="caption"
                    className="border rounded-lg p-3"
                    rows={3}
                    ref={textInput}
                  ></textarea>
                  <input
                    type="file"
                    id="inputPost"
                    ref={fileInput}
                    onChange={imageHandler}
                    hidden
                  />
                  <label
                    htmlFor="inputPost"
                    className="flex items-center p-3 bg-gray-300 w-fit rounded-xl"
                  >
                    <span className="me-1">choose image</span> <FaFile />
                  </label>
                  {viewImage && (
                    <div className="relative">
                      <img src={viewImage} alt="photo" />
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
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button disabled={isPending} color="primary" onPress={mutate}>
                    {isPending ? <BeatLoader /> : <span>Post</span>}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {queryData.data.data.posts?.map((item) => (
        <PostCard key={item._id} item={item} isHome={true} />
      ))}
    </div>
  );
}
