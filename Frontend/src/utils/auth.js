const USERS_KEY = "techstore_users";
const CURRENT_USER_KEY = "techstore_current_user";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ fullName, email, phone, password }) {
  const users = getUsers();

  const existedUser = users.find((user) => user.email === email);

  if (existedUser) {
    return {
      success: false,
      message: "Email này đã được đăng ký."
    };
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    phone,
    password,
    address: "Chưa cập nhật",
    createdAt: new Date().toLocaleDateString("vi-VN")
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: "Đăng ký thành công.",
    user: newUser
  };
}

export function loginUser(email, password) {
  const users = getUsers();

  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng."
    };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return {
    success: true,
    message: "Đăng nhập thành công.",
    user
  };
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
