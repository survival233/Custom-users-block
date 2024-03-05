<?php
/**
 * Plugin Name: Custom User Block
 * Description: Custom User Block
 */

// Enqueue the JavaScript file for the custom Gutenberg block
function custom_enqueue_block_editor_assets() {
    // Enqueue script only on the block editor screen
    wp_enqueue_script('custom-user-block', plugin_dir_url(__FILE__) . 'custom-block.js', array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-data'), null, true);

    // Localize script with necessary data
    wp_localize_script('custom-user-block', 'customBlockData', array(
        'nonce' => wp_create_nonce('custom-user-block-nonce'),
        'users' => custom_fetch_rgbc_dev_users(), // Function to fetch users
    ));
}
add_action('enqueue_block_editor_assets', 'custom_enqueue_block_editor_assets');


// AJAX endpoint for loading user biography
function custom_load_user_biography() {
    check_ajax_referer('custom-user-block-nonce', 'security');

    if (!is_user_logged_in()) {
        wp_send_json_error(__('User is not logged in.', 'custom-user-block'));
    }

    $user_id = isset($_POST['user_id']) ? absint($_POST['user_id']) : 0;

    if ($user_id) {
        // Implement biography loading logic here

        wp_send_json_success($biography); // Send biography data on success
    } else {
        wp_send_json_error(__('Invalid user ID.', 'custom-user-block'));
    }
}
add_action('wp_ajax_load_user_biography', 'custom_load_user_biography');
add_action('wp_ajax_nopriv_load_user_biography', 'custom_load_user_biography');

// Enqueue the script with localized data
function custom_enqueue_block_localization_script() {
    wp_enqueue_script('custom-block-localization', plugin_dir_url(__FILE__) . 'custom-block-localization.js', array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-data'), null, true);
    wp_localize_script('custom-block-localization', 'customBlockData', array(
        'users' => custom_fetch_rgbc_dev_users(),
        'nonce' => wp_create_nonce('custom-user-block-nonce')
    ));
}
add_action('enqueue_block_editor_assets', 'custom_enqueue_block_localization_script');

// Function to fetch users with emails ending in "@rgbc.dev"
function custom_fetch_rgbc_dev_users() {
    $users = get_users(array(
        'meta_query' => array(
            array(
                'key' => 'email',
                'value' => '@rgbc.dev$',
                'compare' => 'REGEXP'
            )
        )
    ));

    $formatted_users = array();
    foreach ($users as $user) {
        $formatted_users[] = array(
            'id' => $user->ID,
            'name' => esc_html($user->display_name),
            'email' => sanitize_email($user->user_email)
        );
    }

    return $formatted_users;
}
 