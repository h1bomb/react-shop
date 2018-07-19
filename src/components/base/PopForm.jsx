import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, Form, Input, InputNumber,
} from 'antd';

const FormItem = Form.Item;

/**
 * 添加link
 */
class FormPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({
      visible: true,
    });
  };

  cancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e) => {
    const { form, dataProc } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dataProc(values);
        form.resetFields();
        this.setState({
          visible: false,
        });
      }
    });
  };

  render() {
    const { visible } = this.state;
    const {
      buttonText, modalTitle, okText, formSet, form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div style={{ textAlign: 'left', display: 'inline' }}>
        <Button type="primary" onClick={this.show}>
          {buttonText}
        </Button>
        <Modal
          visible={visible}
          title={modalTitle}
          okText={okText}
          onOk={this.handleSubmit}
          onCancel={this.cancel}
        >
          <Form layout="vertical">
            {formSet.map(val => (
              <FormItem label={val.key} key={val.key}>
                {getFieldDecorator(val.key, {
                  rules: [{ required: val.required, message: val.message }],
                })(val.type === 'number' ? <InputNumber min={0} max={1000} /> : <Input />)}
              </FormItem>
            ))}
          </Form>
        </Modal>
      </div>
    );
  }
}

FormPanel.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
  dataProc: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  formSet: PropTypes.arrayOf(Object),
};

FormPanel.defaultProps = {
  formSet: [],
};

export default Form.create({
  mapPropsToFields({ data }) {
    if (!data) {
      return { nothing: Form.createFormField({ value: '' }) };
    }
    const ret = {};

    Object.keys(data).forEach((key) => {
      ret[key] = Form.createFormField({ value: data[key] });
    });
    return ret;
  },
})(FormPanel);
