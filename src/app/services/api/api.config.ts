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
    create: `/api/auth/register`,
    base: `/api/user/`,
    all: `/api/users`,
    user: `/api/users/r/3`,
    operator: `/api/users/r/2`,
    admin: `/api/users/r/1`,
  },

  keycloak: {
    create: `/api/auth/user/register`,
    all: `/api/users/m/all`,
    delete: `/api/users/m/d/`,
    find: `/api/users/m/i/`,
  },
}
