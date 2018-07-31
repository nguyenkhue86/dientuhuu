/**
 * Default Fuse Configuration
 *
 * You can edit these options to change the default options. All these options also can be changed per component
 * basis. See `app/main/components/pages/authentication/login/login.component.ts` constructor method to learn more
 * about changing these options per component basis.
 */
export const LayoutConfig = {
    layout          : {
        navigation      : 'left', // 'right', 'left', 'top', 'none'
        navigationFolded: false, // true, false
        toolbar         : 'below', // 'above', 'below', 'none'
        footer          : 'none', // 'above', 'below', 'none'
        mode            : 'fullwidth' // 'boxed', 'fullwidth'
    },
    colorClasses    : {
        toolbar: 'mat-blue-900-bg',
        navbar : 'mat-blue-900-bg',
        footer : 'mat-dark-900-bg'
        // mat-red-700-bg
    },
    customScrollbars: true,
    routerAnimation : 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
};
