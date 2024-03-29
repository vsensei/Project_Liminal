import React, { useState } from 'react';
import CustomButton from 'components/shared/custombutton/custombutton.component';
import FormInput from 'components/shared/forminputs/forminput/forminput.component';
import FormFileInput from 'components/shared/forminputs/formfileinput/formfileinput.component';
import './card-signup.styles.scss';
import { connect } from 'react-redux';
import { signUpStart } from 'redux/user/user.actions';
import { handleChange, handleChangeWithFunction } from 'utils/utils';
import { Trans } from '@lingui/macro';

const CardSignUp = ({ signUpStart, CardBlur }) => {
  const selectedItemInitialState = {
    email: '',
    firstname: '',
    lastname: '',
    date: '',
    phone: '',
    file: '',
    password: '',
    passwordconf: '',
  };

  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);

  const [selectedItem, setSelectedItem] = useState(selectedItemInitialState);
  const {
    email,
    firstname,
    lastname,
    date,
    phone,
    file,
    password,
    passwordconf,
  } = selectedItem;

  const checkDoPasswordsMatch = (name, value) => {
    switch (name) {
      case 'password':
        setDoPasswordsMatch(value === selectedItem.passwordconf);
        break;
      case 'passwordconf':
        setDoPasswordsMatch(value === selectedItem.password);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (doPasswordsMatch)
      signUpStart(email, firstname, lastname, date, phone, file, password);
  };

  const fileSelectHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedItem({
        ...selectedItem,
        file: {
          image: getFileType(file.type),
          imagePreviewUrl: reader.result,
        },
      });
    };
  };

  const Inputs = [
    {
      name: 'email',
      value: email,
      label: <Trans>Email</Trans>,
      handleChange: handleChange(selectedItem, setSelectedItem),
      type: 'email',
      key: 'email',
    },
    {
      name: 'firstname',
      value: firstname,
      label: <Trans>First name</Trans>,
      handleChange: handleChange(selectedItem, setSelectedItem),
      type: 'text',
      key: 'firstname',
    },
    {
      name: 'lastname',
      value: lastname,
      label: <Trans>Last name</Trans>,
      handleChange: handleChange(selectedItem, setSelectedItem),
      type: 'text',
      key: 'lastname',
    },
    {
      name: 'date',
      value: date,
      label: '',
      handleChange: handleChange(selectedItem, setSelectedItem),
      type: 'date',
      key: 'date',
    },
    {
      name: 'phone',
      value: phone,
      label: <Trans>Phone</Trans>,
      handleChange: handleChange(selectedItem, setSelectedItem),
      type: 'tel',
      key: 'phone',
    },
    {
      name: 'file',
      label: '',
      handleChange: fileSelectHandler,
      type: 'file',
      key: 'file',
    },
    {
      name: 'password',
      value: password,
      label: <Trans>Password</Trans>,
      handleChange: handleChangeWithFunction(
        selectedItem,
        setSelectedItem,
        checkDoPasswordsMatch
      ),
      type: 'password',
      key: 'password',
    },
    {
      name: 'passwordconf',
      value: passwordconf,
      handleChange: handleChangeWithFunction(
        selectedItem,
        setSelectedItem,
        checkDoPasswordsMatch
      ),
      label: <Trans>Password confirmation</Trans>,
      type: 'password',
      key: 'passwordconf',
    },
  ];

  const getFileType = (filetype) => {
    switch (filetype) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/svg+xml':
        return '.svg';
      case 'vnd.microsoft.icon':
        return '.ico';
      case 'png':
        return '.png';
      default:
        return '.dat';
    }
  };

  return (
    <div className="card-signup">
      <form method="post" onSubmit={handleSubmit}>
        {Inputs.map((input) =>
          input.type !== 'file' ? (
            <FormInput
              name={input.name}
              value={input.value}
              label={input.label}
              handleChange={input.handleChange}
              type={input.type}
              key={input.key}
              required
            />
          ) : (
            <FormFileInput
              handleChange={fileSelectHandler}
              key={input.key}
              required
            />
          )
        )}

        {!doPasswordsMatch ? (
          <div className="error">
            <Trans>Passwords do not match</Trans>
          </div>
        ) : null}
        <CustomButton type="submit">
          <Trans>Sign Up</Trans>
        </CustomButton>
      </form>
      {CardBlur ? CardBlur : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  signUpStart: (email, firstname, lastname, date, phone, file, password) =>
    dispatch(
      signUpStart(email, firstname, lastname, date, phone, file, password)
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardSignUp);
