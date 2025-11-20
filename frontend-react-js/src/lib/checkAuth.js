import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const checkAuth = async (setUser) => {
  try {
    const user = await getCurrentUser();
    console.log("User:", user);
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    if (!idToken) {
      console.log("No ID token found.");
      return;
    }
    const attrs = idToken.payload;
    setUser({
      display_name: attrs.name,
      handle: attrs.preferred_username
    });
  } catch (error) {
    console.log("checkAuth error:", error);
  }
};

export default checkAuth;