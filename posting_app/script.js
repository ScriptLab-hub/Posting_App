document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    const editor = document.getElementById('editor');

    // --- Application State ---
    let posts = [];

    // --- Functions ---

    /**
     * Saves the current 'posts' array to the browser's localStorage.
     */
    function savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }

    /**
     * Loads posts from localStorage and renders them on the page.
     */
    function loadPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            posts = JSON.parse(savedPosts);
            postsContainer.innerHTML = ''; // Clear the container before rendering
            const fragment = document.createDocumentFragment();
            posts.forEach(post => {
                const postElement = createPostElement(post);
                fragment.appendChild(postElement);
            });
            postsContainer.appendChild(fragment); // Append all posts at once for better performance
        }
    }

    // --- Event Listeners ---

    // Add keyboard shortcut for the main post editor.
    // Post on 'Enter', create a new line on 'Shift+Enter'.
    editor.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent creating a new line
            postForm.querySelector('button[type="submit"]').click(); // Programmatically click the submit button
        }
    });
    
    // Handle the main post form submission.
    postForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the page from reloading

        // Get user input from the form fields
        let username = document.getElementById('website-admin').value.trim();
        const postContent = document.getElementById('editor').value.trim();

        // Validate that the post content is not empty
        if (postContent === '') {
            alert('Please write something in your post to publish.');
            return; // Stop the function if content is empty
        }

        // Default to 'Anonymous' if the username is not provided
        if (username === '') {
            username = 'Anonymous';
        }

        // Create a new post object
        const newPost = {
            id: Date.now(),
            username: username,
            content: postContent,
            timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            comments: []
        };

        // Add the new post to the state
        posts.unshift(newPost);
        savePosts();

        // Render the new post on the page
        const postElement = createPostElement(newPost);
        postsContainer.prepend(postElement);

        postForm.reset(); // Reset the form fields after submission
    });

    /**
     * Creates the HTML element for a single post.
     * @param {object} post - The post object containing details like id, username, content, etc.
     * @returns {HTMLElement} The fully constructed post card element.
     */
    function createPostElement(post) {
        const postCard = document.createElement('div');
        postCard.className = 'border border-gray-400/50 rounded-xl shadow-sm p-4 bg-white/10 backdrop-blur-sm text-white';
        postCard.dataset.id = post.id; // Use data-id attribute to easily identify the post

        // The entire HTML structure for a post card
        postCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center mb-3">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <svg class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"></path>
                        </svg>
                    </div>
                    <div>
                        <span class="font-bold text-white">${post.username}</span>
                        <p class="text-xs text-gray-300">${post.timestamp}</p>
                    </div>
                </div>
                <button class="delete-btn text-gray-300 hover:text-red-500" title="Delete Post">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <p class="text-gray-200 mb-4 whitespace-pre-wrap">${post.content}</p>
            <div class="flex justify-between items-center border-t border-gray-500/50 pt-3">
                <div class="flex gap-4 text-gray-300">
                    <button class="like-btn flex items-center gap-1 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                        <span>Like</span>
                    </button>
                    <button class="comment-btn flex items-center gap-1 hover:text-blue-500">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.962 8.962 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.812 14.022A6.963 6.963 0 004 10c0-2.837 2.686-5 6-5s6 2.163 6 5-2.686 5-6 5a6.963 6.963 0 00-4.188-1.022L4.812 14.022z" clip-rule="evenodd" /></svg>
                        <span>Comment</span>
                    </button>
                </div>
            </div>

            <!-- Comments Section (Initially Hidden) -->
            <div class="comments-section hidden mt-4 pt-4 border-t border-gray-500/50">
                <div class="comments-list space-y-3 mb-3">
                    ${post.comments.map(comment => createCommentElement(comment)).join('')}
                </div>
                <div class="space-y-2">
                    <input type="text" placeholder="Your Name (Optional)" class="comment-name-input w-full bg-white/20 border-none text-white placeholder-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <div class="flex gap-2">
                        <input type="text" placeholder="Write a comment..." class="comment-input flex-grow bg-white/20 border-none text-white placeholder-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <button class="post-comment-btn bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 backdrop-blur-sm border border-white/50">Post</button>
                    </div>
                </div>
            </div>
        `;
        return postCard;
    }

    /**
     * Creates the HTML string for a single comment.
     * @param {object} comment - The comment object.
     * @returns {string} The HTML string for the comment element.
     */
    function createCommentElement(comment) {
        return `
            <div class="text-sm bg-black/20 p-3 rounded-lg" data-id="${comment.id}">
                <div class="flex justify-between items-center mb-1">
                    <p class="font-bold text-white">${comment.name}</p>
                    <p class="text-xs text-gray-400">${comment.timestamp}</p>
                </div>
                <p class="text-gray-200">${comment.text}</p>
            </div>
        `;
    }

    // Use event delegation for all clicks within the posts container for efficiency.
    postsContainer.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (!button) return;

        const postCard = button.closest('.border.rounded-xl');
        if (!postCard) return;

        const postId = Number(postCard.dataset.id);

        // Logic for the delete button
        if (button.classList.contains('delete-btn')) {
            if (confirm('Kya aap waqai is post ko delete karna chahte hain?')) {
                // Update state
                posts = posts.filter(post => post.id !== postId);
                savePosts();
                // Update DOM
                postCard.remove();
            }
        }

        // Logic for the like button
        if (button.classList.contains('like-btn')) {
            button.classList.toggle('text-red-500');
        }

        // Logic for the comment button (to show/hide the comment section)
        if (button.classList.contains('comment-btn')) {
            const commentsSection = postCard.querySelector('.comments-section');
            commentsSection.classList.toggle('hidden');
        }

        // Logic for posting a new comment
        if (button.classList.contains('post-comment-btn')) {
            const commentNameInput = postCard.querySelector('.comment-name-input');
            const commentInput = postCard.querySelector('.comment-input');
            const commentsList = postCard.querySelector('.comments-list');
            
            let commenterName = commentNameInput.value.trim();
            const commentText = commentInput.value.trim();

            // Default to 'Anonymous' if the commenter's name is not provided
            if (commenterName === '') {
                commenterName = 'Anonymous';
            }

            if (commentText === '') return;

            const newComment = {
                id: Date.now(),
                name: commenterName,
                text: commentText,
                timestamp: new Date().toLocaleString('en-US', { timeStyle: 'short' })
            };

            // Update state: Find the post in the array and add the new comment
            const postIndex = posts.findIndex(post => post.id === postId);
            if (postIndex > -1) {
                posts[postIndex].comments.push(newComment);
                savePosts();
            }

            // Update DOM: Create the new comment's HTML and add it to the list
            const commentElementHTML = createCommentElement(newComment);
            commentsList.insertAdjacentHTML('beforeend', commentElementHTML);
            commentInput.value = ''; // Clear the comment input field
        }
    });

    // Handle 'Enter' key press for submitting comments using event delegation.
    postsContainer.addEventListener('keydown', function(event) {
        // Check if the 'Enter' key was pressed inside a comment input field
        if (event.key === 'Enter' && event.target.classList.contains('comment-input')) {
            event.preventDefault(); // Prevent the default action (e.g., new line)

            // Find the corresponding 'Post' button and click it
            const buttonWrapper = event.target.parentElement;
            const postButton = buttonWrapper.querySelector('.post-comment-btn');
            if (postButton) {
                postButton.click();
            }
        }
    });

    // Initial load of posts from localStorage when the page starts.
    loadPosts();
});