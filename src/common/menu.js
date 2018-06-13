import { isUrl } from '../utils/utils';

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}
function beehivaMenuAdapte(data) {
  const menuData = data.data;
  return beehivaMenuAdapteConvert(menuData);
}

function beehivaMenuAdapteConvert(data) {
  return data.map(item => {
    let itemTitle = item.name;
    if (item.title) itemTitle = item.title;

    const result = {
      name: itemTitle,
      icon: item.icon,
      path: item.href,
      serviceId : item.href,
      disabled: item.disable,
      key: item.id,
      // hideInBreadcrumb: true,
      // hideInMenu: true,
      // authority: 'admin',
    };
    if (item.items) {
      result.children = beehivaMenuAdapteConvert(item.items);
    }

    if (item.subMenu) {
      result.subMenu = item.subMenu;
      result.path =  `${result.path}`;
    }
    return result;
  });
}

export const getMenuData = menuData => formatter(beehivaMenuAdapte(menuData));
