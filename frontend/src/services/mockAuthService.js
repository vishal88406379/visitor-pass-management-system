// Mock authentication service for demo without backend
const mockUsers = {
  'admin@example.com': {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    _id: '1',
  },
  'security@example.com': {
    email: 'security@example.com',
    password: 'password123',
    firstName: 'Security',
    lastName: 'Guard',
    role: 'security',
    _id: '2',
  },
  'employee@example.com': {
    email: 'employee@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
    _id: '3',
  },
};

export const mockAuthService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers[email];
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    const token = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
