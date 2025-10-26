/**
 * Authentication Service
 * Handles user authentication operations like logout
 */

/**
 * Logout user
 * - Clears backend session (PHP session)
 * - Clears session storage
 * - Clears local storage
 * - Redirects to signin page
 */
export const logoutUser = async (navigate) => {
  try {
    // Call backend logout endpoint to destroy PHP session
    await fetch('http://localhost/userlogout.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.warn('Backend logout warning:', error);
    // Continue even if backend call fails
  }

  try {
    // Clear user data from frontend storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_type');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');

    // Redirect to signin page
    navigate('/signin');
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, redirect to signin
    navigate('/signin');
  }
};

/**
 * Get current logged-in user
 * Returns user from session or local storage
 */
export const getCurrentUser = () => {
  try {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * Returns true if user data exists in storage
 */
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user !== null;
};
