import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/v1/service/summary/ngcpconfig': {
    'serviceName': 'gateway',
    'serviceStatus': 'UP',
    'deployType': 1,
    'serviceInstances': [
      {
        'serviceId': 'mgwcore-643032428',
        'containerName':'mesos-959ca350-b07a-4e5e-8a08-3b7770ab0321-S2.a2b078e6-2801-4a30-afbf-8a3fa499c2dd',
        'status': 'UP',
        'dataCenter': 'new-infra',
        'host': '192.168.112.54:31682',
        'upTime': '0:40:50',
        'excutableImage': '/app.jar',
        'version': '0.1.0-SNAPSHOT',
        'type': 'server'
      }
    ]
  },
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/menus': {
    data: [
      {
        id: '1',
        title: '健康管理',
        icon: 'android',
        href: 'dashboard',
        items: [
          {
            id: '11',
            icon: 'android',
            name: '仪表盘',
            href: 'overview',
          },
          {
            id: '12',
            icon: 'android',
            name: '平台健康',
            href: 'que-msg',
            disable: true,
          },
          {
            id: '12',
            icon: 'android',
            name: '服务健康',
            href: 'que-msg',
            disable: true,
          },
        ],
      },
      {
        id: '3',
        title: '各种服务',
        icon: 'android',
        href: 'service',
        items: [
          {
            id: '31',
            icon: 'android',
            name: '配置管理',
            href: 'ngcpconfig',
            subMenu: {
              summary: true,
              apidoc: true,
              status: true,
              control: true,
              logs: true,
              resource: true,
              entry: true,
              register: true,
            },
          },
          {
            id: '32',
            icon: 'android',
            name: '缓存服务',
            href: 'ngcpredis',
          },
          {
            id: '33',
            icon: 'android',
            name: '容器管理',
            href: 'ngcpdocker',
          },
          {
            id: '34',
            icon: 'android',
            name: '管理控制台',
            href: 'ngcpconsole',
            subMenu: {
              summary: true,
              apidoc: false,
              status: true,
              control: true,
              logs: false,
              resource: true,
              entry: true,
              register: true,
            },
          },
          {
            id: '35',
            icon: 'android',
            name: '个人信息中心',
            href: 'ngcpperson',
          },
          {
            id: '36',
            icon: 'android',
            name: '企业信息中心',
            href: 'ngcpcompany',
          },
          {
            id: '37',
            icon: 'android',
            name: '医保网关核心服务',
            href: 'mgwcore',
          },
          {
            id: '38',
            icon: 'android',
            name: '医保网关开放服务',
            href: 'mgwopen',
          },
        ],
      },
      {
        id: '2',
        title: '系统服务',
        icon: 'android',
        href: 'system',
        items: [
          {
            id: '21',
            icon: 'android',
            name: '服务商店',
            href: 'shop',
            disable: false,
          },
          {
            id: '22',
            icon: 'android',
            name: '用户信息中心',
            href: 'user',
            disable: true,
          },
        ],
      },
    ],
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
