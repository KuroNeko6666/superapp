const login = {
  id: {
    title: "Selamat Datang,",
    subtitle: "Masuk sekarang untuk melanjutkan.",
  },
  en: {
    title: "Welcome Back,",
    subtitle: "Login now to continue.",
  }
}

const user_master = {
  id: {
    name: "Pengguna",
    default: {
      title: "Data Pengguna",
      subtitle: "Daftar tabel pengguna",
      search: "Pencarian untuk nama, email, dan akses",
    },
    create: {
      title: "Tambah pengguna",
      subtitle: "-"
    },
    update: {
      title: "Ubah pengguna",
      subtitle: "-"
    },
    delete: {
      title: "Hapus pengguna?",
      subtitle: "Tekan 'Hapus' untuk menghapus akun ini."
    },
    detail: {
      title: "Rincian pengguna",
      subtitle: "-"
    }
  },
  en: {
    name: "User",
    default: {
      title: "Data Users",
      subtitle: "Table list users",
      search: "Search for name, email, and role",
    },
    create: {
      title: "Create user",
      subtitle: "-"
    },
    update: {
      title: "Update user",
      subtitle: "-"
    },
    delete: {
      title: "Delete user?",
      subtitle: "Click 'Delete' to delete this user."
    },
    detail: {
      title: "Detail user",
      subtitle: "-"
    }
  },
}

const news_master = {
  id: {
    name: "Berita",
    default: {
      title: "Data Berita",
      subtitle: "Daftar tabel berita",
      search: "Pencarian untuk judul, dan kontent",
    },
    create: {
      title: "Tambah berita",
      subtitle: "-"
    },
    update: {
      title: "Ubah berita",
      subtitle: "-"
    },
    delete: {
      title: "Hapus berita ?",
      subtitle: "Tekan 'Hapus' untuk menghapus akun ini."
    },
    detail: {
      title: "Rincian berita",
      subtitle: "-"
    }
  },
  en: {
    name: "News",
    default: {
      title: "Data News",
      subtitle: "Table list news",
      search: "Search for name, email, and role",
    },
    create: {
      title: "Create news",
      subtitle: "-"
    },
    update: {
      title: "Update news",
      subtitle: "-"
    },
    delete: {
      title: "Delete news?",
      subtitle: "Click 'Delete' to delete this news."
    },
    detail: {
      title: "Detail news",
      subtitle: "-"
    }
  },
}

const action = {
  id: {
    login: "Masuk",
    register: "Daftar",
    search: "Cari",
    create: "Tambah",
    update: "Ubah",
    delete: "Hapus",
    detail: "Rincian",
    cancel: "Batal",
    back: "Kembali",
  },
  en: {
    login: "Login",
    register: "Register",
    search: "Search",
    create: "Create",
    update: "Update",
    delete: "Delete",
    detail: "Detail",
    cancel: "Cancel",
    back: "Back",
  },
}

const content = {
  id: {
    no: "No",
    nama: "Nama",
    email: "Email",
    password: "Kata sandi",
    role: "Akses",
    action: "Aksi",
  },
  en: {
    no: "No",
    nama: "Name",
    email: "Email",
    password: "Password",
    role: "Role",
    action: "Action",
  },
}

const response = {
  id: {
    error: {
      haserror: "",
    },
    success: {
      create: " berhasil ditambahkan!",
      update: " berhasil diubah!",
      delete: " berhasil dihapus!",
    }
  },
  en: {
    error: {
      haserror: "There is an error.",
    },
    success: {
      create: " added successfully!",
      update: " updated successfully!",
      delete: " deleted successfully!",
    }
  },
}

export class LanguageConfig {
  public login = login;
  public user_master = user_master;
  public action = action;
  public content = content;
  public response = response;
}
