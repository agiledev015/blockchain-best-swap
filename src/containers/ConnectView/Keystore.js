import React, { useState } from 'react';
import { crypto } from '@binance-chain/javascript-sdk';
import { FilePicker } from 'react-file-picker';

import { ContentWrapper } from './ConnectView.style';
import { Icon, Input } from 'antd';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import FormGroup from '../../components/uielements/formGroup';

const Keystore = props => {
  const [keystore, setKeystore] = useState(null);
  const [password, setPassword] = useState(null);

  const [keystoreError, setKeystoreError] = useState(null);

  var reader = new FileReader();
  reader.onload = () => {
    try {
      const key = JSON.parse(reader.result);
      if (!('version' in key) || !('crypto' in key)) {
        setKeystoreError('Not a valid keystore file');
      } else {
        setKeystoreError(null);
        setKeystore(key);
      }
    } catch {
      setKeystoreError('Not a valid json file');
    }
  };

  const uploadKeystore = f => {
    reader.readAsText(f);
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
  };

  const unlock = () => {
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
    // TODO: prefix should be dependent if testnet vs mainnet
    const address = crypto.getAddressFromPrivateKey(privateKey, 'tbnb');
    // TODO: set redux wallet details, { keystore, address }. Once updated redux...
    //setPassword(null)
    //setKeystore(null)
    //props.history.push("/")
  };

  return (
    <ContentWrapper>
      <Label size="large" weight="bold" color="normal">
        Select Keystore File
      </Label>
      <FilePicker
        onChange={f => uploadKeystore(f)}
        onError={err => console.error(err)}
      >
        <Button
          onClick={unlock}
          style={{ width: 100 }}
          color="primary"
          typevalue="outline"
        >
          <Icon type="upload" />
          Choose File to Upload
        </Button>
        &nbsp;
        {keystore && !keystoreError && (
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        )}
      </FilePicker>
      {keystoreError && (
        <span style={{ color: '#FF4136' }}>{keystoreError}</span>
      )}
      <FormGroup
        title="Decryption password:"
        description="This is the password used to decrypt your encrypted keystore file"
      >
        <Input.Password
          allowClear
          onChange={onPasswordChange}
          placeholder="password"
        />
      </FormGroup>
    </ContentWrapper>
  );
};

export default Keystore;
