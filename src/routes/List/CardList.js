import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List } from 'antd';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CardList.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class CardList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const { list: { list }, loading } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>提供可选性服务的安装。</p>
      </div>
    );

    const extraContent = <div className={styles.extraImg} />;

    return (
      <PageHeaderLayout title="服务商店" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list]}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[<a>详情</a>, <a>安装</a>]}>
                  <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a href="#">{item.title}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.description}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
