import React from 'react';

import {
  Upload, message, Button, Icon,
} from 'antd';

const props = {
  name: 'file',
  action: '//localhost:3001/upload',
  onChange(info) {
    if (info.file.status !== 'uploading') {
      message.info(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const upload = () => (
  <Upload {...props}>
    <Button>
      <Icon type="upload" />
      {' '}
Click to Upload
    </Button>
  </Upload>);

export default upload;
