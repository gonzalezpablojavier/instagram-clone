// src/components/Reconocemos.tsx
import React from 'react';

const posts = [
  {
    id: 1,
    user: {
      name: 'Agustin',
      time: 'Hace 35 min',
      profileImage: 'https://via.placeholder.com/50',
    },
    recognition: {
      title: 'INNOVACIÓN',
      image: 'https://loremflickr.com/200/100',
      recipient: {
        name: 'Marce Zarate',
        description: 'Si bien es pasante, trabaja a la par del equipo, con muchas ganas y buenas ideas.',
        profileImage: 'https://via.placeholder.com/50',
      },
      reactions: {
        likes: 14,
        claps: 10,
        stars: 2,
        thumbsUp: 2,
        smileys: 2,
      },
      commentsCount: 4,
    },
  },
  {
    id: 2,
    user: {
      name: 'Pablin',
      time: 'Hace 35 min',
      profileImage: 'https://via.placeholder.com/50',
    },
    recognition: {
      title: 'TRABAJO EN EQUIPO',
      image: 'https://via.placeholder.com/200x100',
      recipient: {
        name: 'Marcos Caballero',
        description: 'Siempre dispuesto a ayudar a sus compañeros y a aportar ideas.',
        profileImage: 'https://via.placeholder.com/50',
      },
      reactions: {
        likes: 8,
        claps: 5,
        stars: 1,
        thumbsUp: 3,
        smileys: 4,
      },
      commentsCount: 3,
    },
  },
];

const Reconocemos: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex items-center mb-4">
            <img
              src={post.user.profileImage}
              alt={post.user.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-bold">{post.user.name}</p>
              <p className="text-sm text-gray-500">{post.user.time}</p>
            </div>
          </div>
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">{post.recognition.title}</h2>
            <img
              src={post.recognition.image}
              alt={post.recognition.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
          <div className="flex items-center mb-4">
            <img
              src={post.recognition.recipient.profileImage}
              alt={post.recognition.recipient.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-bold">{post.recognition.recipient.name}</p>
              <p className="text-sm">{post.recognition.recipient.description}</p>
            </div>
          </div>
          <div className="flex justify-around mb-4">
            <button className="flex items-center space-x-1">
              <span role="img" aria-label="like">👍</span>
              <span>{post.recognition.reactions.likes}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span role="img" aria-label="clap">👏</span>
              <span>{post.recognition.reactions.claps}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span role="img" aria-label="star">⭐</span>
              <span>{post.recognition.reactions.stars}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span role="img" aria-label="thumbs up">👍</span>
              <span>{post.recognition.reactions.thumbsUp}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span role="img" aria-label="smiley">😊</span>
              <span>{post.recognition.reactions.smileys}</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{post.recognition.commentsCount} comentarios</p>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-200 rounded-full">✏️</button>
              <button className="p-2 hover:bg-gray-200 rounded-full">🗑️</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reconocemos;
