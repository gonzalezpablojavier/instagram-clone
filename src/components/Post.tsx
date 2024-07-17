// src/components/Post.tsx
import React from 'react';

interface PostProps {
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
}

const Post: React.FC<PostProps> = ({ username, userImage, postImage, caption }) => {
  return (
    <div className="bg-white shadow-md my-4">
      <div className="flex items-center p-4">
        <img src={userImage} alt={username} className="w-10 h-10 rounded-full mr-4" />
        <p className="font-bold">{username}</p>
      </div>
      <img src={postImage} alt="post" className="w-full" />
      <div className="p-4">
        <p><span className="font-bold mr-2">{username}</span>{caption}</p>
      </div>
    </div>
  );
};

export default Post;
