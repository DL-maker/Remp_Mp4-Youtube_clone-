
import { useRouter } from 'next/router';

// ...existing code...

const VosVideosPage = () => {
  const router = useRouter();

  const handleLike = () => {
    // ...existing code...
    router.push('/like');
  };

  // ...existing code...

  return (
    <div>
      <h1>Vos Videos Page</h1>
      <button
        onClick={handleLike}
        style={{
          display: 'block',
          margin: '10px 0',
          backgroundColor: '#007BFF',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        aria-label="Like Video"
      >
        Like
      </button>
      {/* ...existing code... */}
    </div>
  );
};

// ...existing code...

export default VosVideosPage;