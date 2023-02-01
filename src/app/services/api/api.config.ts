export const API_CONFIG = {
  login: `/api/auth/login`,
  register: `/api/auth/register`,
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
    user: `/api/user/r/3`,
    operator: `/api/user/r/2`,
    admin: `/api/user/r/1`,
  }
}
