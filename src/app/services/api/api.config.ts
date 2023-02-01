export const API_CONFIG = {
  login: `/api/login`,
  register: `/api/register`,
  news: {
    create: `/api/news`,
    base: `/api/news/`,
    all: `/api/news/all`,
  },
  activity: {
    create: `/api/activity`,
    base: `/api/activity/`,
    all: `/api/activity/all`,
  },
  user : {
    create: `/api/register`,
    base: `/api/user/`,
    all: `/api/users`,
    user: `/api/user/get/role/1`,
    operator: `/api/user/get/role/2`,
    admin: `/api/user/get/role/3`,
  }
}
