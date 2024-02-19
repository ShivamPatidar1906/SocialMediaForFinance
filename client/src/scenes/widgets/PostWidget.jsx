import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  userId,
  isProfile
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleChange = (event) => {
    setComment(event.target.value);
    console.log(`name ${name}`);
    
  };
  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  var userName = localStorage.getItem('userName');

  const patchComment = async () =>{
    if (!comment.trim()) {
      // Show error message to the user
      alert("Please enter a comment before submitting.");
      return;
    }
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({ comment: {
        user: userName,
        content: comment
      }}),
    });
    const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment('');
  };

  const [posts, setPosts] = useState([]);

  const handleDelete = async (postId) => {
    try {
      // Send DELETE request to delete post
      await fetch(`http://localhost:3001/posts/${postId}/posts`, {
        method: 'DELETE',
      });
      // Update posts state to remove deleted post
      setPosts(posts.filter(post => post._id !== postId));
      window.location.reload(true);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const isCurrentUserPost = loggedInUserId === postUserId;
  const renderDeleteFunctionality = isProfile && isCurrentUserPost;
  const navigate = useNavigate();
  const handleNavigate = () =>{
    navigate(`/profile/${userId}`);
  }

  
  

  return (
    <WidgetWrapper m="2rem 0" onClick={() => handleNavigate}>
      <FlexBetween>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      {
       renderDeleteFunctionality && (<FontAwesomeIcon 
          icon={faTrash} 
          style={{paddingLeft: 210, color: 'red', cursor: 'pointer'}}
          onClick={() => { handleDelete(postId) }} 
        />)
      }
      {
        renderDeleteFunctionality && (
          <Typography style={{color: 'red', cursor: 'pointer'}} onClick={() => { handleDelete(postId) }}>Delete Post</Typography>
        )
      }
      </FlexBetween>
      {/* <FlexBetween>
      {
        renderDeleteFunctionality && (
          <div>
        <Button style={{marginLeft: 415}} data-bs-toggle="modal"
        data-bs-target="#exampleModal">
            Edit Post
        </Button>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Post</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <EditPost picturePath={picturePath} />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        </div>
        )
      }
      </FlexBetween> */}
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem", display: "block" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      <div style={{ width: 500 }}>
        <FlexBetween>
      <TextField
        label="Add a comment"
        variant="outlined"
        value={comment}
        fullWidth onChange={handleChange} required/>
      <Button onClick={patchComment}>Submit</Button>
      </FlexBetween>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
      </div>
    </div>
    <Button gap="0.3rem"  type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample-${postId}`} aria-expanded="false" aria-controls={`collapseExample-${postId}`} >
    <IconButton onClick={() => setShowComments(postId)}>
        <ChatBubbleOutlineOutlined />
    </IconButton>
    <Typography>{comments.length}</Typography>
</Button>
<div class="collapse" id={`collapseExample-${postId}`}>
  <div class="card card-body">
    {showComments === postId && (
      <Box mt="0.5rem">
        {comments.map((comment, i) => (
          <Box key={`${name}-${i}`} mt="0.5rem" pl="1rem" display="flex" flexDirection="column" alignItems="flex-start">
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comment.user}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: main }}>{comment.content}</Typography>
            <hr />
          </Box>
        ))}
      </Box>
    )}
  </div>
</div>


    </WidgetWrapper>
  );
};

export default PostWidget;
