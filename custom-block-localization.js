// Custom User Block
(function() {
    const { registerBlockType } = wp.blocks;
    const { SelectControl, Button, Spinner } = wp.components;
    const { useState } = wp.element;
    const { __ } = wp.i18n;
    const { withSelect } = wp.data;

    // Define the block
    registerBlockType('custom/custom-block', {
        title: __('Custom User Block'),
        icon: 'hammer',
        category: 'design',
        attributes: {
            selectedUserId: { type: 'number' },
            biography: { type: 'string' }
        },
        edit: withSelect((select, props) => {
            const { users } = customBlockData;

            const [biographyLoading, setBiographyLoading] = useState(false);

            const loadBiography = (userId) => {
                setBiographyLoading(true);
                wp.ajax.post('load_user_biography', { user_id: userId, security: customBlockData.nonce })
                    .done(response => {
                        if (response.success) {
                            props.setAttributes({ biography: response.data });
                        } else {
                            console.error(__('Error:', 'custom-user-block'), response.data.message);
                        }
                    })
                    .fail(error => {
                        console.error(__('Error: Failed to load biography', 'custom-user-block'));
                    })
                    .always(() => {
                        setBiographyLoading(false);
                    });
            };

            return {
                users,
                biographyLoading,
                loadBiography
            };
        })(({ attributes, setAttributes, users, biographyLoading, loadBiography }) => {
            // Function to handle updating selected user ID
            const updateSelectedUser = (selectedUserId) => {
                setAttributes({ selectedUserId, biography: '' });
            };

            return (
                <div>
                    <SelectControl
                        label={__('Select User', 'custom-user-block')}
                        value={attributes.selectedUserId}
                        options={[{ label: __('Select a user', 'custom-user-block'), value: '' }, ...users.map(user => ({ label: user.name, value: user.id }))]}
                        onChange={updateSelectedUser}
                    />
                    <Button
                        isPrimary
                        onClick={() => loadBiography(attributes.selectedUserId)}
                    >
                        {__('Load User\'s Biography', 'custom-user-block')}
                    </Button>
                    {biographyLoading && <Spinner />}
                    {attributes.biography && <div>{attributes.biography}</div>}
                </div>
            );
        }),
        save: () => {
            // This block doesn't have a dynamic frontend representation
            return null;
        }
    });
})();

