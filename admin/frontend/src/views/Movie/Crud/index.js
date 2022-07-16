import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  Popover,
  Select,
  Input
} from 'antd';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { FormInputRender, useIntl } from '@bmstravel/pro-table';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import Upload from '../../../components/Upload';
import * as enums from '../../../utils/enums';
import { formatNumber, camelCaseToDash } from '../../../utils/utils';
import styles from './style.less';

const { Option } = Select
const {TextArea} = Input
const RESOURCE = "movie";
const fieldLabels = {
  "popularity":"Độ phổ biến",
  "revenue":"Doanh thu",
  "budget":"Kinh phí sản xuất",
  "tagline":"Dòng tag",
  "runtime":"Thời lượng (phút)",
  "release_date":"Ngày ra mắt",
  "vote_count":"Số vote",
  "vote_average":"Điểm vote trung bình",
  "budget_adj":"Kinh phí đã điều chỉnh",
  "revenue_adj":"Doanh thu đã điều chỉnh",
  "imdb_id":"IMDB Id",
  "production_companies":"Các xưởng phim tham gia",
  "keywords":"Từ khóa",
  "release_year":"Năm phát hành",
  "overview":"Tổng quan",
  "director":"Đạo diễn",
  "cast":"Dàn diễn viên",
   "genres": "Thể loại", 
   "homepage": "Trang chủ",
   "original_title": "Tên phim" };

const MovieForm = ({ movie: { formTitle, formData }, dispatch, submitting, match: { params } }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const [width, setWidth] = useState('100%')
  const getErrorInfo = (errors) => {
    console.log('getErrorInfo -> errors', errors);
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="Thông tin lỗi"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined /> &nbsp;{errorCount || 0} lỗi
        </Popover>
      </span>
    );
  };

  const onFinish = (values) => {
    setError([]);
    const data = _.cloneDeep(values);
    dispatch({
      type: 'movie/submit',
      payload: data,
      callback: () => {
        // dispatch(routerRedux.push({ pathname: `/base/${camelCaseToDash(RESOURCE)}` }));
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  useEffect(() => {
    dispatch({
      type: 'movie/loadForm',
      payload: {
        type: params.id !== 'add' ? 'E' : 'A',
        id: params.id !== 'add' ? params.id : null
      },
    });
  }, [])

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...formData
    });
  }, [formData]);

  useEffect(() => {
    function resizeFooterToolbar() {
      requestAnimationFrame(() => {
        const sider = document.querySelectorAll('.ant-layout-sider')[0];
        if (sider) {
          const widthCur = `calc(100% - ${sider.style.width})`;
          if (width !== widthCur) {
            setWidth(width);
          }
        }
      });
    };
    window.addEventListener('resize', resizeFooterToolbar, { passive: true });
    return function cleanup() {
      window.removeEventListener('resize', resizeFooterToolbar);
    };
  })

  if (params.id === 'add' || (formData && formData.id !== '' && formData.id !== 'add')) {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        hideRequiredMark
        initialValues={{ ...formData }}
      >
        <PageHeaderWrapper
          wrapperClassName={styles.advancedForm}
        >
          <Card title="Thông tin phim" className={styles.card} bordered={true}>
            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['original_title']}
                  name="original_title"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['genres']}
                  name="genres"
                >
                  <Select mode="multiple">
                    <Option key={1} value="Action">Action</Option>
                    <Option key={2} value="Adventure">Adventure</Option>
                    <Option key={3} value="Science Fiction">Science Fiction</Option>
                    <Option key={4} value="Comedy">Comedy</Option>
                    <Option key={5} value="Drama">Drama</Option>
                    <Option key={6} value="Fantasy">Fantasy</Option>
                    <Option key={7} value="Horror">Horror</Option>
                    <Option key={8} value="Mystery">Mystery</Option>
                    <Option key={9} value="Romance">Romance</Option>
                    <Option key={10} value="Thriller">Thriller</Option>
                    <Option key={11} value="Western">Western</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['homepage']}
                  name="homepage"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['director']}
                  name="director"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['cast']}
                  name="cast"
                >
                  <Select mode="tags">
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['release_year']}
                  name="release_year"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['keywords']}
                  name="keywords"
                >
                <Select mode="tags">
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['production_companies']}
                  name="production_companies"
                >
                  <Select mode="tags">
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['runtime']}
                  name="runtime"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['imdb_id']}
                  name="imdb_id"
                >
               <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['revenue']}
                  name="revenue"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['budget']}
                  name="budget"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['popularity']}
                  name="popularity"
                >
               <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['vote_count']}
                  name="vote_count"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['vote_average']}
                  name="vote_average"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['budget_adj']}
                  name="budget_adj"
                >
               <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 8, offset: 1 }} md={{ span: 8, offset: 1 }} sm={{ span: 8, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['revenue_adj']}
                  name="revenue_adj"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['tagline']}
                  name="tagline"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={{ span: 5, offset: 1 }} md={{ span: 5, offset: 1 }} sm={{ span: 5, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['release_date']}
                  name="release_date"
                >
               <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              
            <Col lg={{ span: 20, offset: 1 }} md={{ span: 20, offset: 1 }} sm={{ span: 20, offset: 1 }}>
                <Form.Item
                  label={fieldLabels['overview']}
                  name="overview"
                >
                  <TextArea style={{height:150}}/>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <FooterToolbar style={{ width }}>
            {getErrorInfo(error)}
            <Button type="primary" onClick={() => form.submit()} loading={submitting}>
              {params.id === 'add' ? "Thêm mới" : "Chỉnh sửa"}
            </Button>
          </FooterToolbar>
        </PageHeaderWrapper>
      </Form>
    );
  }
  return <></>;
}

export default connect(({ movie, loading }) => ({
  submitting: loading.effects['movie/submit'],
  movie
}))(MovieForm);
