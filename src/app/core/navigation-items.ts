//user related items
export const UserNavigationItems = [
    {
        displayName: 'Top 10 Movies',
        iconName: 'movies',
        route: 'movies'
    },
    {
        displayName: 'Add Movies',
        iconName: 'movie_filter',
        route: 'user/add-user'
    },
    {
        displayName: 'Add TV Show',
        iconName: 'live_tv',
        route: 'user/statuses'
    },
    {
        displayName: 'All Movies',
        iconName: 'movies',
        route: 'all-movies'
    }
];

//permission related items
export const PermissionNavigationItems = [
    {
        displayName: 'Permissions',
        iconName: 'key',
        route: 'permission/permissions'
    }
];

export const RouterPageDescriptions = [
    {
        url:'/permission/permissions',
        text:'Permissions'
    },
    {
        url:'/user/users',
        text:'Users'
    },
    {
        url:'/user/add-user',
        text:'Add new user'
    },
    {
        url:'/user/user-profile',
        text:'User profile'
    },
    {
        url:'/user/user-permissions',
        text:'User permissions'
    },
    {
        url:'/user/statuses',
        text:'User statuses'
    }
];