import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client"

const PUBLISH_POST = gql`
  mutation postPublish($postId: ID!){
    postPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`

const UNPUBLISH_POST = gql`
  mutation postUnpublish($postId: ID!){
    postUnpublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
      }
    }
  }
`

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [postPublish, { data, loading }] = useMutation(PUBLISH_POST)
  const [postUnpublish, { data: unpublishData, loading: unpublishLoading }] = useMutation(UNPUBLISH_POST)

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <p className="Post__publish" 
          onClick={() => {
            postPublish({
              variables: {
                postId: id,
              }
            })
          }}>
          publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p className="Post__publish" onClick={() => {
          postUnpublish({
            variables: {
              postId: id,
            }
          })
        }}>
          unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
