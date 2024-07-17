// src/components/Feed.tsx
import React from 'react';
import Post from './Post';

const posts = [
  {


    id: 1,
    username: 'Fede',
    userImage: 'https://loremflickr.com/640/360',
    postImage: 'https://loremflickr.com/640/360',
    caption: 'Hola Amigos!'
  },
  {
    id: 2,
    username: 'Marcos',
    userImage: 'https://baconmockup.com/640/360',
    postImage: 'https://loremflickr.com/640/360',
    caption: 'Rompi Produccion.. :-('
  },
  {
    id: 3,
    username: 'Edu',
    userImage: 'https://loremflickr.com/640/360',
    postImage: 'https://placebear.com/640/360',
    caption: 'Hola a todos!! Rompi Produccion.. :-('
  },
  {
    id: 4,
    username: 'Marcos',
    userImage: 'https://picsum.photos/640/360',
    postImage: 'https://loremflickr.com/640/360',
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
