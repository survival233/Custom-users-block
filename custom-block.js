// Register a custom Gutenberg block named 'Custom User Block'
wp.blocks.registerBlockType('custom/custom-block', {
    title: __('Custom User Block', 'custom-user-block'),
    icon: 'hammer',
    category: 'design',
    attributes: {
        selectedUserId: { type: 'number' },
        users: { type: 'array' },
    },
    edit: function(props) {
        // Function to handle updating selected user ID
        function updateSelectedUser(event) {
            props.setAttributes({ selectedUserId: parseInt(event.target.value) });
        }

        // Function to load user biography
        function loadBiography(userId) {
            wp.ajax.post('load_user_biography', { user_id: userId })
                .done(response => {
                    if (response.success) {
                        // Display biography (handle response.data.biography)
                    } else {
                        console.error(__('Error:', 'custom-user-block'), response.data.message);
                    }
                })
                .fail(error => {
                    console.error(__('Error: Failed to load biography', 'custom-user-block'));
                });
        }

        // Render the block's editing interface
        return wp.element.createElement(
            'div',
            null,
            wp.element.createElement(
                'div',
                null,
                wp.element.createElement(
                    'label',
                    null,
                    __('Select User', 'custom-user-block')
                ),
                wp.element.createElement('br'),
                wp.element.createElement(
                    'select',
                    { value: props.attributes.selectedUserId, onChange: updateSelectedUser },
                    wp.element.createElement(
                        'option',
                        { value: '' },
                        __('Select a user', 'custom-user-block')
                    ),
                    props.attributes.users.map(user => (
                        wp.element.createElement(
                            'option',
                            { key: user.id, value: user.id },
                            user.name
                        )
                    ))
                )
            ),
            wp.element.createElement(
                'button',
                { onClick: () => loadBiography(props.attributes.selectedUserId) },
                __('Load User\'s Biography', 'custom-user-block')
            )
        );
    },
    save: function() {
        // This block doesn't have a dynamic frontend representation
        return null;
    }
});

// Function to fetch users with emails ending in "@rgbc.dev"
function fetchUsers() {
    return wp.apiFetch({ path: '/wp/v2/users', method: 'GET' })
        .then(users => users.filter(user => user.email.endsWith('@rgbc.dev')));
}

// AJAX endpoint for fetching user biography
function loadUserBiography(userId) {
    // Implement the biography loading logic here
}
