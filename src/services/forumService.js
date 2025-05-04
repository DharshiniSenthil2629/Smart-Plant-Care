// Mock data for posts
let posts = [
  {
    id: 1,
    title: "How to care for Monstera Deliciosa",
    content: "Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular houseplant. Here are some care tips:\n\n1. Water when the top inch of soil is dry\n2. Provide bright, indirect light\n3. Maintain humidity levels of 60-80%\n4. Fertilize monthly during growing season",
    author: "PlantExpert",
    date: "2024-03-15T10:00:00Z",
    comments: [
      {
        id: 1,
        content: "Great tips! I've been struggling with my Monstera's leaves turning yellow.",
        author: "PlantLover",
        date: "2024-03-15T11:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Best soil mix for succulents",
    content: "Succulents need well-draining soil to prevent root rot. Here's my recommended mix:\n\n- 2 parts potting soil\n- 1 part coarse sand\n- 1 part perlite\n\nMix thoroughly and ensure your pots have drainage holes!",
    author: "SucculentGuru",
    date: "2024-03-14T15:45:00Z",
    comments: []
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const forumService = {
  // Get all posts
  getPosts: async () => {
    await delay(500); // Simulate network delay
    return [...posts];
  },

  // Get a single post by ID
  getPost: async (id) => {
    await delay(300);
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) {
      throw new Error('Post not found');
    }
    return { ...post };
  },

  // Create a new post
  createPost: async (postData) => {
    await delay(800);
    const newPost = {
      id: posts.length + 1,
      ...postData,
      author: "CurrentUser", // In a real app, this would come from authentication
      date: new Date().toISOString(),
      comments: []
    };
    posts.unshift(newPost);
    return { ...newPost };
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    await delay(500);
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) {
      throw new Error('Post not found');
    }

    const newComment = {
      id: post.comments.length + 1,
      ...commentData,
      author: "CurrentUser", // In a real app, this would come from authentication
      date: new Date().toISOString()
    };

    post.comments.push(newComment);
    return { ...newComment };
  }
}; 