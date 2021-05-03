export const redirectOnNoAccess = () => {
  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  }
}
