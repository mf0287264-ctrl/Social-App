import { Button } from "@heroui/react";
import { User } from "@heroui/user";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { FaFire, FaHeart, FaRegHeart, FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { contToken } from "../../Context/ContextToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { contextId } from "../../Context/contextId";

export default function Comment({ data, isTop }) {
  // console.log(data);
  const [isReply, setIsReply] = useState(false);
  const { token } = useContext(contToken);
  const queryClient = useQueryClient();
  const [commentLikes, setCommentLikes] = useState(data.likes.length);
  const [commentReplys, setCommentReplys] = useState(0);
  const { logedInUser } = useContext(contextId);
  const [commentLikeSelected, setCommentLikeSelected] = useState(
    localStorage.getItem(`liked_comment_${data._id}`) === "true",
  );

  function isReplyShowen() {
    setIsReply(!isReply);
  }
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: mutateDel, isPending: isPendingDel } = useMutation({
    mutationFn: deleteComment,
    onSuccess: function () {
      queryClient.invalidateQueries("queryComments", data.post);
      toast.success("comment deleted succesfully");
    },
  });

  function commentLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/like`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: mutateCommentLike, isPending: isPendingCommentLike } =
    useMutation({
      mutationFn: commentLike,
      onSuccess: function (res) {
        console.log(res.data.data);
        setCommentLikes(res.data.data.likesCount);
        setCommentLikeSelected(res.data.data.liked);
        localStorage.setItem(`liked_comment_${data._id}`, res.data.data.liked);
      },
    });
  const replyInput = useRef(null);
  function postReply() {
    const formData = new FormData();
    formData.append("content", replyInput.current.value);
    return axios.post(
      `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/replies`,
      formData,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const { mutate: mutateReply, isPending: isPendingReply } = useMutation({
    mutationFn: postReply,
    onSuccess: function (res) {
      console.log(res);
      refetch();
      replyInput.current.value = "";
      setIsReply(false);
    },
  });

  function getReply() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/replies?page=1&limit=10`,
      {
        headers: {
          token: token,
        },
      },
    );
  }
  const {
    isLoading: isLoadingReply,
    data: dataReply,
    refetch,
  } = useQuery({
    queryKey: ["queryCommentReply", data._id],
    queryFn: getReply,
  });

  useEffect(() => {
    if (dataReply?.data?.data?.replies) {
      setCommentReplys(dataReply.data.data.replies.length);
    }
  }, [dataReply]);

  // console.log(dataReply?.data?.data.replies[0]);

  return (
    <div className="comments">
      <div className="bg-gray-200 mt-3 rounded-2xl p-3 ">
        <div className="flex justify-between items-center">
          <User
            avatarProps={{
              src: data.commentCreator.photo,
            }}
            description={data.content}
            name={data.commentCreator.username}
          />

          <div className="me-6 flex gap-4 items-center">
            <div
              className="flex flex-col items-center"
              onClick={mutateCommentLike}
            >
              {commentLikeSelected ? (
                isPendingCommentLike ? (
                  <ClipLoader size={10} />
                ) : (
                  <FaHeart className="text-red-700 cursor-pointer" />
                )
              ) : isPendingCommentLike ? (
                <ClipLoader size={10} />
              ) : (
                <FaRegHeart className="cursor-pointer" />
              )}

              <span className="text-[10px]">{commentLikes}</span>
            </div>
            {logedInUser === data.commentCreator._id ? (
              <div className="flex flex-col items-center" onClick={mutateDel}>
                {isPendingDel ? (
                  <ClipLoader size={20} color="#ff350a" />
                ) : (
                  <MdDelete className="cursor-pointer text-2xl text-red-700" />
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div
            onClick={isReplyShowen}
            className="ms-12 mt-4 text-[11px] cursor-pointer w-fit"
          >
            <FaReply />
            <span className="text-[11px] select-none">
              reply : {commentReplys}
            </span>
          </div>
          {isTop && (
            <div className="me-9 flex justify-center items-center">
              <span className="me-1 text-sm text-gray-400">top comment</span>
              <FaFire className="text-gray-500" />
            </div>
          )}
        </div>

        {isReply && (
          <div className="mt-2 relative">
            <input
              type="text"
              className="w-full border-2 bg-slate-200 border-gray-300 p-2 rounded-2xl text-gray-800"
              placeholder="Enter reply..."
              ref={replyInput}
            />
            <Button
              onPress={mutateReply}
              disabled={isPendingReply}
              className="rounded-2xl bg-linear-to-tr min-w-0 w-[60px] from-blue-500 to-slate-500 text-white shadow-lg absolute top-0 right-3"
            >
              {isPendingReply ? <ClipLoader size={20} /> : <span>post</span>}
            </Button>
          </div>
        )}
        {dataReply?.data?.data.replies.map((reply) => {
          return (
            <div
              key={reply.id}
              className="w-9/10 m-auto mt-3 border border-gray-300 p-1 rounded-2xl"
            >
              <User
                avatarProps={{
                  src: reply.commentCreator.photo,
                }}
                description={reply.content}
                name={reply.commentCreator.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
