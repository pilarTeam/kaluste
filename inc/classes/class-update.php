<?php
/**
 * Auto Update Object
 * Update from github repository
 *
 * @package Kaluste
 */
namespace KALUSTE\inc;
use KALUSTE\inc\Traits\Singleton;

class Update {
	use Singleton;
    private $file;
    private $plugin;
    private $basename;
    private $active;
    private $username;
    private $repository;
    private $authorize_token;
    private $github_response;
    public function __construct() {
        $this->setup_hooks();
	}
    private function setup_hooks() {
        $this->file = KALUSTE_FILE__;
        add_action('admin_init', [$this, 'set_plugin_properties'], 1, 0);
    }
    public function set_plugin_properties() {
		$this->plugin	= get_plugin_data($this->file);
		$this->basename = plugin_basename($this->file);
		$this->active	= is_plugin_active($this->basename);
        $this->set_username('mahmudremal');
        $this->set_repository('woocommerce-flutterwave-payment');
        $this->authorize(false);
        $this->initialize();
        /**
         * To check immediate update removing transition delay.
         */
        // add_action('admin_init', function() {delete_site_transient('update_plugins');wp_update_plugins();}, 10, 0);
        // print_r([get_site_transient('update_plugins')]);
        
	}
    public function set_username($username) {
		$this->username = $username;
	}
    public function set_repository($repository) {
		$this->repository = $repository;
	}
    public function authorize($token) {
		$this->authorize_token = $token;
	}
    private function get_repository_info() {
		if (is_null($this->github_response)) { // Do we have a response?
			$args = [];
			$request_uri = sprintf('https://api.github.com/repos/%s/%s/releases', $this->username, $this->repository); // Build URI
			$args = [];
			if ($this->authorize_token) { // Is there an access token?
				$args['headers']['Authorization'] = "bearer {$this->authorize_token}"; // Set the headers
			}
			$response = json_decode(wp_remote_retrieve_body(wp_remote_get($request_uri, $args)), true); // Get JSON and parse it
			if (is_array($response)) { // If it is an array
					$response = current($response); // Get the first item
			}
			$this->github_response = $response; // Set it to our property
		}
	}
    public function initialize() {
        // set_site_transient('update_plugins', null);
        add_filter('site_transient_update_plugins', [$this, 'modify_transient']);
        add_filter('pre_set_site_transient_update_plugins', [$this, 'modify_transient'], 10, 1);
        add_filter('plugins_api', [$this, 'plugin_popup'], 10, 3);
        add_filter('upgrader_post_install', [$this, 'after_install'], 10, 3);
        
        // Add Authorization Token to download_package
        add_filter('upgrader_pre_download',
            function() {
                add_filter('http_request_args', [$this, 'download_package'], 15, 2);
                return false; // upgrader_pre_download filter default return value.
            }
       );
	}
    public function modify_transient($transient) {
        if ($transient && property_exists($transient, 'checked')) {
            if ($checked = $transient->checked) {
                $this->get_repository_info();
                $version_tag = (isset($checked[$this->basename]) && !empty($checked[$this->basename]))?'v' . $checked[$this->basename]:false;
                

                if ($version_tag && is_array($this->github_response)) {

                    // print_r($this->github_response);
                    
                    try {
                        $out_of_date = version_compare($this->github_response['tag_name'], $version_tag, 'gt');
                            
                        if ($out_of_date) {
                            $new_files = $this->github_response['zipball_url'];
                            $slug = current(explode('/', $this->basename));
                            $plugin = [
                                'slug' => $slug,
                                'package' => $new_files,
                                'url' => $this->plugin["PluginURI"],
                                'new_version' => $this->github_response['tag_name']
                           ];
                            $transient->response[$this->basename] = (object) $plugin;
                        }
                    } catch (\Exception $th) {
                        //throw $th;
                    }
                }
            }
        }
        return $transient; // Return filtered transient
	}
    public function plugin_popup($result, $action, $args) {
		if (!empty($args->slug)) {
            if ($args->slug == current(explode('/', $this->basename))) {
                $this->get_repository_info();
            
                $plugin = [
                    'name'				=> $this->plugin["Name"],
                    'slug'				=> $this->basename,
                    'requires'          => '3.3',
                    'tested'            => '6.0.3',
                    'rating'            => '100.0',
                    'num_ratings'       => '1',
                    'downloaded'        => '1',
                    'added'             => date('Y-m-d', strtotime($this->github_response['created_at'])),
                    'version'			=> $this->github_response['tag_name'],
                    'author'			=> $this->plugin["AuthorName"],
                    'author_profile'	=> $this->plugin["AuthorURI"],
                    'last_updated'		=> $this->github_response['published_at'],
                    'homepage'			=> $this->plugin["PluginURI"],
                    'short_description' => $this->plugin["Description"],
                    'sections'			=> [
                        'Description'	=> $this->plugin["Description"],
                        'Updates'		=> $this->github_response['body'],
                   ],
                    'download_link'		=> $this->github_response['zipball_url']
               ];
                return (object) $plugin;
            }
        }
		return $result;
	}
	public function download_package($args, $url) {
		if (null !== $args['filename']) {
			if ($this->authorize_token) { 
				$args = array_merge($args, ["headers" => ["Authorization" => "token {$this->authorize_token}"]]);
			}
		}
		remove_filter('http_request_args', [$this, 'download_package']);
        return $args;
	}
    public function after_install($response, $hook_extra, $result) {
		global $wp_filesystem;
        $install_directory = plugin_dir_path($this->file);
		$wp_filesystem->move($result['destination'], $install_directory);
		$result['destination'] = $install_directory;
        if ($this->active) {
			activate_plugin($this->basename);
		}
        return $result;
	}
}
