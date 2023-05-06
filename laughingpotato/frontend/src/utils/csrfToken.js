export const csrfToken = () => {
  const name = 'csrftoken';
  const value = `; ${ document.cookie }`;
  const parts = value.split(`; ${ name }=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default csrfToken;
