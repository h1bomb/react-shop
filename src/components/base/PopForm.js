import React, { Component } from "react";
import { Button, Modal, Form, Input } from "antd";
const FormItem = Form.Item;

/**
 * 添加link
 */
class FormPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  show = () => {
    this.setState({
      visible: true
    });
  };

  cancel = () => {
    this.setState({
      visible: false
    });
  };

  handleSubmit = e => {
    const { form, dataProc} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        dataProc(values);
        this.props.form.resetFields();
        this.setState({
          visible: false
        });
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { buttonText, modalTitle, okText, formSet } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ textAlign: "left",display: "inline" }}>
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
                  rules: [{ required: val.required, message: val.message }]
                })(<Input />)}
              </FormItem>
            ))}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create({
  mapPropsToFields({ data }) {
    if (!data) {
      return { nothing: Form.createFormField({ value: "" }) };
    }
    let ret = {};
    for (let key in data) {
      ret[key] = Form.createFormField({ value: data[key] });
    }
    return ret;
  }
})(FormPanel);
