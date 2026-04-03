import { useState } from "react";

const API_URL = import.meta.env('API_URL');

export default function PostCreateForm() {
    const [ post, setPost ] = useState({
        content: '',
        image_url: ''
    });
    const [ error, setError ] = useState('');

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/posts/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });
            if (response.ok) {
                alert('You successfully created post!');
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Something went wrong!');
            }
        } catch (error) { setError(error.message); }
    };

    return (
        <form onSubmit={handleCreatePost}>

            <h2>Post Create</h2>
            {error && <p>{error}</p>}

            <input
                type="text"
                placeholder="Enter content"
                value={post.content}
                onChange={e => setPost({ ...post, [e.target.name]: e.target.value })}
                />

            <input
                type="text"
                placeholder="Enter content"
                value={post.image_url}
                onChange={e => setPost({ ...post, [e.target.name]: e.target.value })}
                />

            <button type={'submit'}>
                Create
            </button>
        </form>
    )
}