export class MENU_DATA {
  public data = [
    {
      name: 'Dasbor',
      path: '/home/dashboard',
      icon: 'fa-solid fa-table-columns',
      collapse: true,
      children: [],
    },
    {
      name: 'Manajemen Akun',
      path: '/home/account-master/',
      icon: 'fa-solid fa-users-gear',
      collapse: true,
      children: [
        {
          name: 'Pengguna',
          path: '/home/account-master/user',
        },
        {
          name: 'Operator',
          path: '/home/account-master/operator',
        },
        {
          name: 'Admin',
          path: '/home/account-master/admin',
        },
      ],
    },
    {
      name: 'Manajemen Berita',
      path: '/home/news-master',
      icon: 'fa-solid fa-newspaper',
      collapse: true,
      children: [],
    },
    {
      name: 'Manajemen Aktivitas',
      path: '/home/activity-master',
      icon: 'fa-solid fa-calendar',
      collapse: true,
      children: [],
    },
  ]
}
