import axios, { Axios } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contToken } from "../../Context/ContextToken";
import PostCard from "../../component/post/PostCard";
import MySkeleton from "../../component/post/MySkeleton";
import { div } from "framer-motion/client";
import { useQuery } from "@tanstack/react-query";
import Comment from "./../../component/post/Comment";
import { Helmet } from "react-helmet";

export default function PostDetailes() {
  const { postId } = useParams();
  const { token } = useContext(contToken);
  // const [post, setPost] = useState(null);
  // const [loading, setLoading] = useState(true);
  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        token: token,
      },
    });
    // try {
    //   const { data } = await axios.get(
    //     `https://route-posts.routemisr.com/posts/${postId}`,
    //     {
    //       headers: {
    //         token: token,
    //       },
    //     },
    //   );
    //   setPost(data.data.post);
    //   setLoading(false);
    //   console.log(data.data.post);
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }
  }
  // useEffect(() => {
  //   getSinglePost();
  // }, []);
  const { data, isError, isLoading } = useQuery({
    queryFn: getSinglePost,
    queryKey: ["querySinglePost", postId],
    gcTime: 1000 * 60,
  });

  function getAllComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
      {
        headers: {
          token: token,
        },
      },
    );
  }

  const { data: commentData, isLoading: commentLoading } = useQuery({
    queryFn: getAllComments,
    queryKey: ["queryComments", postId],
  });
  // console.log(commentData?.data.data.comments);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center pb-96">
        <div>
          <MySkeleton />
        </div>
      </div>
    );
  }
  if (isError) {
    return <h1>ERROR</h1>;
  }
  return (
    <>
      <Helmet>
        <title>post - {data.data.data.post.user.name}</title>
      </Helmet>
      <div className="flex flex-col items-center pb-96">
        <PostCard
          item={data.data.data.post}
          allComments={commentData?.data.data.comments}
        />
      </div>
    </>
  );
}
