module.exports = {
    menu_default: [{
        title: 'Site',
        type: 'head',
        href: '/',
        class: ''
    }, {
        title: 'Home',
        type: 'head',
        href: '/cms',
        class: ''
    }],
    head_menu_content: {
        title: 'Content',
        type: 'sub',
        class: '',
        menus: []
    },
    sub_menu_content_view: {
        title: 'Content',
        href: '/cms/content',
        class: ''
    },
    sub_menu_category_view: {
        title: 'Categories',
        href: '/cms/content/category',
        class: ''
    },
    // sub_menu_page_view: {
    //     title: 'School',
    //     href: '/cms/content/page',
    //     class: ''
    // },
    head_menu_profile: {
        title: 'Profile',
        type: 'sub',
        class: '',
        menus: []
    },
    sub_menu_profile_view: {
        title: 'View profile',
        href: '/cms/profile',
        class: ''
    },
    sub_menu_profile_edit: {
        title: 'Edit profile',
        href: '/cms/profile/edit',
        class: ''
    },
    menu_users: {
        title: 'Users',
        type: 'head',
        href: '/cms/users',
        class: ''
    },
    head_menu_admin: {
        title: 'Settings',
        type: 'sub',
        class: '',
        menus: []
    },
    sub_menu_admin_general: {
        title: 'General',
        href: '/cms/settings',
        class: ''
    },
    sub_menu_admin_roles: {
        title: 'Roles',
        href: '/cms/settings/roles',
        class: ''
    },
    sub_menu_admin_permissions: {
        title: 'Permissions',
        href: '/cms/settings/permissions',
        class: ''
    },
    menu_login: [{
        title: 'Login',
        type: 'head',
        href: '/cms/login',
        class: ''
    }],
    menu_signup: [{
        title: 'Signup',
        type: 'head',
        href: '/cms/signup',
        class: ''
    }],
    menu_documentation: [{
        title: 'Documentation',
        type: 'head',
        href: '/cms/documentation',
        class: ''
    }],
    logout: [{
        title: 'Logout',
        type: 'head',
        href: '/cms/logout',
        class: ''
    }],
    curriculum: {
        title: 'Curriculum',
        type: 'sub',
        class: '',
        menus: []
    },
    sub_menu_curriculum_years: {
        title: 'Years',
        href: '/cms/curriculum/years',
        class: ''
    },
    sub_menu_curriculum_view: {
        title: 'Overview',
        href: '/cms/curriculum/overview',
        class: ''
    },
    sub_menu_curriculum_type: {
        title: 'Types',
        href: '/cms/curriculum/type',
        class: ''
    }
}
