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
            wp.apiFetch({
                path: '/wp-admin/admin-ajax.php',
                method: 'POST',
                data: {
                    action: 'load_user_biography',
                    security: customBlockData.nonce,
                    user_id: userId
                }
            })
            .then(response => {
                if (response.success) {
                    // Display biography (handle response.data)
                } else {
                    console.error(__('Error:', 'custom-user-block'), response.data.message);
                }
            })
            .catch(error => {
                console.error(__('Error: Failed to load biography', 'custom-user-block'), error);
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
