export class MENU_DATA {
  public data = [
    {
      name: 'Dashboard',
      path: '/home/dashboard',
      icon: 'fa-solid fa-table-columns',
      collapse: true,
      children: [],
    },
    {
      name: 'Account Master',
      path: '/home/account-master/',
      icon: 'fa-solid fa-users-gear',
      collapse: true,
      children: [
        {
          name: 'User Master',
          path: '/home/account-master/user',
        },
        {
          name: 'Operator Master',
          path: '/home/account-master/operator',
        },
        {
          name: 'Admin Master',
          path: '/home/account-master/admin',
        },
      ],
    },
    {
      name: 'News Master',
      path: '/home/news-master',
      icon: 'fa-solid fa-newspaper',
      collapse: true,
      children: [],
    },
    {
      name: 'Activity Master',
      path: '/home/activity-master',
      icon: 'fa-solid fa-calendar',
      collapse: true,
      children: [],
    },
  ]
}
