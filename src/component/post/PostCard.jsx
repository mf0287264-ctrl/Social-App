import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import {
  FaBookmark,
  FaComment,
  FaFile,
  FaRegBookmark,
  FaShare,
} from "react-icons/fa";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { contToken } from "../../Context/ContextToken";
import { BeatLoader, ClipLoader } from "react-spinners";
import { contextId } from "../../Context/contextid";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { toast } from "react-toastify";
export default function PostCard({ item, isHome, allComments, isProfile }) {
  const { logedInUser } = useContext(contextId);
  const [showComment, setShowComment] = useState(false);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [viewImage, setViewImage] = useState(item.image);
  const [veiwText, setVeiwText] = useState(item.body);
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [likesCount, setLikesCount] = useState(item.likesCount);
  const [isBookMarked, setIsBookMarked] = useState(
    localStorage.getItem(`postBookMark${item._id}`) === "true",
  );
  const followKey = `follow_${item.user._id}`;
  const [isFollowed, setIsFollowed] = useState(() => {
    return localStorage.getItem(followKey) === "true";
  });
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onOpenChange: onOpenChangeUpdate,
  } = useDisclosure();
  // console.log(allComments);
  const inputRef = useRef(null);
  const { token } = useContext(contToken);
  const textInput = useRef(null);
  const fileInput = useRef(null);

  // console.log(item);
  function displayComment() {
    setShowComment(!showComment);
  }
  function postComment() {
    const userComment = inputRef.current.value;
    const formData = new FormData();
    formData.append("content", userComment);
    return axios.post(
      `https://route-posts.routemisr.com/posts/${item._id}/comments`,
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${item._id}`, {
      headers: {
        token: token,
      },
    });
  }

  const { isPending: isPendingForDelete, mutate: deleteUserPost } = useMutation(
    {
      mutationFn: deletePost,
      onSuccess: function () {
        queryClient.invalidateQueries("queryUserPosts");
        toast.success("post deleted successfully");
        onOpenChange(false);
      },
    },
  );
  const { isPending, mutate } = useMutation({
    mutationFn: postComment,
    onSuccess: function () {
      inputRef.current.value = "";
      queryClient.invalidateQueries("queryComments", item._id);
    },
    onError(e) {
      console.log(e);
    },
  });
  function updatePost() {
    const formData = new FormData();
    if (textInput.current.value) {
      formData.append("body", textInput.current.value);
    }
    if (fileInput.current.files[0]) {
      formData.append("image", fileInput.current.files[0]);
    } else if (viewImage === null) {
      formData.append("removeImage", true);
    }

    return axios.put(
      `${import.meta.env.VITE_API_URL}/posts/${item._id}`,
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { isPending: isPendingUpdate, mutate: mutateUpdate } = useMutation({
    mutationFn: updatePost,
    onSuccess: function () {
      queryClient.invalidateQueries("queryComments", item.post);
      onOpenChangeUpdate(false);
      toast.success("post updated succesfully");
    },
    onError: function (e) {
      console.log(e);
    },
  });
  function imageHandler() {
    const imgPreview = URL.createObjectURL(fileInput.current.files[0]);
    setViewImage(imgPreview);
  }
  function deleteImg() {
    setViewImage(null);
    fileInput.current.value = "";
  }
  function textHandler(e) {
    setVeiwText(e);
  }

  function putPostLikes() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${item._id}/like`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: putLikeMutate, isPending: putLikeIsPending } = useMutation({
    mutationFn: putPostLikes,
    onSuccess: function (data) {
      queryClient.invalidateQueries("queryPost");
      setIsLiked(data.data.data.liked);
      setLikesCount(data.data.data.likesCount);
    },
  });

  function followUser() {
    return axios.put(
      `https://route-posts.routemisr.com/users/${item.user._id}/follow`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: mutateFollow, isPending: isPendingFollow } = useMutation({
    mutationFn: followUser,
    onSuccess: function () {
      const newState = !isFollowed;
      setIsFollowed(newState);
      localStorage.setItem(followKey, newState.toString());
      queryClient.invalidateQueries("queryUserProfile");
    },
  });

  function putBookMark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${item._id}/bookmark`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: mutatePutBookMark, isPending: isPendingPutBookMark } =
    useMutation({
      mutationFn: putBookMark,
      onSuccess: function (res) {
        queryClient.invalidateQueries(["queryPost"]);
        queryClient.invalidateQueries({ queryKey: ["queryUserProfile"] });
        console.log(res);
        setIsBookMarked(res.data.data.bookmarked);
        localStorage.setItem(
          `postBookMark${item._id}`,
          res.data.data.bookmarked,
        );
      },
    });
  return (
    <Card key={item.id} className="w-[700px] mx-auto my-5 p-3">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src={item.user.photo} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {item.user.name}
            </h4>

            <h5 className="text-small tracking-tight text-default-400">
              {isHome || isProfile ? (
                <Link to={"/postdetailes/" + item._id}>
                  {new Date(item.createdAt).toLocaleString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  })}
                </Link>
              ) : (
                <>
                  {new Date(item.createdAt).toLocaleString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  })}
                </>
              )}
            </h5>
          </div>
          <div className="cursor-pointer" onClick={mutatePutBookMark}>
            {isBookMarked ? (
              isPendingPutBookMark ? (
                <ClipLoader size={20} />
              ) : (
                <FaBookmark />
              )
            ) : isPendingPutBookMark ? (
              <ClipLoader size={20} />
            ) : (
              <FaRegBookmark />
            )}
          </div>

          {item.user._id === logedInUser ? (
            ""
          ) : isPendingFollow ? (
            <BeatLoader />
          ) : (
            <Button
              className={
                isFollowed
                  ? "bg-transparent text-foreground border-default-200"
                  : ""
              }
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? "bordered" : "solid"}
              onPress={mutateFollow}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {item.user._id === logedInUser ? (
          <>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  <MdEdit />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem onPress={onOpenUpdate} key="edit">
                  Edit Post
                </DropdownItem>
                <DropdownItem
                  onPress={onOpen}
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete post
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      delete post
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you sure you want to delete this post ? </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={deleteUserPost}>
                        {isPendingForDelete ? (
                          <BeatLoader />
                        ) : (
                          <span>delete</span>
                        )}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>

            <Modal isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      update the post
                    </ModalHeader>
                    <ModalBody>
                      <label htmlFor="caption">Caption : </label>
                      <textarea
                        name="caption"
                        id="caption"
                        className="border rounded-lg p-3"
                        rows={3}
                        ref={textInput}
                        value={veiwText}
                        onChange={(e) => textHandler(e.target.value)}
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
                      <Button
                        disabled={isPendingUpdate}
                        color="primary"
                        onPress={mutateUpdate}
                      >
                        {isPendingUpdate ? <BeatLoader /> : <span>Post</span>}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        ) : (
          ""
        )}
      </CardHeader>
      <CardBody className="px-3  py-0 text-small text-default-400">
        <p className="mb-4">{item.body}</p>
        {item.image ? (
          <Image
            className="w-9/10 m-auto rounded-xl mb-4"
            src={item.image}
            alt=""
          />
        ) : (
          ""
        )}
      </CardBody>
      <CardFooter className="flex justify-around gap-3">
        <div className="flex items-center gap-1 cursor-pointer">
          <Button
            className={isLiked ? "bg-blue-200" : ""}
            disabled={putLikeIsPending}
            onPress={putLikeMutate}
          >
            <p className="font-semibold text-default-400 text-small">
              <AiFillLike className={isLiked ? "text-blue-500" : ""} />
            </p>
            <p className=" text-default-400 text-small">
              {putLikeIsPending ? (
                <span>....</span>
              ) : (
                <span className={isLiked ? "text-blue-400" : ""}>like</span>
              )}
            </p>
            <span className={isLiked ? "text-blue-400" : "text-gray-600"}>
              {likesCount}
            </span>
          </Button>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={displayComment}
        >
          <p className="font-semibold text-default-400 text-small">
            <FaComment />
          </p>
          <p className="text-default-400 text-small">comment</p>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="font-semibold text-default-400 text-small">
            <FaShare />
          </p>
          <p className="text-default-400 text-small">share</p>
        </div>
      </CardFooter>
      {showComment ? (
        <div className="w-full mt-5 relative">
          <input
            type="text"
            ref={inputRef}
            className="w-full border-2 bg-slate-200 border-gray-400 p-5 rounded-2xl text-gray-800"
            placeholder="Enter comment..."
          />
          {isPending ? (
            <ClipLoader className="bg-linear-to-tr from-blue-500 to-slate-500 text-white shadow-lg absolute top-3 right-3" />
          ) : (
            <Button
              className="bg-linear-to-tr from-blue-500 to-slate-500 text-white shadow-lg absolute top-3 right-3"
              radius="full"
              onPress={mutate}
            >
              post Comment
            </Button>
          )}
        </div>
      ) : (
        ""
      )}
      <hr className="text-gray-200 w-8/10 m-auto shadow" />
      {/* {console.log(item)} */}

      {item.topComment && <Comment data={item.topComment} isTop={true} />}
      {allComments?.map((commet) =>
        item.topComment?._id == commet._id ? (
          ""
        ) : (
          <Comment data={commet} key={commet._id} />
        ),
      )}
    </Card>
  );
}
