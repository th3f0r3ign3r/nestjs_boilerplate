export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const serializeUser = (user: object) => {
  const omitProps = ['isValidated', 'password', '__v', '_id'];
  user = JSON.parse(JSON.stringify(user));
  Object.keys(user).forEach(function (key) {
    if (omitProps.includes(key)) delete user[key];
  });
  return user;
};
