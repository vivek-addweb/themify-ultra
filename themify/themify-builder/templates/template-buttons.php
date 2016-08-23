<?php
if (!defined('ABSPATH'))
    exit; // Exit if accessed directly
/**
 * Template Buttons
 * 
 * Access original fields: $mod_settings
 * @author Themify
 */
if (TFCache::start_cache('buttons', self::$post_id, array('ID' => $module_ID))):

    $fields_default = array(
        'mod_title_button' => '',
        'buttons_size' => '',
        'buttons_style'=>'',
        'content_button' => array(),
        'animation_effect' => '',
        'css_button' => ''
    );


    $fields_args = wp_parse_args($mod_settings, $fields_default);
    extract($fields_args, EXTR_SKIP);
    $animation_effect = $this->parse_animation_effect($animation_effect, $fields_args);

    $container_class = implode(' ', apply_filters('themify_builder_module_classes', array(
        'module', 'module-' . $mod_name, $module_ID, $css_button, $animation_effect
                    ), $mod_name, $module_ID, $fields_args)
    );
    $ui_class = implode(' ', array('module-' . $mod_name,$buttons_size,$buttons_style));
	
    $container_props = apply_filters( 'themify_builder_module_container_props', array(
        'id' => $module_ID,
        'class' => $container_class
    ), $fields_args, $mod_name, $module_ID );
    ?>
    <!-- module buttons -->
    <div <?php echo $this->get_element_attributes( $container_props ); ?>>

        <?php if ($mod_title_button != ''): ?>
            <?php echo $mod_settings['before_title'] . wp_kses_post(apply_filters('themify_builder_module_title', $mod_title_button, $fields_args)) . $mod_settings['after_title']; ?>
        <?php endif; ?>

        <?php do_action('themify_builder_before_template_content_render'); ?>

        <div class="<?php echo esc_attr($ui_class); ?>">
            <?php
            foreach (array_filter($content_button) as $content):
               
                $content = wp_parse_args($content, array(
                    'label' => '',
                    'link' => '',
                    'icon' => '',
                    'new_window'=>false,
                    'button_color_bg'=>false
                ));
                if(!is_array($content['new_window'])){
                    $content['new_window'] = array($content['new_window']);
                }
                $lightbox = in_array('lightbox', $content['new_window']);
                $window = !$lightbox && in_array('1', $content['new_window']);
                ?>
                <div class="module-buttons-item">
                    <?php if($content['link']):?>
                        <a class="ui builder_button  <?php echo $content['button_color_bg']?><?php if($lightbox):?> themify_lightbox<?php endif;?>" <?php if($window):?>target="_blank"<?php endif;?> href="<?php echo esc_url($content['link'])?>">
                    <?php endif;?>
                        <?php if($content['icon']):?>
                            <i class="fa <?php echo $content['icon'];?>"></i>
                        <?php endif;?>
                        <span><?php esc_attr_e($content['label'])?></span>
                    <?php if($content['link']):?>
                        </a>
                    <?php endif;?>
                </div>
            <?php endforeach; ?>
        </div>

        <?php do_action('themify_builder_after_template_content_render'); ?>

    </div>
    <!-- /module buttons -->
<?php endif; ?>
<?php TFCache::end_cache(); ?>