// src/components/Feed.tsx
import React from 'react';
import Post from './Post';

const posts = [
  {
    id: 1,
    username: 'Fede',
    userImage: 'https://via.placeholder.com/50',
    postImage: 'https://via.placeholder.com/50',
    caption: 'Hola Amigos!'
  },
  {
    id: 2,
    username: 'Marcos',
    userImage: 'https://via.placeholder.com/50',
    postImage: 'https://via.placeholder.com/50',
    caption: 'Rompi Produccion.. :-('
  },
  // Agrega más publicaciones aquí
];

const Feed: React.FC = () => {
  return (
    <div className="p-4">
      {posts.map(post => (
        <Post
          key={post.id}
          username={post.username}
          userImage={post.userImage}
          postImage={post.postImage}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Feed;
