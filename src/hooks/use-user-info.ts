import { User } from '$typings/user';
import { Api } from '$utils/request';
import { useEffect, useState } from 'react';
import { Response } from '$typings/response';

export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.user.get();
        const userInfo: Response<{ user: User }> = await res.json();
        if (!userInfo.data.user) {
          throw new Error("Can't get user info");
        }
        setUser(userInfo.data.user);
      } catch (e) {
        console.error(e);
        window.location.href =
          LOGIN_URL + '?redirect_url=' + window.location.href;
      }
    })();
  }, []);

  return user;
};
