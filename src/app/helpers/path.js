export const onPaths = (paths) => {
  return (match, location) => {
    for (let i = 0; i < paths.length; i++) {
      const item = paths[i];
      let path;
      let exact = false;

      if (typeof item === "object") {
        path = item.path;
        exact = !!item.exact;
      } else {
        path = item;
      }

      if (location.pathname === path || (!exact && location.pathname.includes(path))) {
        return true;
      }
    }
  };
};